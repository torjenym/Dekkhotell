using DekkHotell.Helpers;
using DekkHotell.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DekkHotell.Controllers
{
    [Route("api/v1/auth")]
    public class AuthController : Controller
    {
        private readonly IConfiguration m_config;

        public AuthController(IConfiguration config)
        {
            m_config = config;
        }

        [HttpGet, Route("keep-alive")]
        public ActionResult KeepAlive()
        {
            var auth = SessionHelper.GetSessionObjectFromKey<Auth>(HttpContext.Session, "auth");
            if (auth == null)
            {
                return BadRequest();
            }
            return Json(new AuthResponse() { Success = true });
        }   

        [HttpPost, Route("login")]
        public ActionResult Login(Login login)
        {
            if (login.Username == null || login.Username.Length <= 2)
            {
                return BadRequest();//Json(new AuthResponse() {  Success = false });
            }
            if (login.Password == null || login.Password.Length <= 2)
            {
                return BadRequest(); //return Json(new AuthResponse() { Success = false });
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
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 302");
                // TODO propper return
                //return Json(new AuthResponse() { Success = false });
            }

            bool found = false;
            if (mUsersConfig.Users != null && mUsersConfig.Users.Listed != null) {
                foreach (var user in mUsersConfig.Users.Listed)
                {
                    if (user.Username == login.Username.ToLower())
                    {
                        if (user.Password == login.Password)
                        {
                            found = true;
                            continue;
                        }
                    }
                }
            }

            if (!found) { return BadRequest("Feil brukernavn og/eller passord"); }

            try
            {
                var auth = new Auth()
                {
                    Username = login.Username,
                    ValidTo = DateTime.Now.AddDays(30),
                    Token = Guid.NewGuid()
                };
                SessionHelper.SetSessionObjectAsJson(HttpContext.Session, "auth", auth);

                return Json(new AuthResponse() { Success = true, Username = auth.Username, Token = auth.Token });
            } catch
            {
                return BadRequest("Noe gikk galt på server. Vennligst kontakt Torje. Feilkode 301");
                //return Json(new AuthResponse() { Success = false });
            }
        }

        [HttpDelete, Route("logout")]
        public JsonResult Logout()
        {
            try
            {
                SessionHelper.KillSessionObject(HttpContext.Session, "auth");
                return Json(new AuthResponse() { Success = true });
            } catch
            {
                return Json(new AuthResponse() { Success = false });
            }
        }
    }
}
