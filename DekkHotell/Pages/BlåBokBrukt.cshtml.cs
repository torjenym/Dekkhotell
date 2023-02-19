using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DekkHotell.Pages
{
    public class BlaBokBruktModel : PageModel
    {
        private readonly ILogger<BlaBokBruktModel> _logger;
        public Auth? Authorization { get; set; }

        public BlaBokBruktModel(ILogger<BlaBokBruktModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            Authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
        }
    }
}