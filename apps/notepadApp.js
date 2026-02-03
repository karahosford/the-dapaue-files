// notepadApp.js
// Handles the NOTEPAD text editor window with localStorage persistence

(function () {
    const NOTEPAD_WINDOW_ID = 'notepad-window';
    const STORAGE_KEY = 'dapaue-notepad-content';

    function injectNotepadWindow() {
        if (document.getElementById(NOTEPAD_WINDOW_ID)) return;
        const container = document.body;
        const notepadDiv = document.createElement('div');
        notepadDiv.id = NOTEPAD_WINDOW_ID;
        notepadDiv.className = 'window';
        notepadDiv.style.width = '500px';
        notepadDiv.style.height = '400px';
        notepadDiv.style.left = '25%';
        notepadDiv.style.top = '20%';
        notepadDiv.innerHTML = `
            <div class="window-resize-handle"></div>
            <div class="window-titlebar" onmousedown="startDrag(event, 'notepad-window')" ontouchstart="startDrag(event, 'notepad-window')">
                <span class="window-title">NOTEPAD.TXT // PERSONAL_NOTES</span>
                <div class="window-controls">
                    <div class="window-btn" onclick="minimizeWindow('notepad-window')">_</div>
                    <div class="window-btn" onclick="toggleWindowFullscreen('notepad-window')" title="Fullscreen">□</div>
                    <div class="window-btn" onclick="closeWindow('notepad-window')">X</div>
                </div>
            </div>
            <div class="window-content">
                <textarea id="notepad-textarea" class="w-full h-full bg-[var(--bg-dark)] text-[var(--text-main)] p-4 font-mono text-xs resize-none outline-none" placeholder="// TYPE YOUR NOTES HERE..." style="border: none;"></textarea>
            </div>
        `;
        container.appendChild(notepadDiv);
    }

    function loadNotepadContent() {
        const textarea = document.getElementById('notepad-textarea');
        if (!textarea) return;
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        if (savedNotes) {
            textarea.value = savedNotes;
        }
    }

    function setupNotepadListeners() {
        const textarea = document.getElementById('notepad-textarea');
        if (!textarea) return;
        textarea.addEventListener('input', function() {
            localStorage.setItem(STORAGE_KEY, this.value);
        });
    }

    function setNotepadContent(content) {
        const textarea = document.getElementById('notepad-textarea');
        if (textarea) {
            textarea.value = content;
            localStorage.setItem(STORAGE_KEY, content);
        }
    }

    function initNotepadApp() {
        injectNotepadWindow();
        loadNotepadContent();
        setupNotepadListeners();
        window.injectNotepadWindow = injectNotepadWindow;
        window.setNotepadContent = setNotepadContent;
    }

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNotepadApp);
    } else {
        initNotepadApp();
    }
})();
