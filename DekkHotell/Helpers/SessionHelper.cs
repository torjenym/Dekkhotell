using DekkHotell.Models;
using Newtonsoft.Json;

namespace DekkHotell.Helpers
{
    public static class SessionHelper
    {
        public static void SetSessionObjectAsJson(this ISession session, string key, object value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static void KillSessionObject(this ISession session, string key)
        {
            session.Remove(key);
        }

        public static bool VerifyAuthToken(this ISession session, string token)
        {
            var authorization = GetSessionObjectFromKey<Auth>(session, "auth");
            if (authorization == null || authorization.Token.ToString() != token)
            {
                return false;
            }
            return true;
        }

        public static T? GetSessionObjectFromKey<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            if (value == null)
            {
                return default;
            }
            return JsonConvert.DeserializeObject<T>(value);
        }
    }
}
