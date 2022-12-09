namespace DekkHotell.Models
{
    public class Sellers
    {
        public List<Seller>? Data { get; set; }
    }
    public class Seller
    {
        public int? SalesPerson { get; set; }
        public string? Name { get; set; }
    }
}