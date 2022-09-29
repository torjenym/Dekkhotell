namespace DekkHotell.Models
{
    public class TireSet
    {
        public int Id { get; set; }
        public string? Lokasjon { get; set; }
        public string? RegNr { get; set; }
        public string? Fornavn { get; set; }
        public string? Etternavn { get; set; }
        public string? Tlf { get; set; }
        public string? Epost { get; set; }
        public string? Notat { get; set; }
        public string? Merke { get; set; }
        public string? Modell { get; set; }
        public string? Avtale { get; set; }
        public DateTime? Betalt { get; set; }
        public LastVersion? ForrigeVersjon { get; set; }
        public string? Forfatter { get; set; }
    }

    public class LastVersion
    {
        public int Id { get; set; }
        public string? Lokasjon { get; set; }
        public string? RegNr { get; set; }
        public string? Fornavn { get; set; }
        public string? Etternavn { get; set; }
        public string? Tlf { get; set; }
        public string? Epost { get; set; }
        public string? Notat { get; set; }
        public string? Merke { get; set; }
        public string? Modell { get; set; }
        public string? Avtale { get; set; }
        public DateTime? Betalt { get; set; }
        public string? Forfatter { get; set; }
    }

    public class TireSetResult
    {
        public List<TireSet>? Data { get; set; }
    }
}
