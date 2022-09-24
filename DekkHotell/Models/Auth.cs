namespace DekkHotell.Models
{
    public class Auth
    {
        public string? Username { get; set; }
        public DateTime? ValidTo { get; set; }
        public Guid? Token { get; set; }
    }
}
