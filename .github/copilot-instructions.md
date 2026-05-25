<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Notion Calendar Widget - Development Instructions

This is a Windows 11 desktop widget application that displays the Notion Calendar using WinUI 3 and WebView2.

## Project Type
- **Language**: C#
- **Framework**: WinUI 3 (Windows App SDK 1.8+)
- **Target**: Windows 10 version 19041 or later
- **Runtime**: .NET 8

## Build & Run

### Prerequisites
1. **Install .NET 10 SDK**: https://dotnet.microsoft.com/download/dotnet/10.0
2. **Install Visual Studio 2022** with Windows App SDK workload, OR use **Visual Studio Code** with C# Dev Kit
3. **Install WebView2 Runtime**: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### Build & Execute

```powershell
# Restore and build
dotnet restore
dotnet build

# Run the application
dotnet run

# Build release
dotnet build -c Release
```

### Debug
- **VS 2022**: Press F5 to start debugging
- **VS Code**: Use the C# debug configuration or press F5

## Project Structure

```
├── App.xaml / App.xaml.cs          - Application startup and resources
├── MainWindow.xaml / .cs           - Main UI and WebView2 initialization
├── Program.cs                      - Entry point
├── NotionCalendarWidget.csproj     - Project configuration
└── README.md                       - User documentation
```

## Key Components

- **MainWindow**: Houses the WebView2 control that displays https://calendar.notion.so/
- **WebView2**: Embeds Edge/Chromium browser to display web content
- **Title Bar**: Custom title bar with status indicator
- **Status Bar**: Shows connection/loading status

## Common Tasks

### Change Calendar URL
Edit `MainWindow.xaml.cs`, change `NotionCalendarUrl` constant.

### Modify Window Size
In `MainWindow.xaml.cs`, change the `AppWindow.Resize()` call.

### Customize UI
Edit `MainWindow.xaml` to modify the XAML layout and styling.

## Troubleshooting

- **Build fails**: Run `dotnet clean && dotnet build`
- **WebView2 missing**: Install from https://developer.microsoft.com/en-us/microsoft-edge/webview2/
- **Cannot load page**: Verify internet connection and Notion URL accessibility
- **Runtime errors**: Check WebView2 version compatibility with Windows App SDK version

## Publishing/Distribution

To create a standalone executable:
```powershell
dotnet publish -c Release --self-contained
```

The executable will be in `bin/Release/net8.0-windows10.0.19041.0/win-x64/publish/`

## Resources

- [Windows App SDK Documentation](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/)
- [WinUI 3 Documentation](https://learn.microsoft.com/en-us/windows/apps/winui/winui3/)
- [WebView2 Documentation](https://learn.microsoft.com/en-us/microsoft-edge/webview2/)
