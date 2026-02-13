# api-collections

Collect free/paid and useful APIs related to public data.

## Data

- API schema: `data/apis/schema.json`
- Seed data: `data/apis/seed.json`

## Backend

Run server:

```bash
npm start
```

GET `/apis` supports query params:

- `country`
- `pricing`
- `category`
- `q` (full-text search in `id/name/country/organization/category/tags`)

Example:

```bash
curl "http://localhost:3000/apis?country=Taiwan&pricing=free&category=weather&q=cwa"
```
