package main

import (
	"embed"
	"fmt"
	"log"
	"runtime"
	"strconv"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"golang.org/x/sys/windows/registry"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// check windows version
	windowsTheme := windows.None
	isWin11 := false
	if runtime.GOOS == "windows" {
		k, err := registry.OpenKey(registry.LOCAL_MACHINE, `SOFTWARE\Microsoft\Windows NT\CurrentVersion`, registry.QUERY_VALUE)
		if err != nil {
			fmt.Println(err)
		} else {
			cb, _, err := k.GetStringValue("CurrentBuild")
			if err != nil {
				fmt.Println(err)
			} else {
				build, _ := strconv.Atoi(cb)
				fmt.Println("Windows Build: ", build)
				if build >= 22000 {
					windowsTheme = windows.Mica
					isWin11 = true
				}
			}
		}
		defer k.Close()
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:             "Rimage-Go",
		Width:             840,
		Height:            560,
		MinWidth:          840,
		MinHeight:         560,
		MaxWidth:          840,
		MaxHeight:         560,
		DisableResize:     true,
		Fullscreen:        false,
		Frameless:         true,
		StartHidden:       false,
		HideWindowOnClose: false,
		BackgroundColour:  &options.RGBA{R: 248, G: 249, B: 253, A: 250},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Menu:     nil,
		Logger:   nil,
		LogLevel: logger.DEBUG,
		DragAndDrop: &options.DragAndDrop{
			EnableFileDrop:     true,
			DisableWebViewDrop: true,
		},
		OnStartup:        app.startup,
		OnDomReady:       app.domReady,
		OnBeforeClose:    app.beforeClose,
		CSSDragProperty:  "--wails-draggable",
		CSSDragValue:     "drag",
		OnShutdown:       app.shutdown,
		WindowStartState: options.Normal,
		Bind: []interface{}{
			app,
		},
		// Windows platform specific options
		Windows: &windows.Options{
			Theme:                windows.SystemDefault,
			WebviewIsTransparent: isWin11,
			WindowIsTranslucent:  isWin11,
			BackdropType:         windowsTheme,
			DisableWindowIcon:    false,
			// DisableFramelessWindowDecorations: false,
			WebviewUserDataPath: "",
			ZoomFactor:          1.0,
		},
		// Mac platform specific options
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
				HideTitle:                  true,
				HideTitleBar:               true,
				FullSizeContent:            false,
				UseToolbar:                 false,
				HideToolbarSeparator:       true,
			},
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   "rimage-go",
				Message: "",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
