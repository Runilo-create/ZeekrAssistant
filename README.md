# Zeekr Sales Assistant — Vercel

Een responsive webapp zonder betaalde AI-API. Laptop: tabeloverzicht. Telefoon: dossierkaarten, vaste onderste navigatie, grotere invoer en dicteren via toetsenbord of browserherkenning.

## Direct lokaal testen

Node 22+ en Python 3 zijn voldoende; er zijn geen npm-dependencies.

```sh
npm run build
npm test
npm run dev
```

Open lokaal poort 8000 in je browser. Dit is de statische demoversie, met twee fictieve klanten. Data blijft in localStorage van deze browser en wordt niet gedeeld tussen toestellen. Browsergegevens wissen verwijdert deze data. Exporteer regelmatig.

## Op Vercel testen

1. Zet de projectbestanden in je GitHub-repository, of upload de projectmap met de Vercel CLI vanuit je eigen account.
2. Importeer de repository als nieuw project op Vercel. Framework: **Other**. Root directory: de map met `package.json`. Build: `npm run build`. Output: `dist` (ingesteld in `vercel.json`).
3. Deploy. Vercel geeft je daarna de werkelijke HTTPS-link. Open dezelfde link op laptop en iPhone. Zonder extra configuratie is dit demomodus, zonder synchronisatie.

Er is geen betaalde AI nodig. Vercel bepaalt zelf welke gratis gebruiksvoorwaarden en limieten voor jouw account en zakelijk gebruik gelden. Er is in deze taak geen deployment uitgevoerd en nog geen publieke testlink aangemaakt.

## Privé cloudopslag en synchronisatie

Gebruik een eigen Supabase-project. Een gratis plan kan voor een eerste test volstaan, binnen hun actuele voorwaarden en limieten.

1. Maak een project aan en voer `supabase/schema.sql` uit in de SQL Editor. De tabel gebruikt Row Level Security: alleen de ingelogde eigenaar kan zijn overzicht lezen of wijzigen. De SQL is herhaalbaar.
2. Maak je persoonlijke gebruiker aan in Authentication → Users. Gebruik e-mail/wachtwoord; stel het wachtwoord via je eigen beveiligde beheeromgeving in. Schakel publieke gebruikersregistratie uit als je de app alleen gebruikt.
3. Voeg in Vercel twee environment variables toe: `SUPABASE_URL` (de HTTPS project-URL) en `SUPABASE_ANON_KEY` (alleen de publieke anon- of publishable key). Gebruik **nooit** de service-role of secret key. De publieke key komt bewust in de browser; RLS beschermt de gegevens.
4. Deploy opnieuw. Log in op laptop en iPhone met dezelfde gebruiker. Gebruik Verversen voor de nieuwste stand; bij gelijktijdige wijzigingen voorkomt een versiecontrole dat een oud overzicht het nieuwe overschrijft.
5. Kies **Dossiers importeren** om een lokaal JSON-bestand met dossiers toe te voegen. Het bestand met de 19 echte dossiers uit de screenshot blijft uitsluitend in de oorspronkelijke ontwikkelomgeving; het staat niet op GitHub en niet in de openbare build. Import voegt toe en dedupliceert niet. Controleer de overgenomen contactgegevens.

Clouddata is pas bewezen gesynchroniseerd als je dit met je eigen project op beide toestellen test. De integratie is lokaal met gemockte antwoorden getest; er waren geen Supabase-credentials beschikbaar voor een echte cloudtest.

## Gratis tekstherkenning en spraak

Voorbeeld: `Demo klant Alex wacht op offerte, bellen dinsdag`. Gebruik één volledige bestaande klantnaam per bericht. De app voegt je notitie toe, bewaart de oude notitie in de historiek, werkt de contactdatum bij en herkent bel-/opvolgtaken. Ondersteunde deadlines: vandaag, morgen, een weekdag of YYYY-MM-DD. Zonder herkenbare datum blijft de deadline leeg. Controleer de voorgestelde datum vóór opslaan. `Taak: koffie bestellen` maakt een losse taak. Een vraag met vraagteken toont de notities en verandert niets. Afsluiten met verkoopbedrag gaat via het dossierformulier.

Dit is eenvoudige regelherkenning, geen taalmodel: het begrijpt geen willekeurige formuleringen, meerdere dossiers, ontkenningen of complexe opdrachten betrouwbaar. Wijzigingen vragen daarom een korte bevestiging. Updates met een ander historisch contactmoment voer je handmatig in. Er zijn geen API-kosten of externe AI-verzoeken.

Op iPhone kun je het microfoontje van je toetsenbord gebruiken in het tekstveld. De extra microfoonknop werkt alleen als de browser spraakherkenning ondersteunt. De browser-/toetsenbordleverancier kan audio extern verwerken. Invoer kan vóór verzending aangepast worden.

## Export en beperkingen

CSV-export opent in Excel en bevat lopende en verkochte dossiers met verkoopbedragen. JSON-back-up bevat ook taken en historiek; de huidige import importeert uitsluitend dossiers. Geen automatische back-ups. Geen pushmeldingen op vergrendelde iPhone: service worker, pushabonnementen en scheduler zijn nog niet gebouwd. De takenlijst toont wel deadlines in de app. Er is geen offline cloudbewerking.

## Controle

```sh
npm run build
npm test
node --check public/app.js
```

De Node-tests controleren herkenning, ambigue klanten, notitiehistoriek, lokale persistentie, verkoopbedragen, taken, conflictcontrole en uitsluiting van klantgegevens uit de openbare build. Chromium-browsercontrole geslaagd op 1440px en 390px: dossierupdate, taak, herladen, afsluiten met bedrag, kaartenweergave, vaste navigatie, dossierformulier en geen horizontale overflow. Nog te testen op echte toestellen: Safari-dicteren en echte Supabase-login/synchronisatie.
