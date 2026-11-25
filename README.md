# mihaidaniel.ro

Site-ul lui Mihai Daniel. Pagina care vinde consultanța este `/consultanta-crypto`, plătită prin Stripe: sesiune 1:1 de 60 de minute, 200 EUR (cu 2 analize tehnice), pachet de 3 sesiuni, 540 EUR, și mentorat de 6 săptămâni, 1.500 EUR. `/consultanta` redirecționează permanent aici.

## Rulare locală

```bash
npm install
cp .env.example .env.local
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run lint
npm run build
```

## Variabile de mediu

Setează-le în Vercel pe proiectul de producție și fă redeploy. Nu redenumi variabilele Stripe deja folosite.

| Variabilă | Obligatoriu | Exemplu | Ce face |
|---|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | da | `https://www.mihaidaniel.ro` | URL-ul de success/cancel la Stripe. Fără slash la final. |
| `STRIPE_SECRET_KEY` | da | `sk_live_...` | Cheia secretă Stripe. Deja setată în producție. |
| `STRIPE_WEBHOOK_SECRET` | da | `whsec_...` | Semnătura webhook-ului `checkout.session.completed`. |
| `STRIPE_PRICE_ID_CONSULTANCY` | nu | `price_...` | Prețul din catalog, doar pentru sesiunea de 200 EUR. Dacă lipsește, rămâne 200 EUR în cod. Pachetul de 540 EUR și mentoratul de 1.500 EUR folosesc `price_data` din cod, nu un Price ID. |
| `STRIPE_PRICE_ID_COURSE` | nu | `price_...` | Prețul din catalog. Dacă lipsește, rămâne 250 EUR în cod. |
| `RESEND_API_KEY` | da, pentru email | `re_...` | Email după plată, ghid, parteneriate și formularul de contact. |
| `WHATSAPP_NUMBER` | nu | `40731490099` | Butonul WhatsApp de pe `/consultanta-crypto`, `https://wa.me/` cu textul „Salut Dani, vreau o consultanță crypto”. Doar dacă e setat și valid. `+`, spațiile și liniuțele se scot. |
| `CONTACT_EMAIL` | nu | `contact@stirilecrypto.ro` | Butonul de email de pe `/consultanta-crypto` (`mailto:`). Doar dacă e setat și valid. Inbox pentru formular și reply-to. |
| `AFF_STATS_KEY` | nu, pentru citire | secret lung | Protejează `GET /api/r/stats`. Fără ea, ruta răspunde 404. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | nu, pentru log durabil | URL + token | Clickurile `/r/{slug}`. Pe proiectul Vercel sunt deja setate. Merge și perechea `UPSTASH_REDIS_REST_*`. |

Adresa afișată în footer, pe `/contact` și în datele structurate este `contact@stirilecrypto.ro`. Dacă `CONTACT_EMAIL` este setată, ea schimbă inbox-ul formularului, reply-to și adresa din mesajul de după plată. Dacă lipsește, mesajul de după plată folosește aceeași adresă. Butoanele de pe pagina de consultanță nu folosesc rezerva: fără variabilă validă, butonul nu apare.

Un număr sau un email greșit nu produce un link stricat: butonul respectiv rămâne ascuns.

## După plată

Checkout-ul rămâne `mode: payment`, cu coduri promo și același `cancel_url`. Sesiunea de 200 EUR folosește în continuare `STRIPE_PRICE_ID_CONSULTANCY` când există, altfel `price_data` de 20000 cenți. Pachetul și mentoratul pornesc o sesiune Stripe cu `price_data` (cenți, EUR, numele produsului) luată din configurația de pe server, după id-ul pachetului. Un id necunoscut răspunde 400. Clientul nu trimite suma. La success se păstrează `success=true` și `type`, și se adaugă `session_id={CHECKOUT_SESSION_ID}`.

Cumpărătorul rămâne pe pagină. După plată, butonul mare este WhatsApp, cu un mesaj în română gata scris, iar emailul de confirmare spune același lucru. Nu există link de calendar.

## Măsurare

UTM-urile `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` se salvează în `localStorage` și în cookie-ul `md_utm` (90 de zile, last touch). La checkout intră în `metadata` pe sesiunea Stripe și în `client_reference_id` (`source:x|medium:bio|campaign:consult|content:pin-v1`). Webhook-ul le are pe `session.metadata` și le scrie în log.

Evenimentul GA4 `purchase` pleacă doar după `GET /api/checkout/verify`, când Stripe spune că sesiunea e `paid`. `value` este suma încasată (200 pentru consultanță la preț întreg, mai puțin dacă există cupon), `currency` EUR, `transaction_id` este id-ul sesiunii. Se trimite o singură dată per sesiune în browser (`localStorage`). O vizită la `?success=true` fără sesiune plătită nu trimite evenimentul.

GA4 (`G-ZYYJ251HYH`) se încarcă și acum fără banner de consimțământ și fără Consent Mode. Asta rămâne de verificat juridic; bannerul nu e în acest schimb.

Limba implicită este româna. `Accept-Language: en` nu mai redirecționează spre `/en`. Comutatorul RO/EN rămâne și păstrează query string-ul, inclusiv UTM.

## Linkuri de afiliat

`/r/bybit`, `/r/okx` și `/r/redotpay` înregistrează clickul și răspund cu 302 către partener. Canalul scurt `?s=x`, `?s=yt` sau `?s=tt` ține loc de `utm_source` când acesta lipsește. Taxonomia UTM, exemplele și pașii din Vercel (proiectul `mihaidaniel-ro`) sunt în [docs/affiliate-attribution.md](docs/affiliate-attribution.md).
