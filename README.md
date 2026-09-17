# Proxmox Booking HT26

Starter-repo för DV1677 JavaScript-baserade webbramverk HT26.

Ett alternativt projekt – ett server-renderat bokningssystem för resurser
(t.ex. virtuella maskiner i Proxmox), byggt med Express och SQLite. Under
kursens gång byggs det om/refaktoreras.

---

# dv1677-ht26-grupp3-backend

## Gruppmedlemmar

| Namn | GitHub |
|------|--------|
| Stella Karlsson | @git-Stella |
| Andi Dupa | @AndiDupa |

## Projektval

Vi har valt **bokningssystem**.

Motivering: Vi valde projektet "bokningssystem" gemensamt då den verkade mer intressant att jobba med.

## Teknikval

**Frontend-ramverk:** React

Motivering: Vi valde frontend-ramverket "React", då vi båda har haft mer erfarenhet med det ramverket, i jämförelse med andra.

## Krav

> **OBS: Kräver Node.js 22.23 eller högre.**
> `better-sqlite3` använder nativa binärer kompilerade för en specifik Node-version — äldre 22.x (t.ex. 22.11) ger `Segmentation fault` vid start.
>
> Uppgradera med nvm:
> ```bash
> nvm install 22.23
> nvm use 22.23
> ```

## Kör lokalt

git clone <repo-url>
cd dv1677-ht26-grupp3-backend
cp .env.example .env
npm install
npm start

**Miljövariabler** (se .env.example):

| Variabel | Beskrivning |
|----------|-------------|
| MONGODB_URI | Anslutningssträng till MongoDB |
| PORT | Port (default 1337) |

## Tester

npm test

## Teknikstack

- [Node](https://nodejs.org)
- [Express](https://expressjs.com)
- [SQLite](https://www.sqlite.org) (byts ut mot MongoDB)
- [EJS](https://ejs.co) (byts ut mot frontend-ramverk)

## Tillvägagångssätt

Dokumentera löpande vad ni gjort och hur ni löst problem.

- **Vecka 1:** Inlämningen för vecka utfördes genom att gruppmedlemmarna samlades under programmeringsstugan och diskuterade project- samt teknikval (frontend-ramverk), skapade ett gemensamt repo och bjöd med läraren, samt gick igenom stegen för säkerhetsgranskning, verifierade att uppdatering av befintligt innehåll fungerade korrekt, och slutligen skapade ett öppet pull request.

- **Vecka 2:** ...
- **Vecka 3:** ...