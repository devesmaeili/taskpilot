# TaskPilot

TaskPilot is an AI-powered automation platform that turns simple user inputs into personalized AI workflows. Users answer a few questions, choose a schedule, and TaskPilot generates prompts, executes tasks, learns from results, and delivers notifications. It also provides a ChatGPT-like AI chat experience with multiple models.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Fill `.env` with your Firebase web app config, then in the Firebase console enable Authentication providers (Email/Password, Google, GitHub, Microsoft, Apple) and add authorized domains (`localhost`, `devesmaeili.github.io`).

## Features

- **Themes**: system, light, and dark (preference persisted)
- **Multi-language**: English, German, and Persian (RTL), with browser detection
- **Auth**: Firebase sign-in / sign-up with email and social providers
- **GitHub Pages**: https://devesmaeili.github.io/taskpilot/