namespace DekkHotell.Models
{
    public class AuthResponse
    {
        public bool? Success { get; set; }
        public string? Username { get; set; }
        public Guid? Token { get; set; }
    }
}
