using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace DekkHotell.Controllers
{
    [Route("api/v1/blabok")]
    public class BlaBokController : Controller
    {
        [HttpGet, Route("")]
        public JsonResult Index(int? year)
        {
            year ??= DateTime.Now.Year;
            var blaBokSet = LoadBlaBokSetJson((int)year);
            return Json(new BlaBokResult { Data = blaBokSet });
        }

        [HttpPut, Route("{nr}")]
        public ActionResult Update(int nr, BlaBokEntry blaBokEntry)
        {
            Request.Headers.TryGetValue("Authorization", out var token);
            if (!SessionHelper.VerifyAuthToken(HttpContext.Session, token))
            {
                return Unauthorized();
            }
            var authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
            if (authorization == null || authorization.Username == null)
            {
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 300");
            }

            // get setIndex and block
            List<BlaBokEntry> oldBlaBokSet;
            BlaBokEntry? oldVersion;
            int oldSetIndex;
            int oldYear;
            GetBlaBokEntryStuff(blaBokEntry, nr, out oldBlaBokSet, out oldVersion, out oldSetIndex, out oldYear);

            if (oldSetIndex < 0 || oldVersion == null)
            {
                // NOT FOUND
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 301");
            }

            if (oldYear == blaBokEntry.InnDato.Year)
            {
                // SAME YEAR, just update
                blaBokEntry.ForrigeVersjon = GetLastVersionBlaBok(oldVersion);
                blaBokEntry.Forfatter = authorization.Username;
                oldBlaBokSet[oldSetIndex] = blaBokEntry;

                try
                {
                    if (SaveBlaBokSetJson(oldBlaBokSet, oldYear))
                    {
                        return NoContent();
                    }
                    return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 302");
                }
                catch
                {
                    return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 303");
                }
            } 
            else
            {
                var replaceYear = blaBokEntry.InnDato.Year;
                var replaceBlaBokSet = LoadBlaBokSetJson(replaceYear, true);
                blaBokEntry.ForrigeVersjon = GetLastVersionBlaBok(oldVersion);
                blaBokEntry.Forfatter = authorization.Username;
                replaceBlaBokSet.Add(blaBokEntry);
                try
                {
                    // ADD NEW
                    if (SaveBlaBokSetJson(replaceBlaBokSet, replaceYear))
                    {
                        oldBlaBokSet.RemoveAt(oldSetIndex);
                        // REMOVE OLD
                        if (SaveBlaBokSetJson(oldBlaBokSet, oldYear))
                        {
                            return NoContent();
                        }
                        return BadRequest("Noe gikk galt på server. NY versjon av oppføring ble laget, men gamle kunne IKKE slettes :( Vennligst kontakt Torje. Feilkode 304");
                    }
                    return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 305");
                }
                catch
                {
                    return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 306");
                }
            }
        }

        [HttpPost, Route("")]
        public ActionResult Create(BlaBokEntry blaBokEntry)
        {
            Request.Headers.TryGetValue("Authorization", out var token);
            if (!SessionHelper.VerifyAuthToken(HttpContext.Session, token))
            {
                return Unauthorized();
            }
            var authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
            if (authorization == null || authorization.Username == null)
            {
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 316");
            }

            try
            {
                var year = blaBokEntry.InnDato.Year;
                var blaBokSet = LoadBlaBokSetJson(year, true);
                var nextRecordNumber = GetNextNumber();
                if (nextRecordNumber.Number < 0)
                {
                    return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 310");
                }

                foreach (var blaBokEnt in blaBokSet)
                {
                    if (blaBokEnt.Nr == nextRecordNumber.Number)
                    {
                        return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 312");
                    }
                }

                blaBokEntry.Nr = nextRecordNumber.Number;

                nextRecordNumber.Number++;
                if (!SaveNextNumberJson(nextRecordNumber))
                {
                    return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 313");
                }

                blaBokEntry.Forfatter = authorization.Username;
                blaBokSet.Add(blaBokEntry);
                if (SaveBlaBokSetJson(blaBokSet, year))
                {
                    return NoContent();
                }
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 314");
            }
            catch
            {
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 315");
            }
        }

        private static LastBlaBokEntryVersion GetLastVersionBlaBok(BlaBokEntry blaBok)
        {
            return new LastBlaBokEntryVersion()
            {
                Nr = blaBok.Nr,
                InnDato = blaBok.InnDato,
                RegNr = blaBok.RegNr,
                BilType = blaBok.BilType,
                Arsmodell = blaBok.Arsmodell,
                Km = blaBok.Km,
                Selger = blaBok.Selger,
                NyEier = blaBok.NyEier,
                ForrigeEier = blaBok.ForrigeEier,
                Innpris = blaBok.Innpris,
                Utpris = blaBok.Utpris,
                Innbytte = blaBok.Innbytte,
                Garanti = blaBok.Garanti,
                NokkelNr = blaBok.NokkelNr,
                Forfatter = blaBok.Forfatter
            };
        }

        private static void GetBlaBokEntryStuff(BlaBokEntry blaBokEntry, int nr, out List<BlaBokEntry> blaBokSet, out BlaBokEntry? foundBlaBokEntry, out int setIndex, out int versionYear)
        {
            int year = blaBokEntry.InnDato.Year;
            var tempBlaBokSet = LoadBlaBokSetJson(year);
            var tempSetIndex = tempBlaBokSet.FindIndex(b => b.Nr == nr);
            if (tempSetIndex < 0)
            {
                year--;
                tempBlaBokSet = LoadBlaBokSetJson(year);
                tempSetIndex = tempBlaBokSet.FindIndex(b => b.Nr == nr);
                if (tempSetIndex < 0)
                {
                    year += 2; 
                    tempBlaBokSet = LoadBlaBokSetJson(year);
                    tempSetIndex = tempBlaBokSet.FindIndex(b => b.Nr == nr);
                }
            }
            blaBokSet = tempBlaBokSet;
            foundBlaBokEntry = tempBlaBokSet[tempSetIndex];
            versionYear = foundBlaBokEntry.InnDato.Year;
            setIndex = tempSetIndex;
        }

        private static BlaBokRunningNumber GetNextNumber()
        {
            try
            {
                string fileName = "blabok-running-number.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<BlaBokRunningNumber>(json);
                    if (result != null)
                    {
                        return result;
                    }
                }
            }
            catch
            {
                // error
                return new BlaBokRunningNumber() { Number = -1 };
            }
            return new BlaBokRunningNumber() { Number = -1 };
        }

        private static bool SaveBlaBokSetJson(List<BlaBokEntry> blaBokSet, int year)
        {
            try
            {
                string fileName = $"blabok{year}.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamWriter file = new(path))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, blaBokSet);
                }
                return true;
            }
            catch
            {
                // error
                return false;
            }
        }

        private static bool SaveNextNumberJson(BlaBokRunningNumber blaBokRunningNumber)
        {
            try
            {
                string fileName = "blabok-running-number.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamWriter file = new(path))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, blaBokRunningNumber);
                }
                return true;
            }
            catch
            {
                // error
                return false;
            }
        }

        //private static void SaveBackupOfTireSetJson(List<TireSet> tireSets)
        //{
        //    try
        //    {
        //        DateTime now = DateTime.Now;
        //        string fileName = $"tiresets.backup.{now.Day}.{now.Month}.{now.Year}.json";
        //        string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

        //        using (StreamWriter file = new(path))
        //        {
        //            JsonSerializer serializer = new JsonSerializer();
        //            serializer.Serialize(file, tireSets);
        //        }
        //    }
        //    catch
        //    {
        //        // error
        //    }
        //}

        private static List<BlaBokEntry> LoadBlaBokSetJson(int year, bool force = false)
        {
            try
            {
                string fileName = $"blabok{year}.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<List<BlaBokEntry>>(json);
                    if (result != null)
                    {
                        return result;
                    }
                }
            }
            catch (Exception e)
            {
                if (force)
                {
                    return CreateNewBlaBokYear(year);
                }
                return new List<BlaBokEntry>();
            }
            return new List<BlaBokEntry>();
        }

        private static List<BlaBokEntry> CreateNewBlaBokYear(int year)
        {
            var blaBokSet = new List<BlaBokEntry>();
            try
            {
                string fileName = $"blabok{year}.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamWriter file = new(path))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, blaBokSet);
                }
                return blaBokSet;
            }
            catch
            {
                return blaBokSet;
            }
        }
    }
}
