# Atribuire afiliați (v1)

Linkuri scurte care înregistrează clickul, apoi răspund cu **302** către partener. Măsoară clickurile. Nu trimite mesaje și nu schimbă celelalte pagini.

Folosește domeniul fără prefix de limbă: `https://mihaidaniel.ro/r/{slug}` (și `www`, dacă ajunge în același proiect). `/en/r/...` nu este ruta asta.

## Destinații

| Slug | Link de pus în bio / video | Destinație |
|---|---|---|
| `bybit` | `https://mihaidaniel.ro/r/bybit` | `https://partner.bybit.eu/eusot138528` |
| `okx` | `https://mihaidaniel.ro/r/okx` | `https://my.okx.com/join/77249876` |
| `redotpay` | `https://mihaidaniel.ro/r/redotpay` | `https://url.hk/i/en/kqz74` |
| `tangem` | `https://mihaidaniel.ro/r/tangem` | vezi Tangem, mai jos |

Doar aceste URL-uri sunt în hartă. Un slug necunoscut primește 404. Nu se inventează alte destinații.

### Tangem

Până la `2026-11-30T23:59:59Z` inclusiv (și tot restul acelei secunde, până la miezul nopții), `/r/tangem` răspunde cu 302 către exact:

```text
https://tangem.com/invite/DanielMihai&promocode=BF2026
```

De la `2026-12-01T00:00:00Z`, destinația este `https://tangem.com/invite/DanielMihai`. Trecerea se face la cerere, după ceasul requestului, fără redeploy.

`&` din URL-ul de promoție rămâne literă. Nu se înlocuiește cu `?` și nu se encodează ca `%26`. Varianta cu `?` pierde `BF2026`.

Pe Tangem nu se adaugă `utm_*` la `Location`. Un `?utm_source` sau `&utm_source` pe URL-ul Tangem strică promocode-ul. Clickul se numără totuși pe slug și pe sursă. Intră ambele forme: `?s=qe`, `?s=sc`, `?s=yt` și `?utm_source=x` (regula folosită pe X). Dacă sunt amândouă, `utm_source` câștigă, la fel ca la celelalte slug-uri. Valoarea rămâne doar în contor, nu pe `Location`.

Răspunsul are `Cache-Control: private, no-store, max-age=0, must-revalidate`, plus `CDN-Cache-Control: no-store` și `Vercel-CDN-Cache-Control: no-store`. Handlerul este `force-dynamic` cu `revalidate = 0`, ca un 302 din promoție să nu rămână în cache după cutoff.

## UTM

Un link gol primește, la log și pe URL-ul de ieșire:

- `utm_source=mihaidaniel`
- `utm_medium=referral`
- `utm_campaign=affiliate`

Valorile primite pe link le păstrăm. Completăm doar câmpurile lipsă dintre cele trei. `utm_content` și `utm_term` rămân goale dacă nu le pui.

`s` ține loc de `utm_source` când `utm_source` lipsește. Valorile acceptate pentru canalele scurte sunt `x`, `yt` și `tt`:

```text
https://mihaidaniel.ro/r/bybit?s=x
https://mihaidaniel.ro/r/bybit?s=yt
https://mihaidaniel.ro/r/bybit?s=tt
```

`utm_source` câștigă dacă ambele sunt pe link. `s` trece prin aceeași curățare ca `utm_source`: caracterele de control se scot, spațiile de la capete se taie, lungimea maximă este 120. Gol sau invalid după curățare, sursa rămâne `mihaidaniel`.

`s` nu se copiază pe URL-ul partenerului. Valoarea pleacă mai departe ca `utm_source`, la fel ca un `utm_source` pus explicit. `utm_medium` și `utm_campaign` rămân cele implicite dacă nu le trimiți.

### Canale (`utm_source`)

| Canal | `utm_source` | Unde stă linkul |
|---|---|---|
| YouTube | `yt` | descriere, comentariu fixat, card |
| TikTok | `tt` | bio, comentariu |
| X | `x` | bio, post |
| Email | `email` | newsletter |
| Bio (link in bio, site) | `bio` | |
| Link scurt generic | `short` | |

`utm_medium` rămâne `referral` pentru aceste linkuri.

`utm_campaign` este `affiliate` pentru linkul standard, sau un nume scurt al valului, de exemplu `bybit-2026-11`, `okx-live`, `redotpay-card`.

`utm_content` este plasarea: `descriere`, `pin`, `bio`, `story`.

### Exemple

```text
https://mihaidaniel.ro/r/bybit?utm_source=yt&utm_medium=referral&utm_campaign=affiliate&utm_content=descriere
https://mihaidaniel.ro/r/okx?utm_source=x&utm_medium=referral&utm_campaign=okx-2026-11&utm_content=bio
https://mihaidaniel.ro/r/redotpay?utm_source=tt&utm_content=bio
https://mihaidaniel.ro/r/redotpay?utm_source=yt&utm_medium=referral&utm_campaign=redotpay-card&utm_content=descriere
```

`ref` și `sid`, dacă vin pe linkul nostru, se salvează în click. Nu se adaugă pe URL-ul Bybit, OKX, RedotPay sau Tangem, ca să nu se calce pe codul lor.

Pe hop-ul următor, observat la verificarea linkurilor:

- Bybit ignoră query-ul extra și își păstrează redirectul de afiliat. Clickul rămâne în statistica noastră.
- OKX păstrează `utm_*` pe pagina de join.
- RedotPay (`url.hk`) păstrează `utm_*` și își pune singur `referralId`. Noi nu setăm și nu înlocuim `referralId`.

Un preview de Slack, X sau Facebook face GET și se numără ca click. Un prefetch de browser (`Purpose: prefetch`) redirecționează, dar nu se înregistrează.

## Ce se salvează

Pentru fiecare hit: momentul în `Europe/Bucharest` (ISO cu offset), slug, URL-ul de destinație, URL-ul de ieșire, referrer, user-agent (max 300 caractere), toți `utm_*`, plus `ref` și `sid`. IP-ul nu se salvează.

Stocarea este Redis-ul deja legat de proiect (Vercel KV / Upstash), prefix `aff:v1:`, separat de comenzile de la Verifică adresa. Se păstrează ultimele 20.000 de evenimente și contoare zilnice `slug + utm_source`.

Fără Redis, redirectul tot merge. Evenimentul ajunge în logurile Vercel ca linie `[affiliate-click]`.

## Citire

`GET /api/r/stats`, protejat de `AFF_STATS_KEY`.

```bash
curl -sS -H "x-aff-stats-key: $AFF_STATS_KEY" \
  "https://mihaidaniel.ro/api/r/stats?days=30"

curl -sS -H "Authorization: Bearer $AFF_STATS_KEY" \
  "https://mihaidaniel.ro/api/r/stats?format=csv&days=30" -o clicks.csv

curl -sS -H "x-aff-stats-key: $AFF_STATS_KEY" \
  "https://mihaidaniel.ro/api/r/stats?slug=redotpay&events=1"
```

- `days` — fereastra, implicit 30, maxim 366. Ziua este în Europe/Bucharest.
- `slug` — `bybit`, `okx`, `redotpay` sau `tangem`.
- `format=csv` — `date,slug,utm_source,clicks`. Cu `events=1`, CSV-ul este lista de clickuri.
- `events=1` — în JSON adaugă ultimele clickuri (max 100).
- `partners` în JSON este totalul ferestrei pentru fiecare slug live, inclusiv 0.
- `?key=` merge, dar cheia ajunge în loguri de acces. Preferă headerul.

Fără `AFF_STATS_KEY`, ruta răspunde 404. Cu cheie greșită, 401. Fără Redis, 503.

## Variabile pe Vercel

Proiect: **mihaidaniel-ro** (`prj_Z37YuhAXcDJ8IhfrpulsFviEztlj`). Nu le pune pe copia `mihaidaniel-ro-nca3`.

1. Vercel → proiectul **mihaidaniel-ro** → Settings → Environment Variables.
2. Adaugă `AFF_STATS_KEY` pe Production și Preview. Valoare lungă, de exemplu `openssl rand -base64 32`. Nu o pune în git.
3. Salvează și fă Redeploy la ultimul deployment de producție. Fără redeploy, funcția veche nu vede cheia.

Clickurile folosesc store-ul deja conectat pe Production și Preview:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Aceeași pereche Upstash merge la fel: `UPSTASH_REDIS_REST_URL` și `UPSTASH_REDIS_REST_TOKEN`. Nu e nevoie de un store nou. Tokenul read-only nu scrie clickuri; ruta folosește tokenul de scriere.
