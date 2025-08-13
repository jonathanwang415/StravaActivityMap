Interactive Google Map Displaying Polylines from All Strava Activities + AI Insights
Runs with Open AI ChatGPT or Ollama Locally

## Running Project Locally

### API Keys Required (add all to .env.local):

1. Strava
```
NEXT_PUBLIC_STRAVA_CLIENT_ID=
NEXT_PUBLIC_STRAVA_CLIENT_SECRET=
NEXT_PUBLIC_STRAVA_REDIRECT_URI=http://localhost:3000/
```

2. Google Maps
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

3. Open AI (optional)
```
OPENAI_API_KEY=
```

### Running a Model Locally Through Ollama (Optional)

1. Download and install: https://ollama.com/download

2. Choose a model to run (recommended phi3:mini - 2.2GB and fast)
```
ollama pull phi3:mini
ollama run phi3:mini
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
