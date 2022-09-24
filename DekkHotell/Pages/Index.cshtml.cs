using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;

namespace DekkHotell.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        public Auth? Authorization { get; set; }

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            Authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
        }
    }
}