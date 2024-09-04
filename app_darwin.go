package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	rt "runtime"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

type DirectoryPickerResponse struct {
	Result bool   `json:"result"`
	Dir    string `json:"dir"`
}

type FilesPickerResponse struct {
	Result bool     `json:"result"`
	Files  []string `json:"files"`
}

type Task struct {
	ID       string `json:"id"`
	Status   string `json:"status"`
	FilePath string `json:"filePath"`
	FileName string `json:"fileName"`
}

type ProcessWorker struct {
	ID     string `json:"id"`
	Status string `json:"status"`
	Task   Task   `json:"task"`
}

type ControlledGoroutine struct {
	ID      string
	Cancel  context.CancelFunc
	Running bool
}

type RimageParams struct {
	Quality      int    `json:"quality"`
	Quantization int    `json:"quantization"`
	Dithering    int    `json:"dithering"`
	Resize       bool   `json:"resize"`
	Width        int    `json:"resizeWidth"`
	Height       int    `json:"resizeHeight"`
	Filter       string `json:"filter"`
	Threads      int    `json:"threads"`
	Suffix       string `json:"suffix"`
	Backup       bool   `json:"backup"`
	Recursive    bool   `json:"recursive"`
	Format       string `json:"format"`
	OutputDir    string `json:"outputDir"`
}

var tasksChan = make(chan Task, 2048)
var goroutines = make(map[string]*ControlledGoroutine)
var wg sync.WaitGroup

var rimageParams = RimageParams{
	Quality:      75,
	Quantization: 100,
	Dithering:    100,
	Resize:       false,
	Width:        0,
	Height:       0,
	Filter:       "lanczos3",
	Threads:      4,
	Backup:       false,
	Recursive:    false,
	Format:       "mozjpeg",
	OutputDir:    "",
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
	result := a.GetUserDownloadsDir()
	if result.Result {
		rimageParams.OutputDir = result.Dir
	}
	// fmt.Println("Running on: ", rt.GOOS)
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
	// go testPrintTask(ctx)
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

////////////// Dir //////////////

// Check directory exists
func (a *App) IsDirectory(dir string) bool {
	fileInfo, err := os.Stat(dir)
	if err != nil {
		return false
	}
	return fileInfo.IsDir()
}

// Check file exists
func IsFile(file string) bool {
	fileInfo, err := os.Stat(file)
	if err != nil {
		return false
	}
	return !fileInfo.IsDir()
}

func (a *App) DirectoryPicker() DirectoryPickerResponse {
	dir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return DirectoryPickerResponse{
			Result: false,
			Dir:    dir,
		}
	}
	if dir == "" {
		return DirectoryPickerResponse{
			Result: false,
			Dir:    dir,
		}
	}
	return DirectoryPickerResponse{
		Result: true,
		Dir:    dir,
	}
}

func (a *App) FilePicker() FilesPickerResponse {
	files, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return FilesPickerResponse{
			Result: false,
			Files:  files,
		}
	}
	return FilesPickerResponse{
		Result: len(files) > 0,
		Files:  files,
	}
}

func (a *App) ParseFileName(path string) string {
	return filepath.Base(path)
}

func (a *App) GetUserDownloadsDir() DirectoryPickerResponse {
	home, err := os.UserHomeDir()
	if err != nil {
		return DirectoryPickerResponse{
			Result: false,
			Dir:    "",
		}
	}
	downloads := filepath.Join(home, "Downloads")
	return DirectoryPickerResponse{
		Result: true,
		Dir:    downloads,
	}
}

////////////// Tasks //////////////

func (a *App) SetTaskChannel(tasks []Task) bool {
	for _, task := range tasks {
		fmt.Printf("Adding task %s to channel, fileName: %s\n", task.ID, task.FileName)
		tasksChan <- task
	}
	return true
}

func (a *App) ClearTaskChannel() bool {
	for len(tasksChan) > 0 {
		<-tasksChan
	}
	return true
}

////////////// Goroutines //////////////

func NewControlledGoroutine(id string, cancel context.CancelFunc) *ControlledGoroutine {
	return &ControlledGoroutine{
		ID:     id,
		Cancel: cancel,
	}
}

func (a *App) startGoroutine(id string) {
	ctx, cancel := context.WithCancel(context.Background())
	goroutine := NewControlledGoroutine(id, cancel)
	goroutines[id] = goroutine
	goroutine.Running = true

	wg.Add(1)
	go a.imageProcessWorker(id, ctx)
}

func stopGoroutine(id string) {
	if goroutine, ok := goroutines[id]; ok && goroutine.Running {
		goroutine.Cancel()
		delete(goroutines, id)
	}
}

func (a *App) NewWorker(worker ProcessWorker) bool {
	a.startGoroutine(worker.ID)
	fmt.Println("goroutines length: ", len(goroutines))
	return true
}

func (a *App) RemoveWorker(id string) bool {
	stopGoroutine(id)
	return true
}

func (a *App) imageProcessWorker(workerId string, workerCtx context.Context) {
	for {
		select {
		case task := <-tasksChan:
			fmt.Printf("Worker %s is processing task %s\n", workerId, task.ID)
			a.setWorkerStatus(workerId, "running", task)
			a.processImage(task)
			a.setWorkerStatus(workerId, "idle", task)
			a.removeFrontendTask(task)
			fmt.Println("Tasks channel length: ", len(tasksChan))
		case <-workerCtx.Done():
			wg.Done()
			fmt.Printf("Worker %s is Done.\n", workerId)
			return
		}
	}
}

func (a *App) processImage(task Task) bool {
	// Process image
	fmt.Printf("Processing image %s\n", task.FileName)
	// time.Sleep(3 * time.Second)
	rimageExeName := "./rimage"
	if rt.GOOS == "windows" {
		rimageExeName = "./rimage.exe"
	}
	rimageCommand := []string{
		rimageExeName,
		"-q", fmt.Sprintf("%d", rimageParams.Quality),
		"-f", rimageParams.Format,
		"-t", fmt.Sprintf("%d", rimageParams.Threads),
	}

	if rimageParams.Quantization != 100 || rimageParams.Dithering != 100 {
		rimageCommand = append(rimageCommand, "--quantization", fmt.Sprintf("%d", rimageParams.Quantization), "--dithering", fmt.Sprintf("%d", rimageParams.Dithering))
	}

	// Resize
	if rimageParams.Resize {
		rimageCommand = append(rimageCommand, "--width", fmt.Sprintf("%d", rimageParams.Width), "--height", fmt.Sprintf("%d", rimageParams.Height), "--filter", rimageParams.Filter)
	}

	// Backup
	if rimageParams.Backup {
		rimageCommand = append(rimageCommand, "-b")
	}

	// Suffix
	if rimageParams.Suffix != "" {
		rimageCommand = append(rimageCommand, "-s", rimageParams.Suffix)
	}

	// Recursive
	if rimageParams.Recursive {
		rimageCommand = append(rimageCommand, "-r")
	} else {
		rimageCommand = append(rimageCommand, "-o", rimageParams.OutputDir)
	}

	// Add file path
	rimageCommand = append(rimageCommand, task.FilePath)
	// runtime.EventsEmit(a.ctx, "notify", fmt.Sprintf("cmd: %v", rimageCommand))

	cmd := exec.Command(rimageCommand[0], rimageCommand[1:]...)
	output, _ := cmd.Output()

	// i don't know how to know if the command is successful or not
	if len(output) > 0 {
		fmt.Println(string(output))
		runtime.EventsEmit(a.ctx, "error", string(output))
		return false
	} else {
		return true
	}
}

func (a *App) setWorkerStatus(workerId string, status string, task Task) {
	runtime.EventsEmit(a.ctx, "setWorkerStatus", workerId, status, task)
}

func (a *App) removeFrontendTask(task Task) {
	runtime.EventsEmit(a.ctx, "removeTask", task.ID)
}

func (a *App) SetRimageParams(params RimageParams) bool {
	rimageParams = RimageParams{
		Quality:      params.Quality,
		Quantization: params.Quantization,
		Dithering:    params.Dithering,
		Resize:       params.Resize,
		Width:        params.Width,
		Height:       params.Height,
		Filter:       params.Filter,
		Threads:      params.Threads,
		Suffix:       params.Suffix,
		Backup:       params.Backup,
		Recursive:    params.Recursive,
		Format:       params.Format,
		OutputDir:    params.OutputDir,
	}
	// fmt.Println("Setting rimage params: ", params)
	return true
}

func (a *App) IsWin11() bool {
	return false
}
