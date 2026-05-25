using Microsoft.UI.Xaml;

namespace NotionCalendarWidget;

sealed class Program
{
    [STAThread]
    static int Main(string[] args)
    {
        WinUIApplication.Run(new App());
        return 0;
    }
}
