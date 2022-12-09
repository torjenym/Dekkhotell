using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DekkHotell.Pages
{
    public class BlaBokModel : PageModel
    {
        private readonly ILogger<BlaBokModel> _logger;
        public Auth? Authorization { get; set; }

        public BlaBokModel(ILogger<BlaBokModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            Authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
        }
    }
}