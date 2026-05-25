using System;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using Microsoft.Web.WebView2.Wpf;

namespace NotionCalendarWidget;

public partial class MainWindow : Window
{
    private const string NotionCalendarUrl = "https://calendar.notion.so/";
    private WebView2? _webView;

    [DllImport("dwmapi.dll")]
    private static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);
    private const int DWMWA_WINDOW_CORNER_PREFERENCE = 33;
    private const int DWMWCP_ROUND = 2;

    public MainWindow()
    {
        InitializeComponent();
        
        // Position widget on right side of screen
        this.Left = SystemParameters.PrimaryScreenWidth - this.Width - 20;
        this.Top = 100;
        
        _ = InitializeWebView();
    }

    private const int WM_NCHITTEST = 0x0084;
    private const int HTLEFT = 10, HTRIGHT = 11, HTTOP = 12;
    private const int HTTOPLEFT = 13, HTTOPRIGHT = 14;
    private const int HTBOTTOM = 15, HTBOTTOMLEFT = 16, HTBOTTOMRIGHT = 17;
    private const int BorderSize = 8;

    private void Window_SourceInitialized(object sender, EventArgs e)
    {
        var hwnd = new WindowInteropHelper(this).Handle;

        // Apply Windows 11 rounded corners via DWM
        int pref = DWMWCP_ROUND;
        DwmSetWindowAttribute(hwnd, DWMWA_WINDOW_CORNER_PREFERENCE, ref pref, sizeof(int));

        // Hook WndProc so we intercept WM_NCHITTEST before WebView2 swallows edge clicks
        HwndSource.FromHwnd(hwnd)?.AddHook(WndProc);
    }

    private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
    {
        if (msg == WM_NCHITTEST)
        {
            // lParam is in physical screen pixels; WPF properties are in DIPs — must scale
            var source = PresentationSource.FromVisual(this);
            double dpiX = source?.CompositionTarget?.TransformToDevice.M11 ?? 1.0;
            double dpiY = source?.CompositionTarget?.TransformToDevice.M22 ?? 1.0;

            int lp = lParam.ToInt32();
            short sx = (short)(lp & 0xFFFF);
            short sy = (short)((lp >> 16) & 0xFFFF);

            // Convert window position/size to physical pixels for comparison
            double winLeft   = this.Left   * dpiX;
            double winTop    = this.Top    * dpiY;
            double winWidth  = this.ActualWidth  * dpiX;
            double winHeight = this.ActualHeight * dpiY;
            double border    = BorderSize * dpiX;

            double x = sx - winLeft;
            double y = sy - winTop;

            bool l = x < border;
            bool r = x > winWidth  - border;
            bool t = y < border;
            bool b = y > winHeight - border;

            if (t && l) { handled = true; return (IntPtr)HTTOPLEFT; }
            if (t && r) { handled = true; return (IntPtr)HTTOPRIGHT; }
            if (b && l) { handled = true; return (IntPtr)HTBOTTOMLEFT; }
            if (b && r) { handled = true; return (IntPtr)HTBOTTOMRIGHT; }
            if (l)      { handled = true; return (IntPtr)HTLEFT; }
            if (r)      { handled = true; return (IntPtr)HTRIGHT; }
            if (t)      { handled = true; return (IntPtr)HTTOP; }
            if (b)      { handled = true; return (IntPtr)HTBOTTOM; }
        }
        return IntPtr.Zero;
    }

    private async Task InitializeWebView()
    {
        try
        {
            // Create WebView2 control
            _webView = new WebView2();
            
            // Make sure it stretches to fill the container
            _webView.HorizontalAlignment = HorizontalAlignment.Stretch;
            _webView.VerticalAlignment = VerticalAlignment.Stretch;

            // Add to the container
            WebViewContainer.Child = _webView;

            // Initialize WebView2
            await _webView.EnsureCoreWebView2Async();

            // Navigate to Notion Calendar
            _webView.Source = new Uri(NotionCalendarUrl);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error: {ex.Message}");
        }
    }

    private void RefreshButton_Click(object sender, RoutedEventArgs e)
    {
        // Refresh the page
        if (_webView != null)
        {
            _webView.Reload();
        }
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e)
    {
        // Close the window
        Close();
    }
}

