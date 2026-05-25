# Notion Calendar Widget for Windows 11

A Windows 11 desktop widget that displays your Notion Calendar. This application uses WinUI 3 and WebView2 to embed and display https://calendar.notion.so/ on your desktop.

## Features

- 📅 Display Notion Calendar directly on your desktop
- 🎨 Windows 11 native design
- 🌐 Built with WinUI 3 and WebView2
- ⚡ Lightweight and responsive
- 📍 Persistent window state


- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) with C# and Windows App SDK workload installed, OR
- [Visual Studio Code](https://code.visualstudio.com/) with C# Dev Kit extension

## Prerequisites

- Windows 10 version 19041 or later (Windows 11 recommended)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) with C# and Windows App SDK workload installed, OR
- [Visual Studio Code](https://code.visualstudio.com/) with C# Dev Kit extension

### Install WebView2 Runtime (if not already installed)

The WebView2 runtime is required to display web content. You can:
1. Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
2. Or it will be installed automatically when you run the application for the first time

## Project Structure

```
Notion Calendar Widget/
├── App.xaml                    # Application resources and startup
├── App.xaml.cs                 # Application code-behind
├── MainWindow.xaml             # Main window UI definition
├── MainWindow.xaml.cs          # Main window logic
├── Program.cs                  # Application entry point
├── NotionCalendarWidget.csproj # Project configuration
├── .gitignore                  # Git ignore file
└── README.md                   # This file
```

## Building the Project

### Using Visual Studio 2022

1. Open `NotionCalendarWidget.csproj` in Visual Studio 2022
2. Ensure you have the "Windows App SDK" workload installed:
   - Go to Tools → Get Tools and Features
   - Select "Windows App SDK" workload
3. Build the solution: Ctrl+Shift+B
4. Run: F5 or Debug → Start Debugging

### Using Visual Studio Code

1. Ensure .NET 8 SDK is installed:
   ```powershell
   dotnet --version
   ```

2. Restore and build:
   ```powershell
   dotnet restore
   dotnet build
   ```

3. Run the application:
   ```powershell
   dotnet run
   ```

### Using Command Line

```powershell
# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run

# Build for release
dotnet build -c Release

# Publish as self-contained
dotnet publish -c Release --self-contained
```

## Running the Application

Once built, you can:

1. **Run from Visual Studio/VS Code** - Press F5 to launch with debugging
2. **Run the executable directly** - Navigate to `bin/Release/net8.0-windows10.0.19041.0/win-x64/` and double-click `NotionCalendarWidget.exe`
3. **Create a shortcut** - Pin the executable to your Start menu or desktop for quick access

## Features & Usage

- **Display**: The widget displays your Notion Calendar at https://calendar.notion.so/
- **Window Controls**: Standard Windows title bar with minimize, maximize, and close buttons
- **Status Bar**: Shows loading status and connection information
- **Persistent Login**: Your Notion login session is preserved between launches
- **Responsive**: The web view automatically adapts to window resizing

## Customization

### Change the Notion Calendar URL

Edit `MainWindow.xaml.cs` and modify the URL:

```csharp
private const string NotionCalendarUrl = "https://calendar.notion.so/";
```

### Window Size

Change the default window size in `MainWindow.xaml.cs`:

```csharp
AppWindow.Resize(new Windows.Graphics.SizeInt32(1000, 800)); // Width x Height
```

### Appearance

Modify the XAML in `MainWindow.xaml` to change:
- Title bar appearance
- Status bar colors
- Window styling
- Theme colors

## Troubleshooting

### WebView2 Not Found
- Install the WebView2 runtime from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
- Or download the "Evergreen Bootstrapper": https://go.microsoft.com/fwlink/p/?LinkId=2124703

### Build Errors
- Ensure you have .NET 8 SDK installed: `dotnet --version`
- Verify Windows SDK version 19041 or later is installed
- Clear NuGet cache: `dotnet nuget locals all --clear`
- Rebuild: `dotnet clean && dotnet build`

### Cannot Load Notion Calendar
- Check your internet connection
- Ensure https://calendar.notion.so/ is accessible in your browser
- Clear WebView2 cache (located in `%APPDATA%\Local\Packages\` or application data folder)

### Permission Issues
- Run as Administrator if you encounter permission errors
- On first run, you may need to authenticate with your Notion account

## Future Enhancements

Potential improvements:
- [ ] Add authentication handling
- [ ] Implement window always-on-top toggle
- [ ] Add refresh button
- [ ] Implement notifications for calendar events
- [ ] Add custom themes
- [ ] Create Windows 11 widget package (MSIX)
- [ ] Add system tray integration
- [ ] Implement URL customization settings

## Dependencies

- **Microsoft.WindowsAppSDK** - Windows App SDK for WinUI 3
- **Microsoft.Windows.SDK.BuildTools** - SDK build tools
- **CommunityToolkit.Mvvm** - MVVM utilities (optional, for future enhancements)

## License

This project is provided as-is for personal use.

## Support

For issues or suggestions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Check the WebView2 runtime version

## Notes

- The application requires an internet connection to display the Notion calendar
- Your Notion login session is persistent and stored by the browser engine
- The widget respects your system theme (Light/Dark mode)
