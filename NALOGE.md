# Načrt in seznam nalog – v0.1

## MVP

**Problem:** Načrtovanje dopusta vzame veliko časa. Podatke o aktivnostih,
nastanitvah in vremenu je treba iskati v več različnih aplikacijah.

**Ciljni uporabnik:** Mladi, ki sami ali s prijatelji načrtujejo krajši dopust
ali izlet.

**Ključne funkcionalnosti v0.1:**
1. **Nov dopust:** uporabnik izbere destinacijo, datume in aktivnosti, ki jih ima rad
   (npr. pohodništvo, plaža, kultura, hrana, smučanje). Vnos se preveri.
2. **Samodejni načrt:** aplikacija iz testnih podatkov sestavi načrt po dnevih
   glede na izbrane aktivnosti in predlaga nastanitve na destinaciji.
3. **Moji dopusti:** načrt se shrani v telefon, uporabnik ga vidi na seznamu,
   odpre podrobnosti in ga lahko izbriše.
4. **Vreme:** napoved za destinacijo s prostega API-ja Open-Meteo (ne potrebuje ključa).

**Ni del v0.1 (načrt za naslednje različice):**
- Načrt, ki ga sestavi umetna inteligenca (prek lastnega strežnika)
- Prave nastanitve in rezervacije prek API-ja ponudnika
- Deljenje dopusta s prijatelji
- Uporabniški računi

---

Stanje: ⬜ ni začeto · 🔄 v delu · ✅ končano

## Skupaj

| # | Naloga | Kdo | Stanje |
|---|--------|-----|--------|
| 1 | Dogovor o MVP, zaslonih in razdelitvi dela | Mark, Lan | 🔄 |
| 2 | Testiranje z uporabniki (3–5 sošolcev) in zapis ugotovitev | Mark, Lan | ⬜ |
| 3 | Izboljšave na podlagi testiranja | Mark, Lan | ⬜ |
| 4 | Predstavitev z demonstracijo | Mark, Lan | ⬜ |

## Mark

| # | Naloga | Stanje |
|---|--------|--------|
| 5 | Namestitev AsyncStorage in `src/utils/shramba.ts` (shrani, preberi, izbriši dopust) | ⬜ |
| 6 | Zavihki `src/app/(tabs)/_layout.tsx`: Nov dopust, Moji dopusti | ⬜ |
| 7 | Zaslon **Moji dopusti**: seznam, sporočilo ob praznem seznamu, brisanje | ⬜ |
| 8 | Zaslon podrobnosti `src/app/dopust/[id].tsx`: načrt po dnevih, vrnitev nazaj | ⬜ |
| 9 | Vreme z Open-Meteo v `src/utils/vreme.ts` in prikaz v podrobnostih | ⬜ |
| 10 | Ime in ikona aplikacije (`app.json`, `assets/`), preveriti licenco ikone | ⬜ |

## Lan

| # | Naloga | Stanje |
|---|--------|--------|
| 11 | Testni podatki `src/data/destinacije.ts`: destinacije, koordinate, aktivnosti, nastanitve | ⬜ |
| 12 | Komponenta za izbiro aktivnosti `src/components/izbira-aktivnosti.tsx` | ⬜ |
| 13 | Obrazec **Nov dopust**: destinacija, datumi, aktivnosti, preverjanje vnosa, sporočilo ob shranjevanju | ⬜ |
| 14 | Sestavljanje načrta po dnevih v `src/utils/nacrt.ts` | ⬜ |
| 15 | Prikaz predlaganih nastanitev iz testnih podatkov | ⬜ |
| 16 | Preverjanje na različnih velikostih zaslona, velikost besedila in kontrast | ⬜ |

## Na koncu

| # | Naloga | Kdo | Stanje |
|---|--------|-----|--------|
| 17 | README: opis, funkcionalnosti, zaslonski posnetki, zagon, znane pomanjkljivosti, načrt za v0.2 | Mark | ⬜ |
| 18 | Oznaka različice `v0.1` (git tag) | Lan | ⬜ |
