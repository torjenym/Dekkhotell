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

        [HttpPost, Route("login")]
        public JsonResult Login(Login login)
        {
            if (login.Username == null || login.Username.Length <= 2)
            {
                return Json(new AuthResponse() {  Success = false });
            }
            if (login.Password == null || login.Password.Length <= 2)
            {
                return Json(new AuthResponse() { Success = false });
            }
            string password = m_config[$"Users:{login.Username.ToLower()}"];
            if (password == null) 
            {
                return Json(new AuthResponse() { Success = false });
            }
            if (login.Password != password)
            {
                return Json(new AuthResponse() { Success = false });
            }

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
                return Json(new AuthResponse() { Success = false });
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
