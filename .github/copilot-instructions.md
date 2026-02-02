# DAPAUE Archive - Coding Instructions

## Project Overview

**The Dapaue Files** is an interactive mystery/detective fiction archive presented as a retro-futuristic terminal interface. It's a narrative-driven web app (with Electron desktop variant) that lets users explore classified emails, uncover conspiracies, and access user profiles across five security privilege levels.

**Tech Stack:**
- Frontend: HTML5 + Vanilla JS (no frameworks)
- Styling: Tailwind CSS + custom CRT effects
- Data: JSON-based content (JSON-first architecture with JS fallback)
- Backend: Python Flask (optional admin API)
- Desktop: Electron

## Critical Architecture Decisions

### 1. JSON-First Data Loading Pipeline
Located in [assets/data/data-loader.js](assets/data/data-loader.js), the app prioritizes JSON files over JavaScript:

- Attempts to load `assets/data/emails.json`, `assets/data/staff-users.json`, and user-scoped files from `assets/data/users/{USERNAME}/`
- Falls back to injecting `lore-data.js` if JSON loading fails
- **Why:** Enables narrative updates without rebuilding; editors can modify content directly
- **Key insight:** The `mergeStaffUsers()` function combines base users with per-user loaded emails—understand this for debugging data conflicts

### 2. Staff User Privilege Model
Users have **two separate leveling systems:**
- `privilege_level` (1-5): Controls what *narrative content* the user has access to
- `securityLevel` (1-5): Filters which server they're logged into; determines email visibility

Both are required for proper access control. Missing one breaks the forensics or terminal filtering.

### 3. Two Admin Interfaces
- **admin-panel.html** – Full CRUD for global emails, staff profiles, user-scoped emails/files; includes export/import
- **admin-tool.html** – Simpler JSON exporter for individual users; mirrors `assets/data/users/` folder structure

Use the appropriate tool based on workflow. Panel is more feature-rich; Tool is lightweight for batch exports.

## Data Model Specifics

### Email Schema
```javascript
{
  id: "M-0001",           // Unique; prefixed with user in user-scoped emails
  sender: "USERNAME",     // Must match a staff user
  receiver: "DEPT",       // Optional recipient field
  subject: "Title",       // Required
  date: "2099-04-12",     // YYYY-MM-DD required
  encryption: "RSA-4096", // Display label
  signal: "95.0",         // Percentage (integrity)
  category: "inbox",      // "inbox" | "sent" | "archive" | "deleted" | "file"
  tags: ["tag-name"],     // Optional; matches tagCatalog
  locked: false,          // Encrypted flag
  unlockCode: "CODE-####",// Unlock password
  body: "Content...",     // Main message text
  attachments: []         // Optional image/media refs
}
```

**Gotcha:** `category: "file"` repurposes email schema for file objects (see line 11255 in terminal.html).

### Staff User Schema
```javascript
{
  username: "M_JOHNSON",
  name: "Michael Johnson",
  department: "Research",
  privilege_level: 1,           // Story access tier
  securityLevel: 1,             // Server access tier (matches server)
  status: "ACTIVE",
  accessCode: "SECURE-PASSWORD", // Unlock password
  emails: [...],                // Scoped emails (loaded from JSON)
  files: [...]                  // Scoped files (loaded from JSON)
}
```

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| [terminal.html](terminal.html) | Main interactive interface (11k+ lines); contains window manager, email archive UI, terminal command processor |
| [assets/data/data-loader.js](assets/data/data-loader.js) | Async JSON/JS loader with fallback; validates emails; merges user data |
| [apps/briefingApp.js](apps/briefingApp.js) | Mission briefing widget (narrative context) |
| [apps/sysmonApp.js](apps/sysmonApp.js) | System monitor widget (neofetch-style) |
| [apps/pongEasterEgg.js](apps/pongEasterEgg.js) | Hidden tennis mini-game |
| [admin-panel.html](admin-panel.html) | Content management dashboard |
| [admin-tool.html](admin-tool.html) | JSON export tool (user-scoped) |
| [who-mask.css](who-mask.css) | CRT effect styling |

## Developer Workflows

### Adding New Content
1. **Global emails:** Edit `assets/data/emails.json` directly or via admin-panel
2. **User-scoped emails/files:** 
   - Create folder `assets/data/users/{USERNAME}/`
   - Add `{USERNAME}_emails.json` and/or `{USERNAME}_files.json`
   - Reference in `assets/data/users/index.json` as array of paths: `["M_JOHNSON/M_JOHNSON.json", ...]`
3. **Reload in real-time:** Use terminal command `reload_data` (no page refresh needed)

### Testing Changes
- **Local server:** `python -m http.server 8080` (Python backend at port 8080)
- **Electron build:** `npm run dist` (outputs to `dist/`)
- **Watch mode:** Not configured; manual refresh recommended for JS changes

### Terminal Commands (Extensible)
Located at line 10894 in terminal.html:
```javascript
case 'reload_data':
  await window.reloadArchiveData();
  seedStaticEntities();  // Refresh forensics catalogs
  loadEmailList();       // Refresh UI
```

To add a command: Add a `case 'commandname':` block returning `{className, message}`. Use `processTerminalCommand()` dispatch.

## Common Patterns & Conventions

### 1. Global State Objects
- `window.emails` – All global emails (validated)
- `window.staffUsers` – All users + their scoped emails
- `window.entities` – Catalogs: `characters`, `locations`, `events`, `servers`
- `window.tagCatalog` – Tag definitions for color coding
- `window.dataSource` – "json" or "js" (indicates load source)

### 2. CRT Visual Effects
CSS custom properties in terminal.html control aesthetics:
```css
--bg-dark: #0a0a0a;
--panel-dark: #1a1a1a;
--accent: #ffffff;
--crt-opacity: 0.25;      /* CRT flicker intensity */
--noise-opacity: 0.05;    /* Scanline noise */
--blur-strength: 8px;     /* Bloom */
```

Modify `:root` to theme globally. Don't hardcode colors; use CSS variables.

### 3. Email Filtering in Terminal
Terminal uses `activeServerId` and `activeServerNode.securityLevel` to filter which users are visible to the player. Changing security level dynamically filters `staffUsers` list. See `processTerminalCommand('list')` for the pattern.

### 4. JSON Validation
The `validateEmails()` function (line 10 in data-loader.js) enforces required fields:
- `id`, `subject`, `date`, `category` must exist
- Invalid entries are logged as warnings and skipped

Always ensure JSON is valid before committing; use `JSON.stringify()`/`JSON.parse()` to test.

## Integration Points & Cross-References

### Admin Panel ↔ Terminal
Admin panel edits write to `assets/data/` JSON files. Terminal `reload_data` command re-fetches and re-parses them. No persistent backend save needed for web version (Flask backend is optional for production).

### Forensics Tool (Hidden Feature)
Terminal command `[F] FORENSICS TOOL` enables text search. Uses `window.entities` and `window.emails` to highlight matches. Populated by data-loader when `entities.json` exists.

### Window Manager
Terminal.html implements a custom drag-and-drop window system (no external lib). Windows have IDs like `archive-window`, `briefing-window`, `sysmon-window`. Functions: `openWindow()`, `closeWindow()`, `startDrag()`, `toggleWindowFullscreen()`.

## Common Pitfalls

1. **Missing security/privilege level fields** → Email filtering breaks silently; check `securityLevel` on user objects
2. **Malformed JSON** → Data-loader silently falls back to lore-data.js; validate in console
3. **Hardcoded colors** → Won't respond to theme changes; always use CSS variables
4. **Terminal command typos** → No error logging; check browser console and spell carefully (case-sensitive)
5. **User folder structure mismatch** → If `assets/data/users/index.json` lists `M_JOHNSON/M_JOHNSON.json` but folder is missing, emails won't load for that user

## Getting Help

- **Console errors:** Open DevTools (F12) → Console tab; data-loader logs all load attempts with `[data-loader]` prefix
- **Data structure questions:** Check README.md "Content Model" section or examine `assets/data/emails.json` example
- **Terminal command additions:** Grep for `case 'list':` in terminal.html to see the pattern; return `{className, message}`
