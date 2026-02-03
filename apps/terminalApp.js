// terminalApp.js
// Handles the TERMINAL window (user access system) with command processing

(function () {
    const TERMINAL_WINDOW_ID = 'user-access-window';

    function injectTerminalWindow() {
        if (document.getElementById(TERMINAL_WINDOW_ID)) return;
        const container = document.body;
        const terminalDiv = document.createElement('div');
        terminalDiv.id = TERMINAL_WINDOW_ID;
        terminalDiv.className = 'window';
        terminalDiv.style.width = '60%';
        terminalDiv.style.height = '70%';
        terminalDiv.style.left = '20%';
        terminalDiv.style.top = '15%';
        terminalDiv.innerHTML = `
            <div class="window-resize-handle"></div>
            <div class="window-titlebar" onmousedown="startDrag(event, 'user-access-window')" ontouchstart="startDrag(event, 'user-access-window')">
                <span class="window-title">SECURITY_OVERRIDE // USER_ACCESS_SYSTEM</span>
                <div class="window-controls">
                    <div class="window-btn" onclick="minimizeWindow('user-access-window')">_</div>
                    <div class="window-btn" onclick="toggleWindowFullscreen('user-access-window')" title="Fullscreen">□</div>
                    <div class="window-btn" onclick="closeWindow('user-access-window')">X</div>
                </div>
            </div>
            <div class="window-content">
                <div id="hacking-terminal" class="w-full h-full bg-[var(--bg-dark)] border border-[var(--panel-light)] flex flex-col p-4 overflow-hidden font-mono text-[11px]">
                    <div id="terminal-output" class="flex-1 overflow-y-auto scrollbar-hidden space-y-2 text-[var(--text-dim)] mb-4">
                        <div class="text-[var(--accent)]">> DAPAUE_SECURITY_OVERRIDE_TERMINAL_v2.1</div>
                        <div class="text-[var(--text-dim)]">> Type 'help' for available commands</div>
                    </div>
                    <div class="border-t border-[var(--panel-light)] pt-2">
                        <div class="flex gap-2">
                            <span id="terminal-prompt" class="text-[var(--accent)]"></span>
                            <input id="terminal-input" type="text" class="flex-1 bg-transparent outline-none text-[var(--text-main)]" placeholder="Enter command..." onkeypress="if(event.key==='Enter') executeCommand()">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(terminalDiv);
    }

    async function loadTerminalEasterEggs() {
        let eggs = [];
        try {
            const scriptFiles = [
                'assets/data/terminal/fast-als.json',
                'assets/data/terminal/pride.json',
                'assets/data/terminal/kib.json',
                'assets/data/terminal/xfiles.json',
                'assets/data/terminal/dishwasher.json',
                'assets/data/terminal/gemma.json'
            ];
            for (const file of scriptFiles) {
                try {
                    const res = await fetch(file);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) eggs = eggs.concat(data);
                    }
                } catch (e) {}
            }
        } catch (e) {}
        window.terminalEasterEggs = eggs;
    }

    function initTerminalApp() {
        injectTerminalWindow();
        loadTerminalEasterEggs();
        window.injectTerminalWindow = injectTerminalWindow;
    }

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTerminalApp);
    } else {
        initTerminalApp();
    }
})();
