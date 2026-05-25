using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.Web.WebView2.Core;

namespace NotionCalendarWidget;

public sealed partial class MainWindow : Window
{
    private const string NotionCalendarUrl = "https://calendar.notion.so/";
    private WebView2? _webView;

    public MainWindow()
    {
        InitializeComponent();
        Title = "Notion Calendar Widget";
        
        // Set window size
        AppWindow.Resize(new Windows.Graphics.SizeInt32(800, 600));
        
        // Initialize WebView2
        _ = InitializeWebView();
    }

    private async Task InitializeWebView()
    {
        try
        {
            StatusText.Text = "Initializing WebView2...";
            
            // Create WebView2 control
            _webView = new WebView2();
            
            // Add to the grid
            var grid = (Grid)Content;
            grid.Children.Insert(1, _webView);
            
            // Set position and margins
            _webView.Margin = new Thickness(0, 40, 0, 30);
            
            // Wait for WebView2 to initialize
            await _webView.EnsureCoreWebView2Async();
            
            // Navigate to Notion Calendar
            _webView.Source = new Uri(NotionCalendarUrl);
            
            // Handle navigation events
            _webView.NavigationStarting += (s, e) =>
            {
                StatusText.Text = "Loading...";
            };

            _webView.NavigationCompleted += (s, e) =>
            {
                if (e.IsSuccess)
                {
                    StatusText.Text = "Ready";
                }
                else
                {
                    StatusText.Text = "Navigation failed";
                }
            };

            _webView.CoreWebView2.NewWindowRequested += (s, e) =>
            {
                e.Handled = true;
            };
        }
        catch (Exception ex)
        {
            StatusText.Text = $"Error: {ex.Message}";
        }
    }
}
