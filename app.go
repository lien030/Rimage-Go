package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

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

var tasksChan = make(chan Task, 1024)
var goroutines = make(map[string]*ControlledGoroutine)
var wg sync.WaitGroup

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
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

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Check directory exists
func (a *App) IsDirectory(dir string) bool {
	fileInfo, err := os.Stat(dir)
	if err != nil {
		return false
	}
	return fileInfo.IsDir()
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

func (a *App) imageProcessWorker(workerId string, workerCtx context.Context) {
	for {
		select {
		case task := <-tasksChan:
			fmt.Printf("Worker %s is processing task %s\n", workerId, task.ID)
			a.setWorkerStatus(workerId, "running", task)
			processImage(task)
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

func (a *App) NewWorker(worker ProcessWorker) bool {
	a.startGoroutine(worker.ID)
	fmt.Println("goroutines length: ", len(goroutines))
	return true
}

func (a *App) RemoveWorker(id string) bool {
	stopGoroutine(id)
	return true
}

func processImage(task Task) {
	// Process image
	fmt.Printf("Processing image %s\n", task.FileName)
	time.Sleep(3 * time.Second)
}

func (a *App) setWorkerStatus(workerId string, status string, task Task) {
	runtime.EventsEmit(a.ctx, "setWorkerStatus", workerId, status, task)
}

func (a *App) removeFrontendTask(task Task) {
	runtime.EventsEmit(a.ctx, "removeTask", task.ID)
}
