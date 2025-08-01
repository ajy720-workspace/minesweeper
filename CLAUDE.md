# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` - Start development server on localhost:3000
- `yarn build` - Build production version
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier

**Development Workflow:**

- Before staging commits: `yarn lint --fix && yarn format`
- Commit when completing a unit of task
- Use English for commit messages, refer to last 3 commits for style consistency
- Use Yarn as package manager (not npm)

## Architecture Overview

This is a Next.js 15 Minesweeper game with user authentication and ranking system.

### Core Architecture

**Frontend Stack:**

- Next.js 15 (App Router) with strict TypeScript
- React 19.1
- TypeScript with strict type safety (avoid `any`)
- Tailwind CSS 4
- Radix UI components (shadcn/ui - use `npx shadcn@latest` not deprecated version)

**Backend/Database:**

- Supabase for database (use Supabase MCP tools, check project ref first)
- Session-based auth using JWT (jose library)
- bcryptjs for password hashing
- Use `.overrideTypes<T>()` for multiple data fetching, `.single<T>()` for single data
- Server-side Supabase client: `await createClient()` (async function)

**Key Directory Structure:**

- `src/app/` - Next.js app router pages and server actions (Server Components by default)
- `src/components/` - React components organized by feature (use `.client.tsx` for Client Components)
- `src/lib/` - Core utilities and business logic
- `src/types/` - TypeScript type definitions
- `supabase/migrations/` - Database schema migrations
- `.gemini/` - Project documentation (PRD.md, Convention.md, Instruction.md)

### Game Architecture

**Core Game Logic (`src/lib/minesweeper.ts`):**

- `createBoard()` - Generates board with mines, ensures safe first click (3x3 area)
- `revealCell()` - Handles cell revealing with recursive flood fill for empty cells
- `chordCell()` - Implements chord clicking (reveal adjacent cells when flags match mine count)

**Game State Management (`src/components/game/Game.tsx`):**

- Manages game state: playing/won/lost
- Handles scoring system with bonuses for different actions
- Keyboard navigation support (arrow keys, spacebar, f/1 for flag, q/2 for question)
- Timer and mine counter tracking

**Difficulty Settings (`src/types/index.ts`):**

- Beginner: 9x9, 10 mines
- Intermediate: 16x16, 40 mines
- Expert: 30x16, 99 mines

### Authentication System

**Session Management (`src/lib/session.ts`):**

- JWT-based sessions with 1-day expiration
- Server-only session handling using Next.js cookies
- Uses SESSION_SECRET environment variable

**Database Schema:**

- `users` table: id, username, password (hashed), created_at
- `game_records` table: user_id, difficulty, win, clear_time_ms, score, played_at

**Auth Flow:**

- Anonymous play allowed
- Save score prompts for login/registration
- Automatic score saving for authenticated users

### Component Architecture

**Game Components:**

- `Game.tsx` - Main game controller with state management
- `Board.tsx` - Renders game board grid
- `Cell.tsx` - Individual cell component with click handlers
- `GameInfoBar.tsx` - Displays timer, mine count, score
- `DifficultySelector.tsx` - Difficulty selection UI

**Auth Components:**

- `AuthModal.tsx` - Login/register modal after game ends
- `LogoutButton.tsx` - Session logout functionality

**Ranking Components:**

- `RankingTable.tsx` - Displays leaderboards
- `UserStats.tsx` - Individual user statistics
- `DifficultyFilter.tsx` - Filter rankings by difficulty

### Database Integration

**Supabase Setup:**

- Client-side: `src/lib/supabase/client.ts`
- Server-side: `src/lib/supabase/server.ts` (with SSR support)
- Uses environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

**Server Actions:**

- `src/app/auth/actions.ts` - Login, register, save game records
- `src/app/ranking/actions.ts` - Fetch ranking data with RPC calls

### UI System

**Design System:**

- Uses shadcn/ui components with Radix UI primitives
- Tailwind CSS for styling with custom component variants
- `src/components/ui/` contains reusable UI components
- `components.json` configures component generation

### Key Features

- **Keyboard Navigation:** Full game playable with keyboard
- **Scoring System:** Points for clicks, flags, chording, with win bonuses
- **Safe First Click:** First click never hits a mine (3x3 safe zone)
- **Chord Clicking:** Click revealed numbers to auto-reveal adjacent cells
- **Anonymous Play:** No registration required to play
- **Persistent Rankings:** Leaderboards per difficulty level
- **Responsive Design:** Works on desktop and mobile

### Environment Variables Required

- `SESSION_SECRET` - JWT signing secret
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Code Quality Guidelines

**Next.js 15 Conventions:**

- Clear Server/Client Component separation
- Server Components (default): No React hooks, use for data fetching and static rendering
- Client Components: Add `"use client";` at top, use for interactivity and browser APIs
- Maximize SSR benefits for performance and SEO

**TypeScript Standards:**

- Strict type safety enabled in tsconfig.json
- Explicit types for functions, props, and API responses
- Handle null/undefined values and union types properly
- Follow ESLint rules including @typescript-eslint and react-hooks

### Current Development Status (TODO.md Reference)

**v1.0 Core Features - Completed:**

- ✅ Difficulty selection (beginner/intermediate/expert)
- ✅ Game info UI (mine count, timer, score)
- ✅ Advanced controls (chord-clicking, keyboard navigation)
- ✅ Independent scoring system
- ✅ Supabase integration with TypeScript types
- ✅ Custom authentication (login/register in game end modal)
- ✅ Session management with JWT cookies
- ✅ Game record saving for authenticated/anonymous users
- ✅ Ranking page with RPC functions implemented

**Remaining v1.0 Tasks:**

- ❌ Profile page (`/profile`) - User's personal play records and statistics
- ❌ UI/UX improvements (responsive design, visual effects, game result display)
- ❌ Code quality improvements (error handling, documentation)

**v1.1 Future Features:**

- Custom difficulty settings
- Theme switching (dark/light mode)

### Testing Strategy

No test framework is currently configured. When adding tests, check the project dependencies first.

### Visual Memory

- Added a detailed architectural documentation to capture the project's comprehensive design and development approach

## Token Efficiency Guidelines

**File Operations:**

- Use `Grep` instead of `Read` for pattern searches
- Use `Read` with offset/limit for large files when only specific sections needed
- Delegate complex file analysis to `Task` tool with specialized agents

**Search Optimization:**

- Combine `Glob` + `Grep` for multi-file searches
- Use specific patterns rather than broad searches
- Refine glob patterns to exclude irrelevant files

**Context Management:**

- Avoid re-requesting previously confirmed information
- Reuse established file structure knowledge
- Skip unnecessary explanations and summaries

**Batch Processing:**

- Execute multiple independent tool calls in single message
- Chain related bash commands with semicolons

**Response Compression:**

- Minimize comments in code blocks
- Remove redundant explanations
- Provide concise, focused answers
