using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net;
using static System.Collections.Specialized.BitVector32;

namespace DekkHotell.Controllers
{
    [Route("api/v1/user")]
    public class UserController : Controller
    {
        [HttpGet, Route("seller")]
        public JsonResult GetSellers()
        {
            try
            {
                string fileName = "sellers.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<Sellers>(json);
                    if (result != null)
                    {
                        return Json(result);
                    }
                    return Json(new Sellers { Data = new List<Seller>() });
                }
            }
            catch
            {
                return Json(new Sellers { Data = new List<Seller>() });
            }
        }

        [HttpPut, Route("")]
        public ActionResult UpdateUser(MyUser myUser)
        {
            Request.Headers.TryGetValue("Authorization", out var token);
            if (!SessionHelper.VerifyAuthToken(HttpContext.Session, token))
            {
                return Unauthorized();
            }
            var authorization = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
            if (authorization == null || authorization.Username == null)
            {
                return BadRequest("Mismatch i bruker innlogget og bruker sendt fra client");
            }
            if (myUser.NewPassword == null || myUser.NewPassword.Length <= 3)
            {
                return BadRequest("Passord er ikke langt nok");
            }

            var mUsersConfig = new UsersConfig();
            try
            {
                string fileName = "users.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<UsersConfig>(json);
                    if (result != null)
                    {
                        mUsersConfig = result;
                    }
                }
            }
            catch
            {
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje");
            }

            bool found = false;
            if (mUsersConfig.Users != null && mUsersConfig.Users.Listed != null)
            {
                foreach (var user in mUsersConfig.Users.Listed)
                {
                    if (user.Username == authorization.Username)
                    {
                        if (user.Password == myUser.OldPassword)
                        {
                            found = true;
                            continue;
                        }
                    }
                }
            }
            if (!found)
            {
                return BadRequest("Brukernavn og gamle passord knytning finnes ikke");
            }

            UserSetting.UpdateUserSetting(authorization.Username, myUser.NewPassword);
            return Json(new RequestResponse() { Success = true });
        }
    }
}
