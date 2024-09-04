# Rimage Go

![GitHub License](https://img.shields.io/github/license/lien030/Rimage-Go?style=flat&color=blue)

为Rimage设计的GUI软件，通过并行调用提高批量压缩图片的效率。

拥有现代化界面同时保持较小的软件体积，适合需要快速处理大量图像数据的用户。

A GUI application designed for Rimage to improve the efficiency of batch image compression through parallel processing.

Featuring a modern interface while maintaining a small package size, it is suitable for users who need to quickly process large amounts of image data.

## Features

- 支持多国语言. Support for multiple languages
- 使用[Wails](https://wails.io/)框架开发, 支持跨平台. Using [Wails](https://wails.io/) to development support multi-platform
- Worker模式提高效率. Worker model improves efficiency



※自测创建20+个Worker压缩一千张5MB左右的图像用时不到一分钟(CPU 24c48t)

## Useage

🚧👷🚧

![MainScreen](/images/p1.png)

1. 添加任务 - 拖拽或点击`➕`	Add Task - Drag&Drop or Click `➕`
2. 添加Worker - 留意CPU占有率, 量力而行	Add Worker - Watch your CPU usage, act within your means.
3. ▶️Go

## Thanks

**🚀 法术之脉 Core of Rimage-Go**

- [GitHub - SalOne22/rimage: This is CLI tool inspired by squoosh!](https://github.com/SalOne22/rimage)

**💡 灵感之源 Source of inspiration**

- [GitHub - Mikachu2333/rimage_gui: A GUI software use rimage to compress images](https://github.com/Mikachu2333/rimage_gui)

## Todo List

1. 测试其他平台 Test on macOS(x86/arm64) / Linux(x86/arm64)
2. Rust重构万物, R门. Learn Rust and refactor with Tauri

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=lien030/Rimage-Go&type=Timeline)](https://star-history.com/#lien030/Rimage-Go&Timeline)