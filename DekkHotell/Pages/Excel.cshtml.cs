using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DekkHotell.Pages
{
    public class ExcelModel : PageModel
    {
        private readonly ILogger<ExcelModel> _logger;
        //private readonly MenuHelper menuHelper;
        public Auth? Authorization { get; set; }

        public ExcelModel(ILogger<ExcelModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            Authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
        }
    }
}