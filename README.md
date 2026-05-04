# Kannada Comfort Sprint

Audio-first, no-install Kannada practice for building functional spoken comfort in Bangalore over 10 days. The app does not claim true fluency. It aims for practical coverage: everyday Bangalore conversations, repair moves, shadowing rhythm, and a separate business pack for local operations, logistics, manufacturing, vendors, accountants, supervisors, drivers, and SME owners.

## Run Locally

```powershell
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Useful checks:

```powershell
pnpm lint
pnpm test
pnpm content:check
pnpm build
```

## Deploy To Vercel

The app is static-first, but not pure `output: "export"` by default because `/api/roleplay` is an optional Vercel route. Core curriculum, SRS, radio scripts, roleplays, mission logs, and progress all work without the API route or any LLM key.

```powershell
npm install -g vercel
vercel login
vercel --prod
```

For GitHub:

```powershell
winget install --id GitHub.cli -e
gh auth login
git branch -M main
gh repo create utkarsh348/no-more-gothilla --public --source . --remote origin --push
```

Vercel can also import `utkarsh348/no-more-gothilla` from the dashboard.

## iPhone Safari Use

Use it as a normal private website in Safari. No TestFlight, App Store, sideloading, or native install is required. Add to Home Screen is optional. The manifest and service worker help with app-like launch and caching, but the website remains fully usable in Safari.

## Audio Modes

- Gym: short call-and-response drills with pauses.
- Running: low-load listening, summary, slow replay, natural replay, and shadowing.
- Commute: scenario conversation with NPC line, pause, model reply, explanation, and next turn.
- Review: due SRS prompts with manual 0-5 self-rating.
- Sleep: familiar passive listening without active recall.

Browser speech synthesis is the default. Safari voice quality depends on the installed system voices.

## MP3 Files

Pre-generated MP3 files are optional. Put them under `public/audio`.

Example paths already used by seed scripts:

```text
/audio/day-1-walk.mp3
/audio/day-1-gym.mp3
/audio/day-1-commute.mp3
/audio/day-2-shadowing.mp3
```

If a file is absent, the app still works through browser TTS and visible scripts.

## Optional LLM Roleplay

Scripted Conversation Dojo works offline and without keys. To connect an optional LLM endpoint, set:

```text
ROLEPLAY_LLM_ENDPOINT=https://your-provider.example/evaluate
ROLEPLAY_LLM_API_KEY=your-key
```

The endpoint is intentionally isolated at `/api/roleplay`, so the rest of the app remains static-first and keyless.

## Content Contract

`pnpm content:check` verifies the bundled seed corpus:

- 10-day curriculum
- 80 core spoken patterns
- 500+ production prompts
- 100+ listening comprehension items
- 50 short general/local dialogues
- 30 business/domain dialogues
- 40 repair drills
- 30 shadowing sessions
- 30 roleplay scenarios
- 200 SRS seed items
- 30 WhatsApp templates
- 10 real-world missions
- 10 gym scripts, 10 running scripts, 10 commute scripts

Progress is stored only in browser localStorage.
