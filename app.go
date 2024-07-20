package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

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
