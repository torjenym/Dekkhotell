﻿using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DekkHotell.Pages
{
    public class PrivacyModel : PageModel
    {
        private readonly ILogger<PrivacyModel> _logger;
        //private readonly MenuHelper menuHelper;
        public Auth? Authorization { get; set; }

        public PrivacyModel(ILogger<PrivacyModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            Authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
        }
    }
}