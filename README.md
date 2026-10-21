# Leenu — Voice Assistant & Dossier for Laureen Simberg

An elegant, minimalist voice assistant representing Estonian Junior National biathlete and **Estonian Business School (EBS)** Impactful Entrepreneurship student **Laureen Simberg**.

Built with React 19, TypeScript, Tailwind CSS, and Google Gemini AI (`@google/genai`).

---

## Features

- **Bilingual Voice Assistant (Leenu)**:
  - Speaks fluent **English** (soft, poised feminine tone with an American accent) and **Estonian** (*pehme eesti aktsent ja emakeel*).
  - High-fidelity Gemini text-to-speech audio via Gemini 3.8 Flash Lite TTS model (`prebuiltVoiceConfig: { voiceName: "Kore" }`).
  - Seamless in-browser Web Speech API fallback for zero-downtime voice interaction on static platforms (e.g. GitHub Pages).
  - Live microphone speech-to-text recognition with visual audio waveform animation.
- **Laureen Simberg's Verified Portfolio & Dossier**:
  - **EBS Impactful Entrepreneurship**: Current undergraduate Bachelor studies in venture development, financial analysis, and sustainable business models.
  - **Athletic Milestones**: 12th place at the Youth Olympic Games (Gangwon), Biathlon Junior World Championships, European Youth Olympic Festival (EYOF), and 3× Baltic Championships title.
  - **Business & Investing**: Personal stock portfolio management, Investment Camp Estonia, and Investor Toomas course.
  - **Verified Document Scan**: In-app modal viewer and download for the official `Laureen_Simberg_CV_d34b8d13.pdf`.
  - **References & Direct Contact**: Endorsements from Anne Matt (Audentes) and Gähtlin Leppanen (Team Estonia sports psychologist).

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or bun

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-github-repo-url>
cd leenu-laureen-simberg-assistant
npm install
```

### Environment Configuration (Optional)

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

*(Note: Even without an API key, the assistant includes a full client-side bilingual knowledge engine and in-browser speech synthesis, so the site works immediately out of the box).*

### Running Locally

To run the full-stack server (Express + Vite + Gemini backend):

```bash
npm run dev
```

To run purely the client development server:

```bash
npm run dev:client
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

This generates optimized static production files in the `dist/` directory.

---

## Deployment

- **Vercel / Netlify**: Connect your GitHub repository. The build command is `npm run build` and output directory is `dist`.
- **GitHub Pages**: Deploy the `dist` folder directly or use GitHub Actions.
- **Node.js / Cloud Run**: Run `npm run start` to serve the full-stack Express app.
