namespace DekkHotell.Models
{
    public class BlaBokEntry
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
        public LastBlaBokEntryVersion? ForrigeVersjon { get; set; }
    }

    public class LastBlaBokEntryVersion
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
    }

    public class BlaBokResult
    {
        public List<BlaBokEntry>? Data { get; set; }
    }

    public class BlaBokRunningNumber
    {
        public int Number { get; set; }
    }
}
