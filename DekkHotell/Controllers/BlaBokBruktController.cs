using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DekkHotell.Controllers
{
    [Route("api/v1/blabokbrukt")]
    public class BlaBokBruktController : Controller
    {
        [HttpGet, Route("")]
        public JsonResult Index(int? year, int? car_status)
        {
            year ??= DateTime.Now.Year;
            var blaBokSet = LoadBlaBokSetJson((int)year);
            car_status ??= 1;
            if (car_status >= 2)
            {
                blaBokSet = GetBlaBokBruktEntriesWitLatStatus((int)car_status, blaBokSet);
            }

            return Json(new BlaBokBruktResult { Data = blaBokSet });
        }

        private List<BlaBokBruktEntry> GetBlaBokBruktEntriesWitLatStatus(int carStatus, List<BlaBokBruktEntry> blaBokSet)
        {
            var finalResult = new List<BlaBokBruktEntry>();
            if (carStatus == 2)
            {
                // sold
                foreach (var blabok in blaBokSet)
                {
                    if (blabok.Solgt != null)
                    {
                        finalResult.Add(blabok);
                    }
                }
                return finalResult;
            }
            if (carStatus == 3)
            {
                // not sold
                foreach (var blabok in blaBokSet)
                {
                    if (blabok.Solgt == null)
                    {
                        finalResult.Add(blabok);
                    }
                }
                return finalResult;
            }
            // return empty
            return finalResult;
        }

        [HttpPut, Route("{nr}")]
        public ActionResult Update(int nr, BlaBokBruktEntry blaBokEntry)
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
            List<BlaBokBruktEntry> oldBlaBokSet;
            BlaBokBruktEntry? oldVersion;
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
        public ActionResult Create(BlaBokBruktEntry blaBokEntry)
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

        private static LastBlaBokBruktEntryVersion GetLastVersionBlaBok(BlaBokBruktEntry blaBok)
        {
            return new LastBlaBokBruktEntryVersion()
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
                Forfatter = blaBok.Forfatter,
                Solgt = blaBok.Solgt
            };
        }

        private static void GetBlaBokEntryStuff(BlaBokBruktEntry blaBokEntry, int nr, out List<BlaBokBruktEntry> blaBokSet, out BlaBokBruktEntry? foundBlaBokEntry, out int setIndex, out int versionYear)
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

        private static BlaBokBruktRunningNumber GetNextNumber()
        {
            try
            {
                string fileName = "blabokbrukt-running-number.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<BlaBokBruktRunningNumber>(json);
                    if (result != null)
                    {
                        return result;
                    }
                }
            }
            catch
            {
                // error
                return new BlaBokBruktRunningNumber() { Number = -1 };
            }
            return new BlaBokBruktRunningNumber() { Number = -1 };
        }

        private static bool SaveBlaBokSetJson(List<BlaBokBruktEntry> blaBokSet, int year)
        {
            try
            {
                string fileName = $"blabokbrukt{year}.json";
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

        private static bool SaveNextNumberJson(BlaBokBruktRunningNumber blaBokRunningNumber)
        {
            blaBokRunningNumber = CheckNextNumber(blaBokRunningNumber);
            try
            {
                string fileName = "blabokbrukt-running-number.json";
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

        private static BlaBokBruktRunningNumber CheckNextNumber(BlaBokBruktRunningNumber blaBokRunningNumber)
        {
            string blaBokNumberAsString = blaBokRunningNumber.Number.ToString();
            string firstNumber = blaBokNumberAsString.Substring(0, 1);
            var number = Int32.Parse(firstNumber);
            if (number%2 != 0)
            {
                // odd number - skip
                number += 1;
                blaBokRunningNumber.Number = number * 1000;
                return blaBokRunningNumber;
            }
            return blaBokRunningNumber;
        }

        private static List<BlaBokBruktEntry> LoadBlaBokSetJson(int year, bool force = false)
        {
            try
            {
                string fileName = $"blabokbrukt{year}.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<List<BlaBokBruktEntry>>(json);
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
                return new List<BlaBokBruktEntry>();
            }
            return new List<BlaBokBruktEntry>();
        }

        private static List<BlaBokBruktEntry> CreateNewBlaBokYear(int year)
        {
            var blaBokSet = new List<BlaBokBruktEntry>();
            try
            {
                string fileName = $"blabokbrukt{year}.json";
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
