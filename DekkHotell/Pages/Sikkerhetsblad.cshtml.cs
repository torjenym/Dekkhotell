using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DekkHotell.Pages
{
    public class SikkerhetsbladModel : PageModel
    {
        private readonly ILogger<SikkerhetsbladModel> _logger;
        //private readonly MenuHelper menuHelper;
        public Auth? Authorization { get; set; }

        public SikkerhetsbladModel(ILogger<SikkerhetsbladModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            Authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
        }
    }
}