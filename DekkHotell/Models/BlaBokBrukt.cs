namespace DekkHotell.Models
{
    public class BlaBokBruktEntry
    {
        public int Nr { get; set; }
        public DateTime InnDato { get; set; }
        public string? RegNr { get; set; }
        public string? BilType { get; set; }
        public int? Arsmodell { get; set; }
        public int? Km { get; set; }
        public string? Selger { get; set; }
        public string? NyEier { get; set; }
        public string? ForrigeEier { get; set; }
        public int? Innpris { get; set; }
        public int? Utpris { get; set; }
        public string? Innbytte { get; set; }
        public string? Garanti { get; set; }
        public string? NokkelNr { get; set; }
        public string? Forfatter { get; set; }
        public DateTime? Solgt { get; set; }
        public LastBlaBokBruktEntryVersion? ForrigeVersjon { get; set; }
    }

    public class LastBlaBokBruktEntryVersion
    {
        public int Nr { get; set; }
        public DateTime InnDato { get; set; }
        public string? RegNr { get; set; }
        public string? BilType { get; set; }
        public int? Arsmodell { get; set; }
        public int? Km { get; set; }
        public string? Selger { get; set; }
        public string? NyEier { get; set; }
        public string? ForrigeEier { get; set; }
        public int? Innpris { get; set; }
        public int? Utpris { get; set; }
        public string? Innbytte { get; set; }
        public string? Garanti { get; set; }
        public string? NokkelNr { get; set; }
        public string? Forfatter { get; set; }
        public DateTime? Solgt { get; set; }
    }

    public class BlaBokBruktResult
    {
        public List<BlaBokBruktEntry>? Data { get; set; }
    }

    public class BlaBokBruktRunningNumber
    {
        public int Number { get; set; }
    }
}
