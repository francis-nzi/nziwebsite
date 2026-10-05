# Net Zero International website

React site with a small Node server and a Postgres database (Supabase, in its own `website` schema).
Hosted on Render, with Cloudflare in front for DNS and HTTPS.

## Changing content

Edit the file, commit, push. Render redeploys automatically and the server copies these files into the database on start.

| What | Where |
|---|---|
| Course dates | `content/training-sessions.json` |
| Blog posts | `content/blog-posts.json` |
| Testimonials | `content/testimonials.json` |
| Page text and photos | `client/src/pages/*.tsx` |
| Photos | `client/public/images/` |
| Logo | `client/public/logo.png` |
| Colours and fonts | `client/src/index.css` (top of file) |

Course date example (`ref` must be unique and must not change once people have booked):

```json
{ "ref": "2026-11-18-online", "title": "Net Zero Leaders", "date": "2026-11-18", "time": "09:00",
  "durationHours": 6, "deliveryMode": "online", "capacity": 12, "priceGbp": 495 }
```

`deliveryMode` is `online`, `in_person` or `hybrid`; add `"location": "London"` for in-person dates. To withdraw a date set `"status": "cancelled"`. The number of places booked is kept in the database and is never reset by a deploy.

Testimonial example: `{ "ref": "acme-2026", "clientName": "…", "role": "…", "organisation": "…", "quote": "…" }`. Only publish quotes you have permission to use.

## Enquiries and bookings

Each submission is saved in the database (`contact_enquiries`, `bookings`) and emailed to `NOTIFY_TO` through Resend. If email is not configured the submission is still saved.

## Running locally

```
pnpm install
cp .env.example .env      # point DATABASE_URL at a local Postgres
pnpm dev                  # http://localhost:3000
pnpm test
```

## Photography

All photographs are from Unsplash and used under the Unsplash licence (free for commercial use, no attribution required). Replace them with your own where you can.
