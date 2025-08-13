Interactive Google Map Displaying Polylines from All Strava Activities + AI Insights
Runs with Open AI ChatGPT or Ollama Locally

## Running Project Locally

### Add Required API Keys Required to .env.local:

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

3. Open AI (when using main branch)
```
OPENAI_API_KEY=
```

### (Optional) Run a Model Locally Through Ollama (ollama-phi3mini branch only)

1. Download and install: https://ollama.com/download

2. Choose a model to run (recommended phi3:mini - small model size - 2.2GB and fast, but questionable output...)
```
ollama pull phi3:mini
ollama run phi3:mini
```

### Run the Developement Server:

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
