using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Xml.Linq;

namespace DekkHotell.Controllers
{
    [Route("api/v1/tireset")]
    public class TireSetController : Controller
    {
        [HttpGet, Route("")]
        public JsonResult Index()
        {
            var tireSets = LoadTireSetJson();
            // AUTO SAVE BACKUP. BASED ON RANDOM, ABOUT ONCE EVERY 30 PAGELOAD 
            if (ShouldWeBackupTireSetJson())
            {
                SaveBackupOfTireSetJson(tireSets);
            }
            return Json(new TireSetResult { Data = tireSets });
        }

        // AUTH REQUIRED
        [HttpPut, Route("{id}")]
        public ActionResult Update(int id, TireSet tireSet)
        {
            Request.Headers.TryGetValue("Authorization", out var token);
            if (!SessionHelper.VerifyAuthToken(HttpContext.Session, token))
            {
                return Unauthorized();
            }

            var tireSets = LoadTireSetJson();
            tireSets[id] = tireSet;
            try
            {
                if (SaveTireSetJson(tireSets))
                {
                    return NoContent();
                }
                return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        private static bool ShouldWeBackupTireSetJson()
        {
            Random random = new Random();
            int num = random.Next(30);
            if (num == 0)
            {
                return true;
            }
            return false;
        }


        private static bool SaveTireSetJson(List<TireSet> tireSets)
        {
            try
            {
                string fileName = "tiresets.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamWriter file = new(path))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, tireSets);
                }
                return true;
            }
            catch
            {
                // error
                return false;
            }
        }

        private static void SaveBackupOfTireSetJson(List<TireSet> tireSets)
        {
            try
            {
                DateTime now = DateTime.Now;
                string fileName = $"tiresets.backup.{now.Day}.{now.Month}.{now.Year}.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamWriter file = new(path))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, tireSets);
                }
            }
            catch
            {
                // error
            }
        }

        private static List<TireSet> LoadTireSetJson()
        {
            try
            {
                string fileName = "tiresets.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<List<TireSet>>(json);
                    if (result != null)
                    {
                        return result;
                    }
                }
            }
            catch
            {
                // error
                return new List<TireSet>();
            }
            return new List<TireSet>();
        }

        //private readonly SolutionEnvironment myEnvironment;
        //public TireSetController(SolutionEnvironment solutionEnvironment)
        //{
        //    myEnvironment = solutionEnvironment;
        //}
        //[ValidateAntiForgeryToken]

        //// GET: HomeController/Details/5
        //public ActionResult Details(int id)
        //{
        //    return View();
        //}

        //// GET: HomeController/Create
        //public ActionResult Create()
        //{
        //    return View();
        //}

        // POST: HomeController/Create


        //// GET: HomeController/Edit/5
        //public ActionResult Edit(int id)
        //{
        //    return View();
        //}

        // PUT: /tireset/edit/5
        //[HttpPut]
        ////[ValidateAntiForgeryToken]
        //public ActionResult Edit(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: HomeController/Delete/5
        //public ActionResult Delete(int id)
        //{
        //    return View();
        //}

        //// POST: HomeController/Delete/5
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Delete(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}
    }
}
