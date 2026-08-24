# Proxmox Booking HT26

Starter-repo för DV1677 JavaScript-baserade webbramverk HT26.

Ett alternativt projekt – ett server-renderat bokningssystem för resurser
(t.ex. virtuella maskiner i Proxmox), byggt med Express och SQLite. Under
kursens gång byggs det om/refaktoreras.

## Kom igång

```bash
npm install
```

Skapa en `.env`-fil utifrån exemplet:

```bash
cp .env.example .env
```

Starta applikationen:

```bash
npm start
```

Öppna sedan `http://localhost:3000`

## Env-variabler

`PORT` - porten som Express lyssnar på -> `3000`

## Teknikstack

- [Node](https://nodejs.org)
- [Express](https://expressjs.com)
- [SQLite](https://www.sqlite.org) (byts ut mot MongoDB)
- [EJS](https://ejs.co) (byts ut mot frontend-ramverk)
