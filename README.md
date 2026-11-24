# SkiPlan AI

Mobilna aplikacija za vajo 5 pri predmetu Računalniški produkti in storitve (4.TR). Vneseš kraj odhoda in smučarski cilj, nato na zaslonu z rezultati odpreš načrt poti, vreme ali predloge nastanitev.

**Člana skupine** — [ime in priimek prvega člana], [ime in priimek drugega člana]

## Zagon v aplikaciji Expo Go

1. Namesti Node.js LTS, Git in Visual Studio Code. Na telefonu namesti Expo Go z združljivostjo za SDK 58. [Expo Go](https://expo.dev/expo-go)
2. V terminalu odpri mapo projekta in zaženi:

   ```sh
   npm ci
   npm start
   ```

3. Telefon in računalnik poveži v isto lokalno omrežje. Odpri povezavo s kodo QR v Expo Go. Če Expo Go zahteva prijavo, uporabi isti Expo račun v aplikaciji in v ukazni vrstici (`npx expo login`).
4. Za preizkus vnesi **Ljubljana** in **Kranjska Gora**, pritisni **Načrtuj izlet** ter odpri vse tri zavihke. Za zagon v brskalniku uporabi `npm run web`.

Projekt privzeto deluje v predstavitvenem načinu. Vreme je izmišljeno, načrt in namigi za nastanitve pa so splošni.

## Zagon s strežnikom

Obstoječi strežnik FastAPI uporablja Groq za načrt poti in predloge hotelov ter OpenWeather za vremensko napoved.

1. Kopiraj `.env.example` v `.env` in vpiši svoja ključa `GROQ_API_KEY` in `WEATHER_API_KEY`. V isto datoteko vpiši naslov strežnika, na primer `EXPO_PUBLIC_API_URL=http://192.168.1.25:8000`. Vrednost prilagodi lokalnemu naslovu računalnika. Za preizkus v brskalniku na istem računalniku lahko uporabiš `http://127.0.0.1:8000`.
2. V ločenem terminalu PowerShell v mapi projekta zaženi:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   .\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
   ```

3. Znova zaženi Expo. Za vrnitev v predstavitveni način počisti `EXPO_PUBLIC_API_URL` in ponovno zaženi Expo.
4. Če se telefon ne poveže, preveri naslov računalnika in ali požarni zid dovoljuje povezavo do vrat 8000 v lokalnem omrežju.

Predlogi nastanitev so besedilo, ki ga ustvari AI. Cene in razpoložljivost preveri pri ponudniku.

## Zgradba projekta

- `src/app/` vsebuje obrazec, rezultate in navigacijo Expo Router.
- `src/components/` vsebuje ponovno uporabni komponenti za vnos in gumbe, ki sprejemata props.
- `src/theme.ts` vsebuje skupne barve in sloge.
- `src/utils/` vsebuje validacijo, predstavitvene podatke in klice API.
- `backend/` vsebuje strežnik FastAPI. Izvorna HTML stran je v `frontend/` in je prek strežnika dostopna na `/app`.

## Preizkusi

`npm test` preveri validacijo in obdelavo odzivov API. `npm run typecheck` preveri tipe TypeScript.

## GitHub in oddaja

Pred oddajo vpišita imeni v README in projekt naložita v skupni GitHub repozitorij. Oba člana naj prispevata svoje commite. Učitelju omogočita dostop in v spletno učilnico oddajta povezavo do repozitorija. Datoteka `.gitignore` izloča `node_modules` in lokalne API ključe.
