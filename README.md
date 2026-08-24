# Signature Editor

Email signature editor app (Express + local mock database).

## Local development

### Prerequisites

- Node.js

### Setup

1. Copy env file:

```bash
cp .env.sample .env
```

2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm start
```

4. Open in browser:

```
http://localhost:4783/?companyId=pMr0lShPukk=
```

### Data storage

Local data is persisted to `mock/data/mock-db.json` (configurable via `MOCK_DB_PATH` in `.env`). On first run, seed data is created automatically.

To reset to defaults, delete `mock/data/mock-db.json` and restart the app.

### Useful commands

```bash
npm run dev   # start app with nodemon
```
