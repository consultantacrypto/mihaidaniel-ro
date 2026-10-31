# mihaidaniel.ro

Site-ul lui Mihai Daniel. Pagina care vinde este consultanța 1 la 1: 60 de minute, online, 200 EUR, pe `/consultanta-crypto`, plătită prin Stripe.

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
| `STRIPE_PRICE_ID_CONSULTANCY` | nu | `price_...` | Prețul din catalog. Dacă lipsește, rămâne 200 EUR în cod. |
| `STRIPE_PRICE_ID_COURSE` | nu | `price_...` | Prețul din catalog. Dacă lipsește, rămâne 250 EUR în cod. |
| `RESEND_API_KEY` | da, pentru email | `re_...` | Email după plată, ghid, parteneriate și formularul de contact. |
| `BOOKING_URL` | nu | `https://cal.com/mihai/consultanta` | Calendar după plată. Dacă lipsește sau nu e https, butonul și embed-ul nu apar. |
| `WHATSAPP_NUMBER` | nu | `40731490099` | Număr pentru linkul `wa.me`, doar cifre. Dacă lipsește, se folosește `40731490099`. |
| `CONTACT_EMAIL` | nu | `consultantacrypto.ro@gmail.com` | Inbox pentru formular, reply-to la emailuri. Dacă lipsește, se folosește adresa de mai sus. |
| `AFF_STATS_KEY` | nu, pentru citire | secret lung | Protejează `GET /api/r/stats`. Fără ea, ruta răspunde 404. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | nu, pentru log durabil | URL + token | Clickurile `/r/{slug}`. Pe proiectul Vercel sunt deja setate. Merge și perechea `UPSTASH_REDIS_REST_*`. |

Adresa afișată în footer și în cardul de pe `/contact` rămâne `consultantacrypto.ro@gmail.com` (textul paginii). `CONTACT_EMAIL` schimbă unde ajung mesajele, nu textul acela.

Un `BOOKING_URL` sau un număr greșit nu produce un link stricat: opțiunea respectivă e ascunsă. WhatsApp-ul și emailul au valorile de mai sus ca rezervă doar când variabila lipsește, nu când e setată greșit.

## După plată

Stripe rămâne pe același checkout: aceleași produse, prețuri, `mode: payment`, coduri promo, același `cancel_url`. La success se păstrează `success=true` și `type`, și se adaugă `session_id={CHECKOUT_SESSION_ID}` ca să putem verifica plata.

Cumpărătorul rămâne pe pagină. Fără `BOOKING_URL`, butonul mare este WhatsApp, cu un mesaj în română gata scris. Emailul de confirmare (webhook-ul existent) spune același lucru și adaugă calendarul doar dacă `BOOKING_URL` e setat.

## Măsurare

UTM-urile `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` se salvează în `localStorage` și în cookie-ul `md_utm` (90 de zile, last touch). La checkout intră în `metadata` pe sesiunea Stripe și în `client_reference_id` (`source:x|medium:bio|campaign:consult|content:pin-v1`). Webhook-ul le are pe `session.metadata` și le scrie în log.

Evenimentul GA4 `purchase` pleacă doar după `GET /api/checkout/verify`, când Stripe spune că sesiunea e `paid`. `value` este suma încasată (200 pentru consultanță la preț întreg, mai puțin dacă există cupon), `currency` EUR, `transaction_id` este id-ul sesiunii. Se trimite o singură dată per sesiune în browser (`localStorage`). O vizită la `?success=true` fără sesiune plătită nu trimite evenimentul.

GA4 (`G-ZYYJ251HYH`) se încarcă și acum fără banner de consimțământ și fără Consent Mode. Asta rămâne de verificat juridic; bannerul nu e în acest schimb.

Limba implicită este româna. `Accept-Language: en` nu mai redirecționează spre `/en`. Comutatorul RO/EN rămâne și păstrează query string-ul, inclusiv UTM.

## Linkuri de afiliat

`/r/bybit`, `/r/okx` și `/r/redotpay` înregistrează clickul și răspund cu 302 către partener. Taxonomia UTM, exemplele și pașii din Vercel (proiectul `mihaidaniel-ro`) sunt în [docs/affiliate-attribution.md](docs/affiliate-attribution.md).
