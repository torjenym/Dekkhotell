using Newtonsoft.Json;
using DekkHotell.Models;

namespace DekkHotell.Helpers
{
    public static class UserSetting
    {

        public static void UpdateUserSetting(string username, string newPassword)
        {
            try
            {
                var users = new UsersConfig();
                string fileName = "users.json";
                string path = Path.Combine(Environment.CurrentDirectory, @"Data\", @"Json\", fileName);

                // READ USERS
                using (StreamReader r = new(path))
                {
                    string json = r.ReadToEnd();
                    var result = JsonConvert.DeserializeObject<UsersConfig>(json);
                    if (result != null)
                    {
                        users = result;
                    }
                }

                // FIND USER AND EDIT PW
                if (users.Users != null && users.Users.Listed != null)
                {
                    foreach (var user in users.Users.Listed)
                    {
                        if (user.Username == username.ToLower())
                        {
                            user.Password = newPassword;
                        }
                    }
                }

                // WRITE USERS
                using (StreamWriter file = new(path))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Serialize(file, users);
                }
            }
            catch
            {
                // error
                throw;
            }
        }
    }
}
