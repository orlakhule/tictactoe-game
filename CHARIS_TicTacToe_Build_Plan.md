# CHARIS Tic-Tac-Toe React App — Build Plan

**Brand:** CHARIS  
**Primary Brand Colour:** Blue  
**Product:** Tic-Tac-Toe web application  
**Frontend:** React  
**Document:** PRD + DRD + TRD + ADR  
**Version:** 1.0  
**Status:** Ready for implementation

---

## 1. Executive Summary

CHARIS Tic-Tac-Toe is a modern, responsive React-based game branded around the name **CHARIS** and a blue visual identity.

The first release focuses on a fast, simple, enjoyable Tic-Tac-Toe experience with:

- Player vs Player gameplay
- Player vs Computer gameplay
- Automatic win/draw detection
- Score tracking
- New game and reset controls
- Responsive mobile and desktop UI
- Accessible interactive controls
- Clear game status messages
- Blue-focused CHARIS branding

The architecture should keep game logic independent from the UI so the application can later support additional game modes, difficulty levels, themes, persistence, and online multiplayer.

---

# 2. PRD — Product Requirements Document

## 2.1 Product Vision

Build a polished Tic-Tac-Toe game that feels simple enough for instant play while presenting a professional **CHARIS** brand identity.

### Product goals

1. Make a game playable within seconds.
2. Provide clear feedback after every move.
3. Work well on phones, tablets, and desktops.
4. Prevent invalid moves.
5. Keep the interface visually clean and recognizable.
6. Create an architecture that can grow beyond the MVP.

### Success criteria

- A user can start a game without registration.
- A complete match can be played without page reloads.
- Wins, losses, and draws are correctly detected.
- The UI clearly identifies whose turn it is.
- The board is usable with mouse, touch, and keyboard.
- The layout works on common mobile and desktop screen sizes.

---

## 2.2 Target Users

### Primary users

- Casual players
- Children and families
- Students
- Friends playing locally
- Users looking for a quick browser game

### Secondary users

- Developers using the project as a React game example
- Users interested in simple branded web games

---

## 2.3 MVP Scope

### Included

- CHARIS branding
- Blue visual theme
- 3×3 Tic-Tac-Toe board
- X and O players
- Player vs Player mode
- Player vs Computer mode
- Computer opponent
- Turn indicator
- Win detection
- Draw detection
- Winning-cell highlighting
- Scoreboard
- New round button
- Reset match button
- Responsive design
- Basic accessibility
- Local game-state management

### Not included in MVP

- User accounts
- Online multiplayer
- Chat
- Payments
- Leaderboards
- Cloud database
- Social login
- Ads
- Complex analytics
- Tournament system

---

## 2.4 Functional Requirements

### FR-01: Start Game

The application shall allow the user to start a new match immediately.

### FR-02: Board

The application shall display a 3×3 board containing nine interactive cells.

### FR-03: Player Moves

A player shall be able to select an empty cell.

Once selected:

- The cell receives the player's symbol.
- The cell becomes unavailable.
- The turn changes.

### FR-04: Invalid Moves

The application shall prevent users from selecting an occupied cell or making moves after the game has ended.

### FR-05: Win Detection

The application shall detect all eight winning combinations:

- Three horizontal rows
- Three vertical columns
- Two diagonals

### FR-06: Draw Detection

The application shall declare a draw when all nine cells are occupied and no player has won.

### FR-07: Winning Highlight

The winning three cells shall receive a visual highlight.

### FR-08: Scoreboard

The application shall track:

- Player X wins
- Player O wins
- Draws

### FR-09: New Round

A new round shall clear the board while preserving the match score.

### FR-10: Reset Match

Reset Match shall clear the board and reset all scores.

### FR-11: Game Modes

The application shall support:

1. Local Player vs Player
2. Player vs Computer

### FR-12: Computer Player

The computer shall automatically make a legal move after the human player's move.

For the MVP, the computer may use a minimax strategy to provide an unbeatable opponent.

### FR-13: Status Message

The UI shall communicate:

- X's turn
- O's turn
- Player X wins
- Player O wins
- Draw
- Computer thinking

### FR-14: Responsive Interface

The board and controls shall adapt to:

- Mobile
- Tablet
- Desktop

---

## 2.5 Non-Functional Requirements

### Performance

- Initial UI should load quickly.
- Game interactions should feel instantaneous.
- No unnecessary network requests are required for MVP.

### Accessibility

- Interactive cells must be keyboard accessible.
- Controls must have accessible labels.
- Focus states must be visible.
- Colour must not be the only indicator of game state.

### Reliability

- Game logic must produce deterministic results for identical game states.
- Invalid state transitions must be prevented.

### Maintainability

- Components should have clear responsibilities.
- Game logic should be separated from presentation.
- Reusable constants should be centralized.

---

## 2.6 User Stories

### US-01

As a player, I want to start a game quickly so that I can begin playing without unnecessary setup.

### US-02

As a player, I want to see whose turn it is so that I know when I can play.

### US-03

As a player, I want the application to detect a winner automatically so that I do not need to calculate the result.

### US-04

As a player, I want a new round button so that I can immediately play again.

### US-05

As a player, I want scores to persist between rounds so that I can track the match.

### US-06

As a player, I want to play against the computer so that I can play alone.

### US-07

As a mobile user, I want the board to fit my screen so that the game is comfortable to use.

---

## 2.7 Acceptance Criteria

A release is acceptable when:

- The board contains exactly nine cells.
- Each cell can contain only X, O, or empty.
- A player cannot overwrite an occupied cell.
- Every valid winning combination is detected.
- Draws are detected correctly.
- The winner is visually identified.
- The scoreboard updates correctly.
- New Round preserves scores.
- Reset Match clears scores.
- Computer mode produces legal moves.
- The game works responsively.
- Keyboard users can operate the game.

---

# 3. DRD — Design Requirements Document

## 3.1 Brand Direction

### Brand name

**CHARIS**

The brand should appear prominently in the application header.

### Brand personality

- Friendly
- Modern
- Playful
- Clean
- Confident
- Approachable

### Primary colour

**Blue**

Recommended starting palette:

| Purpose | Colour |
|---|---|
| Primary | `#2563EB` |
| Primary Dark | `#1D4ED8` |
| Light Blue | `#DBEAFE` |
| Background | `#EFF6FF` |
| Surface | `#FFFFFF` |
| Text | `#0F172A` |
| Muted Text | `#64748B` |
| Success | `#16A34A` |
| Danger | `#DC2626` |

These values are design defaults and may be refined during implementation.

---

## 3.2 Layout

### Desktop

Recommended structure:

```text
┌────────────────────────────────────────────┐
│                 CHARIS                     │
│             TIC-TAC-TOE                    │
├────────────────────────────────────────────┤
│                                            │
│       Player X     Draws     Player O      │
│          0           0          0          │
│                                            │
│              X's Turn                      │
│                                            │
│          ┌────┬────┬────┐                  │
│          │ X  │    │ O  │                  │
│          ├────┼────┼────┤                  │
│          │    │ X  │    │                  │
│          ├────┼────┼────┤                  │
│          │ O  │    │ X  │                  │
│          └────┴────┴────┘                  │
│                                            │
│       [ New Round ] [ Reset Match ]        │
│                                            │
└────────────────────────────────────────────┘
```

### Mobile

The layout should stack vertically:

1. CHARIS logo/wordmark
2. Game mode
3. Scoreboard
4. Turn status
5. Board
6. Game controls

---

## 3.3 UI Components

### Header

Contains:

- CHARIS brand name
- Tic-Tac-Toe subtitle

### Game Mode Selector

Options:

- Player vs Player
- Player vs Computer

### Scoreboard

Three score cards:

- X
- Draw
- O

### Status Panel

Displays current turn or game result.

### Board

3×3 interactive grid.

### Cell

Each cell should:

- Have a large click/tap target
- Display X or O
- Support keyboard interaction
- Show hover/focus states
- Become visually inactive after selection

### Controls

Primary:

**New Round**

Secondary:

**Reset Match**

---

## 3.4 Interaction Design

### Empty cell

- Cursor indicates interactivity.
- Subtle hover effect.
- Visible keyboard focus.

### Selected cell

- Displays X or O.
- No longer interactive.

### Winning cell

- Blue-based highlight or accent treatment.
- Strong visual emphasis.

### Draw

- Neutral success/status treatment.
- Clearly states that the round ended in a draw.

### Computer turn

Display a temporary state such as:

> Computer is thinking...

---

## 3.5 Responsive Breakpoints

Suggested breakpoints:

- Small mobile: `< 480px`
- Mobile/tablet: `480px–767px`
- Tablet: `768px–1023px`
- Desktop: `≥ 1024px`

The board should use responsive sizing while maintaining a square aspect ratio.

---

## 3.6 Typography

Recommended:

- Modern sans-serif font
- Strong heading weight
- Large board symbols
- High readability for status messages

Suggested hierarchy:

- CHARIS: 28–36px
- Game title: 18–24px
- Status: 18–24px
- Board symbols: 48–72px depending on viewport
- Body: 14–16px

---

## 3.7 Accessibility Design

- Use semantic buttons for cells.
- Include accessible labels such as `Cell 1, row 1, column 1`.
- Support keyboard navigation.
- Provide visible focus rings.
- Maintain sufficient contrast.
- Do not rely exclusively on blue/green/red colour to communicate status.
- Announce important game results using an appropriate live region.

---

# 4. TRD — Technical Requirements Document

## 4.1 Technical Stack

### Frontend

- React
- JavaScript or TypeScript
- Vite
- CSS or CSS Modules

### Recommended MVP stack

```text
React
TypeScript
Vite
CSS Modules
ESLint
Prettier
```

No backend is required for the MVP.

---

## 4.2 Proposed Architecture

```text
src/
├── components/
│   ├── Header/
│   ├── GameModeSelector/
│   ├── Scoreboard/
│   ├── GameStatus/
│   ├── Board/
│   ├── Cell/
│   └── GameControls/
│
├── game/
│   ├── constants.ts
│   ├── gameLogic.ts
│   ├── winConditions.ts
│   └── computerPlayer.ts
│
├── hooks/
│   └── useTicTacToe.ts
│
├── types/
│   └── game.ts
│
├── styles/
│   ├── globals.css
│   └── theme.css
│
├── App.tsx
└── main.tsx
```

---

## 4.3 Data Model

```ts
type Player = 'X' | 'O';

type CellValue = Player | null;

type Board = CellValue[];

type GameMode = 'pvp' | 'computer';

type GameStatus = 'playing' | 'won' | 'draw';

interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  winningCells: number[];
  status: GameStatus;
  mode: GameMode;
}

interface Score {
  X: number;
  O: number;
  draws: number;
}
```

---

## 4.4 Game Logic

The game engine should provide pure functions.

Recommended functions:

```ts
checkWinner(board)
getWinningCells(board)
isBoardFull(board)
makeMove(board, index, player)
getAvailableMoves(board)
getComputerMove(board)
```

### Winner algorithm

Check these eight combinations:

```text
[0,1,2]
[3,4,5]
[6,7,8]
[0,3,6]
[1,4,7]
[2,5,8]
[0,4,8]
[2,4,6]
```

If all three cells in any combination contain the same player, that player wins.

---

## 4.5 Computer AI

For the MVP, use minimax.

### Requirements

- Computer may play as O.
- It can only select an empty cell.
- It should not move after the game has ended.
- It should not modify the player's existing cells.

### Optional difficulty levels

Future versions can add:

- Easy — random legal moves
- Medium — mixed random/minimax strategy
- Hard — minimax

---

## 4.6 State Management

React local state is sufficient for MVP.

Recommended state:

```text
board
currentPlayer
winner
winningCells
status
mode
score
```

A custom hook such as `useTicTacToe()` should encapsulate game-state transitions.

This prevents `App.tsx` from becoming overloaded with game logic.

---

## 4.7 Persistence

MVP:

- No server persistence.

Optional:

- Use `localStorage` to preserve scoreboard between browser sessions.

Example key:

```text
charis-tictactoe-score
```

---

## 4.8 Testing Requirements

### Unit tests

Test:

- Empty board
- Valid move
- Invalid move
- Horizontal win
- Vertical win
- Diagonal win
- Draw
- Winning-cell calculation
- Reset logic
- Score updates
- Computer move legality

### Component tests

Test:

- Board rendering
- Cell click
- Turn display
- Scoreboard
- New Round
- Reset Match
- Game mode switching

### End-to-end tests

Test a complete:

1. PvP match
2. Computer match
3. Winning scenario
4. Draw scenario
5. Reset scenario

---

## 4.9 Performance

The application is small and should require minimal optimization.

Priorities:

- Avoid unnecessary component re-renders.
- Keep game functions pure.
- Avoid external network requests.
- Use CSS rather than JavaScript for simple animations.

---

## 4.10 Security

Because the MVP is client-side only:

- No authentication is required.
- No sensitive user data should be collected.
- No secrets should be stored in frontend code.
- Any future API keys must be kept server-side.

---

## 4.11 Deployment

Recommended deployment targets:

- Vercel
- Netlify
- Cloudflare Pages
- Static hosting

Build command:

```bash
npm run build
```

The generated production assets should be served as a static React application.

---

# 5. ADR — Architecture Decision Records

## ADR-001: Use React

**Status:** Accepted

### Context

The application requires interactive stateful UI updates.

### Decision

Use React as the frontend framework.

### Reasons

- Component-based architecture
- Strong ecosystem
- Simple state management for this application
- Suitable for interactive games
- Easy deployment as a static frontend

### Consequences

Positive:

- Reusable components
- Clear UI/state separation
- Easy future expansion

Negative:

- Adds framework overhead compared with vanilla JavaScript.

---

## ADR-002: Use TypeScript

**Status:** Accepted

### Context

Game state contains several constrained values such as players, game modes, and statuses.

### Decision

Use TypeScript.

### Reasons

- Strong type safety
- Better developer tooling
- Reduced state-related bugs
- Easier future maintenance

### Consequences

Developers must maintain type definitions, but the improved reliability is worth the additional setup.

---

## ADR-003: Use Local React State for MVP

**Status:** Accepted

### Context

The application has a small amount of local game state and no backend.

### Decision

Use React state and a custom `useTicTacToe` hook.

### Reasons

- Simple
- No external dependency
- Easy to understand
- Appropriate for MVP scope

### Rejected alternatives

- Redux
- Zustand
- MobX

These would add unnecessary complexity at this stage.

---

## ADR-004: Keep Game Logic Separate from UI

**Status:** Accepted

### Context

Game rules should be independently testable and reusable.

### Decision

Implement game rules as pure functions in the `game/` directory.

### Consequences

The application becomes easier to test and future interfaces can reuse the same game engine.

---

## ADR-005: Use Minimax for Computer Mode

**Status:** Accepted

### Context

The computer opponent should provide a reliable challenge.

### Decision

Use minimax for the hard/default computer strategy.

### Reasons

- Deterministic
- No backend required
- Perfect for a 3×3 Tic-Tac-Toe board
- Computationally inexpensive

### Future option

Add difficulty levels without changing the core board architecture.

---

## ADR-006: Use Blue as the Core Brand Colour

**Status:** Accepted

### Context

CHARIS requires a recognizable visual identity.

### Decision

Use blue as the primary brand colour.

### Design principle

Blue should dominate primary actions, brand elements, focus states, and selected game states without sacrificing accessibility.

---

## ADR-007: No Backend for MVP

**Status:** Accepted

### Context

Local gameplay does not require a server.

### Decision

Build the first version as a client-side application.

### Benefits

- Lower infrastructure cost
- Faster development
- Easier deployment
- Better privacy
- Works offline after assets are loaded

### Future backend requirements

A backend may be introduced for:

- Online multiplayer
- Accounts
- Leaderboards
- Match history
- Cloud synchronization

---

## ADR-008: Optional LocalStorage Persistence

**Status:** Accepted for optional implementation

### Context

Users may want their scoreboard to survive page refreshes.

### Decision

Use browser `localStorage` if persistent local scores are included.

### Constraint

Do not store sensitive information.

---

# 6. Build Phases

## Phase 1 — Project Setup

- Create Vite React TypeScript project.
- Configure ESLint.
- Configure Prettier.
- Create initial folder structure.
- Establish blue CHARIS theme.

## Phase 2 — Core Game Engine

- Create game types.
- Create board constants.
- Implement move validation.
- Implement winner detection.
- Implement draw detection.
- Implement reset logic.

## Phase 3 — UI

- Build CHARIS header.
- Build scoreboard.
- Build board.
- Build cells.
- Build status panel.
- Build game controls.
- Add responsive styling.

## Phase 4 — Computer Mode

- Implement legal-move detection.
- Implement minimax.
- Connect computer turns to React state.
- Add computer-thinking status.

## Phase 5 — Accessibility

- Keyboard interaction.
- Focus states.
- ARIA labels where appropriate.
- Screen-reader status announcements.
- Contrast review.

## Phase 6 — Testing

- Unit tests.
- Component tests.
- End-to-end tests.
- Mobile testing.
- Desktop testing.

## Phase 7 — Polish

- Add subtle animations.
- Improve transitions.
- Refine spacing.
- Refine blue palette.
- Add empty/loading states where needed.

## Phase 8 — Deployment

- Run production build.
- Verify production behavior.
- Deploy to static hosting.
- Test the deployed application.

---

# 7. Definition of Done

The CHARIS Tic-Tac-Toe MVP is complete when:

- [ ] React project is configured.
- [ ] CHARIS branding is implemented.
- [ ] Blue theme is implemented.
- [ ] 3×3 board works.
- [ ] X/O turns work.
- [ ] Invalid moves are blocked.
- [ ] All winning combinations work.
- [ ] Draw detection works.
- [ ] Winning cells are highlighted.
- [ ] Scoreboard works.
- [ ] New Round works.
- [ ] Reset Match works.
- [ ] PvP mode works.
- [ ] Computer mode works.
- [ ] Responsive design works.
- [ ] Keyboard interaction works.
- [ ] Accessibility checks pass.
- [ ] Tests pass.
- [ ] Production build succeeds.
- [ ] Application is deployed successfully.

---

# 8. Future Roadmap

## Version 1.1

- Easy/Medium/Hard AI
- Sound effects
- Better animations
- Persistent local scores
- Theme switcher

## Version 2.0

- Online multiplayer
- Room codes
- Real-time gameplay
- Player profiles
- Match history

## Version 3.0

- Global leaderboard
- Tournaments
- Achievements
- User accounts
- Cloud synchronization

---

# 9. Recommended First Implementation

Start with the smallest reliable vertical slice:

```text
CHARIS Header
      ↓
Game Mode
      ↓
Scoreboard
      ↓
Turn Status
      ↓
3×3 Board
      ↓
Win/Draw Detection
      ↓
New Round / Reset
```

Then add the computer opponent after local PvP is stable.

This approach reduces complexity and ensures that the core game engine is correct before adding AI or future online features.

---

# 10. Final Architecture Summary

```text
                    ┌───────────────────┐
                    │    CHARIS App     │
                    │   Blue Branding   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │    React UI       │
                    ├───────────────────┤
                    │ Header            │
                    │ Mode Selector     │
                    │ Scoreboard        │
                    │ Status            │
                    │ Board / Cells     │
                    │ Controls           │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ useTicTacToe Hook │
                    │ State Management  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Game Engine     │
                    ├───────────────────┤
                    │ Win Detection     │
                    │ Draw Detection    │
                    │ Move Validation   │
                    │ Board Operations  │
                    └─────────┬─────────┘
                              │
                  ┌───────────▼───────────┐
                  │   Computer Player     │
                  │       Minimax         │
                  └───────────────────────┘
```

**Recommended MVP principle:** Keep the first release simple, fast, accessible, and entirely client-side while making the game engine modular enough to support multiplayer and additional features later.
