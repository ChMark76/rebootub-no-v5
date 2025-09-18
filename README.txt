RebootUB nettside (NO). Innhold: index, about, team, store, prices, contact.

Kontakt-skjema (Vercel):
- Legg prosjektet på Vercel.
- I Project Settings → Environment Variables sett:
  SMTP_USER = din Gmail (eller annen SMTP-bruker)
  SMTP_PASS = App-passordet (for Gmail: Security → App passwords)
  TO_EMAIL  = rebootubdrm@gmail.com (valgfritt, ellers brukes denne automatisk)
- Deploy. Skjemaet sender da e-post via /api/contact.
