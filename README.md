
# DekkHotell

Add to appsettings.json -->
"Users": [
    {
      "Username": "xxxx",
      "Pin": "xxxx"
    }
  ]
  
 Add users --> Data/Json/users.json:
 "Users": {
    "Listed": [
      {
        "Username": "xxx",
        "Password": "xxx"
      }
	  ...
	  ...
    ]
  }
  
  
  
Felter:
-avtale
-betalt
epost
etternavn
fornavn
id
lokasjon
merke
modell
notat
regNr
tlf

* DONE Lagre siste versjon. Tilfelle feil, ta vare på forrige versjon. Mulig å hente fram for bruker
* DONE Innlogging
* DONE Logge hvem gjorde sist endring, også på siste versjon
* Bytte lokasjon ved redigering
* DONE Oversettelse datatable
* DONE Info blokk: Ledige plasser o.l.
* DONE Datatable overflow --> kollapse med hover visning
* Backup. mndtlig eller ved intervall ved bruk. Inntil videre håndtert med random
* DONE Datatypes i tabell. epost og tlf med direktelink
* Facelift
* json --> database
* Sette feltkrav: RegNr, navn, tlf ???
* darkmode; utkommentert atm
* skjul personalia ved manglende innlogging ???
* modell dekkhotell ???
* portal landingsside. på sikt
* DONE split opp sessionshåndtering. globalt tilgjengelig
* DONE endre personlig passord / pin
* BlåBok - partial

https://icons.getbootstrap.com/icons/door-open/
https://getbootstrap.com/docs/5.2/components/navbar/
https://datatables.net/examples/styling/bootstrap5.html

brukere: alle
