# DAPAUE NEURAL-LINK ARCHIVE v4.5

```
████████████████████████████████████████████████████████
█                                                      █
█  [!] CLASSIFIED ARCHIVE ACCESS POINT                █
█  [!] UNAUTHORIZED ACCESS IS PROHIBITED              █
█                                                      █
█  LOCATION: SECTOR-99 SERVER FARM                    █
█  STATUS:   ABANDONED [SINCE 2099-04-14]             █
█  SECURITY: DEGRADED                                 █
█                                                      █
████████████████████████████████████████████████████████
```

## WHAT IS THIS?

You've discovered a preserved terminal interface from an abandoned DAPAUE research facility. The server farm was evacuated under mysterious circumstances, leaving behind fragmented communications and classified data.

Your task: **Piece together what happened.**

## ACCESS INSTRUCTIONS

1. **Download** both files:
   - `terminal.html` (main interface)
   - `lore-data.js` (recovered data packets)

2. **Open** `terminal.html` in any modern web browser

3. **Navigate** the archive:
   - Browse INBOX, SENT, and TRASH folders
   - Read recovered messages
   - Unlock encrypted content
   - Use the FORENSICS tool to search for keywords

## INTERFACE GUIDE

### ICONS & INDICATORS
- `🔒` - Encrypted message (requires unlock code)
- `⚠️` - Fragmented/corrupted data
- `SCAN_ACTIVE` - Forensics mode enabled
- Signal % - Data integrity level (lower = more corrupted)

### UNLOCKING CONTENT
Some messages are encrypted. To unlock them:
1. Read other messages to find unlock codes
2. Codes are hidden in message bodies (format: `CODE-NAME-####`)
3. Enter the code when viewing locked messages
4. Successfully unlocked content stays unlocked

### FORENSICS TOOL
Press `[F] FORENSICS TOOL` to enable text search:
- Type keywords to highlight them across messages
- See match count in real-time
- Useful for tracking recurring names, locations, or events

## FOR STORYTELLERS

Want to add your own lore? Edit `lore-data.js`:

```javascript
{
    id: "M-XXXX",              // Unique ID
    sender: "Your Character",   // Who sent it
    receiver: "Recipient",      // Who received it
    subject: "Message Title",   // Subject line
    date: "2099-XX-XX",        // Timestamp
    encryption: "RSA-4096",    // Security type
    signal: "95.0%",           // Integrity level
    category: "inbox",         // inbox/sent/trash
    tags: ["tag1", "tag2"],    // Story tags
    locked: false,             // Is it encrypted?
    unlockCode: "CODE-1989",   // Required code
    fragment: false,           // Is it corrupted?
    body: "Your message...",   // Main content
    image: "IMAGE_ID",         // Optional image
    audio: "AUDIO_ID"          // Optional audio
}
```

## Content Model (JSON)

You can now author content in JSON files (no rebuild needed). The app loads JSON first and falls back to `lore-data.js` if JSON is missing.

- Folder: `assets/data/`
   - `emails.json` — array of global archive emails (each has a `category`: `inbox` | `sent` | `trash`)
   - `staff-users.json` — array of staff user profiles, each with nested `emails` scoped to that user
   - `entities.json` — optional catalog for `characters`, `locations`, `events`, `servers` used by forensics and cross-references
   - `tags.json` — optional list of canonical tag colors, e.g. `{ name, color }`

Example: `assets/data/emails.json`

```
[
   {
      "id": "M-0001",
      "sender": "Name",
      "receiver": "Dept",
      "subject": "Subject",
      "date": "2099-04-12",
      "encryption": "RSA-4096",
      "signal": "98.2%",
      "tags": ["sector-4"],
      "body": "Text...",
      "image": "assets/images/example.jpg",
      "audio": "assets/audio/example.mp3",
      "category": "inbox"
   }
]
```

Authoring tips:
- Keep JSON valid (no comments). Strings use `\n` for newlines.
- Media paths are relative to project root (e.g., `assets/images/...`).
- For locked items, add `locked: true` and `unlockCode: "CODE-NAME-####"`.

How loading works:
- On page load, the app attempts to fetch `assets/data/emails.json` and `assets/data/staff-users.json`.
- If available, it uses them; otherwise it injects `lore-data.js` as a fallback.
- If present, it also loads `entities.json` and `tags.json` and seeds the Forensics database.
 - Optional content packs: `assets/data/packs/index.json` may list pack files to merge (emails, staffUsers, entities, tags).

Developer utilities:
- Terminal command `reload_data` reloads JSON and packs at runtime and refreshes panels.

### NARRATIVE TIPS:
- Use **signal strength** to show degradation over time
- Mark key revelations as **locked** content
- Use **fragments** for intentionally incomplete messages
- Place unlock codes naturally in earlier messages
- Lower signal % for older/more corrupted data

## DEPLOYMENT OPTIONS

### GitHub Pages (Recommended)
1. Push to GitHub repository
2. Enable Pages in Settings
3. Share the URL

### itch.io
Perfect for narrative experiences:
1. Zip the files
2. Upload as HTML project
3. Tag as "interactive fiction"

### Local Artifact
Provide as downloadable `.zip`:
- Feels authentic (recovered data)
- No internet required
- Easy to preserve/archive

## TECHNICAL NOTES

- **No server required** - runs entirely in browser
- **No dependencies** - just HTML, CSS, and vanilla JS
- **Version control friendly** - track story changes in Git
- **Mobile responsive** - works on tablets and phones
- **Customizable** - adjust colors, fonts, animations in CSS

## STORY POTENTIAL

Use this terminal to tell stories about:
- Post-apocalyptic discoveries
- Corporate conspiracies
- Time anomalies and temporal loops
- AI consciousness
- Abandoned space stations
- Government cover-ups
- Parallel dimensions
- Archaeological digital finds

---

```
[SYSTEM_MESSAGE]
The archive awaits. What secrets will you uncover?

- Press [BREACH_SYSTEM] to begin -
```

## LICENSE

This is your project - use it however you like for your fictional world.

**Created by:** [Your Name/Handle]  
**Version:** 4.5  
**Last Update:** 2026-01-10
