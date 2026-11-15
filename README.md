# GREEN – real-data version

**What is real now:** weather, rainfall and soil wetness come live from the public **NASA POWER API** (no key). Profiles, farms and bookings are stored in **Supabase** (when you add your keys), protected so each farmer sees only their own rows.
**What is NOT real yet (be honest about it):** mandi prices ("est." tag until you add rows to `mandi_prices`), providers (samples until you add rows to `providers`), per-crop costs and yields (estimates, farmers can edit), and SMAP/GPM/MODIS/GRACE (not connected). NASA POWER is a ~50 km grid: regional, not field-level.
I could not reach NASA from my test environment; the NASA code was tested against a mock of the documented response format. **Your first test on a real host is the real test.**

## 1. Try it locally
`python3 -m http.server 8000` in this folder, open http://localhost:8000 . Sign up (button "Fill sample data" is fine), choose a crop, Next. The advice card should show "NASA POWER · data to <date>". If you see "Could not read NASA data", check internet/ad-blocker and press Retry.

## 2. Database (Supabase, free tier)
1. supabase.com > New project. 2. SQL Editor > paste `supabase.sql` > Run. 3. Authentication > Sign In / Providers > enable **Anonymous sign-ins**. 4. Project Settings > API > copy URL and anon key into `config.js`.

## 3. Launch (needs HTTPS for microphone, GPS and install-to-home-screen)
Easiest: **Netlify Drop** (app.netlify.com/drop) – drag this whole folder in, you get a public https link. Alternatives: Cloudflare Pages, Vercel, GitHub Pages. Open the link on a phone > browser menu > "Add to Home screen" (it installs like an app).

## 4. Before real farmers use it
- **Real prices & providers:** add rows in Supabase (Table Editor). Source prices from the Punjab AMIS / mandi committees or collect them yourself; always keep `source` and `price_date`.
- **Login:** anonymous sign-in ties data to one browser. For real accounts switch to phone-number OTP (Supabase Auth + an SMS provider such as Twilio).
- **Privacy:** the app no longer collects CNIC. Still publish a privacy policy, and do not expose provider phone numbers to everyone (keep `verified` providers only).
- **Agronomy:** have a local agriculture officer review the crop table (water need, season, costs, yields) in `index.html` (`const CR`).
- **Pilot:** test with 10–20 farmers in one village; fix what confuses them (Urdu voice recognition varies by phone and accent).
- **More NASA data (next):** SMAP, GPM, MODIS NDVI and GRACE need NASA Earthdata login, so call them from a small server/Supabase Edge Function (keep the token secret). NASA GIBS can show satellite map layers without login.
- **Play Store (optional):** wrap the hosted site with Capacitor or a Trusted Web Activity.

## 5. Natural human voice (recommended before showing anyone)
Phones differ: many have no Urdu voice, so the app then speaks English with the phone's own voice. For a warm, natural Urdu guide:
1. Azure portal > create a **Speech** resource (free tier exists; check current limits). Copy the key and region.
2. Install the Supabase CLI, then in this folder: `supabase link`, `supabase secrets set AZURE_SPEECH_KEY=... AZURE_REGION=...`, `supabase functions deploy tts`.
3. Done. With `config.js` filled in, every screen's guide now plays Azure's `ur-PK-UzmaNeural` (Urdu) or `en-IN-NeerjaNeural` (Indian English). If the function fails, the app falls back to the phone's voice. The key never reaches the browser.
Guide lines are in `const GL` in `index.html`; edit them to change what the guide says. The grow-guide steps (when to sow, water, harvest) are still English only.

## 6. What each API needs
| Service | Status | You must |
|---|---|---|
| NASA POWER | live, no key | nothing |
| Supabase (database, login) | needs keys | steps 2 above |
| Azure Speech (voice) | optional, needs key | section 5 |
| Mandi prices | no public API found | enter rows in `mandi_prices` or partner with AMIS/mandi committees |
| SMS login (OTP) | not built | Supabase Auth phone provider + Twilio |
| Digital payment (JazzCash/Easypaisa) | not built | merchant account + their API (server side) |
| NASA SMAP/MODIS/GPM/GRACE | not built | Earthdata token on a server function |
