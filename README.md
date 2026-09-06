# TaskPilot

TaskPilot is an AI-powered automation platform that turns simple user inputs into personalized AI workflows. Users answer a few questions, choose a schedule, and TaskPilot generates prompts, executes them, and delivers results via their chosen channels.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Fill `.env` with your Firebase web app config, then in the Firebase console enable Authentication providers (Email/Password, Google, GitHub, Microsoft, Apple) and add authorized domains (`localhost`, etc).

For AI chat, add an OpenRouter API key from [OpenRouter](https://openrouter.ai/keys) as `VITE_OPENROUTER_API_KEY` (covers ChatGPT, Claude, Gemini, and free models), then restart the dev server.

For the landing Telegram connect button, set `VITE_TELEGRAM_BOT_USERNAME` to your bot username (without `@`).

## Features

- **Themes**: system, light, and dark (preference persisted)
- **Multi-language**: English, German, and Persian (RTL), with browser detection
- **Auth**: Firebase sign-in / sign-up with email and social providers
- **GitHub Pages**: https://devesmaeili.github.io/taskpilot/

## Contact

For questions or support, reach out to us at [taskpilot.as@outlook.com](mailto:taskpilot.as@outlook.com)
