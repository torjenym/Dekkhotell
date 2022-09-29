namespace DekkHotell.Models
{
    public class UsersConfig
    {
        public Users? Users { get; set; }
    }

    public class Users
    {
        public List<User>? Listed { get; set; }
    }

    public class User
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}