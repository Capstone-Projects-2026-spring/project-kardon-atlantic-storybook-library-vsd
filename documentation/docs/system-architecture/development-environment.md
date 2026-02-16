---
sidebar_position: 4
---

# Development Environment

## Hardware Requirements

**Minimum:**
- Dual-core processor (Intel i3 or equivalent)
- 8 GB RAM
- 10 GB free disk space
- Internet connection for Supabase and package downloads

**Recommended:**
- Quad-core processor (Intel i5/i7 or Apple M1/M2)
- 16 GB RAM
- 20 GB free SSD storage
- 1920x1080 display

**Supported Platforms:** macOS 12+, Windows 10/11, Ubuntu 20.04+

---

## Required Software

### Core Tools

**Node.js 18.x or later** - Download from [nodejs.org](https://nodejs.org)
- Includes npm package manager
- Verify: `node --version && npm --version`

**Git 2.x or later** - Download from [git-scm.com](https://git-scm.com)
- Required for version control
- Verify: `git --version`

### IDE: Visual Studio Code

We use VS Code as our primary editor. Download from [code.visualstudio.com](https://code.visualstudio.com)

**Install these extensions:**
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- ES7+ React Snippets (dsznajder.es7-react-js-snippets)
- Auto Rename Tag (formulahendry.auto-rename-tag)
- Path Intellisense (christian-kohler.path-intellisense)
- Supabase (supabase.supabase-vscode)

You can use WebStorm, Sublime Text, or Atom if you prefer, but the team primarily uses VS Code.

---

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Konva 10** - Canvas library for VSD editor
- **Zustand 5** - State management

### Backend (Supabase)
- **PostgreSQL 15** - Database
- **Supabase Storage** - File storage for images and audio
- **Supabase Auth** - User authentication

### Testing
- **Vitest 4** - Unit testing
- **Testing Library 16** - React component testing

---

## Getting Started

### 1. Install Prerequisites
```bash
# Verify Node.js and npm
node --version  # Should be v18+
npm --version   # Should be v9+

# Verify Git
git --version
```

### 2. Clone and Install
```bash
git clone <repository-url>
cd project-kardon-atlantic-storybook-library-vsd
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard at Settings > API.

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy Project URL and anon/public key
5. Add to your `.env.local` file

Database tables are created through the Supabase Dashboard SQL editor (see Database Design documentation).

---

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
npm test             # Run tests
npm run test:ui      # Open test dashboard
```

---

## Browser Tools

Install these Chrome extensions:
- React Developer Tools
- Redux DevTools (for debugging state)

Use Chrome DevTools for debugging network requests and inspecting elements.

---

## Deployment

**Frontend:** Render.com
**Backend:** Supabase (managed hosting)
**CI/CD:** GitHub Actions

Production builds output to the `dist/` directory.

---

## Common Issues

**Port 5173 already in use:**
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Wrong Node version:**
```bash
# Install correct version
nvm install 18
nvm use 18
```

**Supabase connection errors:**
- Double-check your `.env.local` credentials
- Verify your Supabase project is active
- Make sure you're using the anon key, not the service role key

---

## Setup Checklist

Before starting development, complete these steps:

- [ ] Install Node.js 18+
- [ ] Install Git
- [ ] Install VS Code and extensions
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create Supabase project
- [ ] Add Supabase credentials to `.env.local`
- [ ] Verify dev server runs (`npm run dev`)
- [ ] Verify tests run (`npm test`)
- [ ] Install browser extensions
- [ ] Configure Git username and email
