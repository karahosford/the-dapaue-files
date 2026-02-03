// emailVaultApp.js
// Handles the EMAIL VAULT window with email exploration and forensics integration

(function () {
    const EMAIL_VAULT_WINDOW_ID = 'email-vault-window';

    function injectEmailVaultWindow() {
        if (document.getElementById(EMAIL_VAULT_WINDOW_ID)) return;
        const container = document.body;
        const emailVaultDiv = document.createElement('div');
        emailVaultDiv.id = EMAIL_VAULT_WINDOW_ID;
        emailVaultDiv.className = 'window';
        emailVaultDiv.style.width = '90%';
        emailVaultDiv.style.height = '85%';
        emailVaultDiv.style.left = '5%';
        emailVaultDiv.style.top = '5%';
        emailVaultDiv.style.display = 'none';
        emailVaultDiv.innerHTML = `
            <div class="window-resize-handle"></div>
            <div class="window-titlebar" onmousedown="startDrag(event, 'email-vault-window')" ontouchstart="startDrag(event, 'email-vault-window')">
                <span class="window-title" id="email-vault-title">Email // DAPAUE</span>
                <div class="window-controls">
                    <div class="window-btn" onclick="minimizeWindow('email-vault-window')">_</div>
                    <div class="window-btn" onclick="toggleWindowFullscreen('email-vault-window')" title="Fullscreen">□</div>
                    <div class="window-btn" onclick="closeWindow('email-vault-window')">X</div>
                </div>
            </div>
            <div class="window-content">
                <div id="email-vault-terminal" class="w-full h-full terminal-border bg-[var(--bg-dark)] overflow-hidden flex flex-col relative">
                    <div id="email-vault-login-flash" class="absolute inset-0 z-[600] pointer-events-none"></div>

                    <!-- Header -->
                    <div id="email-vault-header" class="h-12 border-b-2 border-[var(--panel-light)] flex items-center justify-between px-4 bg-[var(--panel-dark)] reveal-node">
                        <div class="flex items-center gap-4">
                            <span class="font-bold">Email // DAPAUE</span>
                            <span id="email-vault-node-display" class="text-[9px] text-cyan-500 border border-cyan-900/40 px-2 py-0.5">NODE: ---</span>
                            <span id="email-vault-user-display" class="text-[9px] text-green-500 border border-green-900/40 px-2 py-0.5">USER: ---</span>
                        </div>
                    </div>

                    <div class="flex-1 flex overflow-hidden">
                        <!-- Sidebar -->
                        <div id="email-vault-sidebar" class="w-20 md:w-48 border-r-2 border-[var(--panel-light)] flex flex-col p-2 gap-2 bg-[var(--panel-dark)] reveal-node">
                            <button onclick="toggleEmailVaultSidebar()" class="btn-retro p-2 text-xs text-center mb-2 opacity-70 hover:opacity-100" title="Toggle sidebar">[◄►]</button>
                            <button id="email-vault-tab-inbox" class="btn-retro active p-2 text-xs text-left" onclick="switchEmailVaultTab('inbox')"><span class="sidebar-label">[01] INBOX</span></button>
                            <button id="email-vault-tab-sent" class="btn-retro p-2 text-xs text-left" onclick="switchEmailVaultTab('sent')"><span class="sidebar-label">[02] SENT</span></button>
                            <button id="email-vault-tab-trash" class="btn-retro p-2 text-xs text-left" onclick="switchEmailVaultTab('trash')"><span class="sidebar-label">[03] TRASH</span></button>
                        </div>

                        <!-- Email List -->
                        <div class="flex flex-col border-r-2 border-[var(--panel-light)] bg-[var(--bg-dark)]">
                            <div class="p-2 bg-[var(--panel-dark)] border-b-2 border-[var(--panel-light)]">
                                <input id="email-vault-search" type="text" class="w-full bg-[var(--bg-dark)] border border-[var(--panel-light)] px-2 py-1 font-mono text-xs outline-none" placeholder="SEARCH_EMAILS">
                            </div>
                            <div id="email-vault-list" class="w-64 md:w-80 overflow-y-auto scrollbar-hidden opacity-90 reveal-node flex-1"></div>
                        </div>

                        <!-- Detail View -->
                        <div id="email-vault-detail" class="flex-1 flex flex-col bg-[var(--bg-dark)] overflow-hidden relative reveal-node">
                            <div id="email-vault-no-selection" class="flex-1 flex items-center justify-center flex-col opacity-20" style="display: flex;"><p class="text-sm">SELECT EMAIL</p></div>
                            <div id="email-vault-content" class="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto relative" style="display: none;">
                                <div class="border-b-2 border-[var(--panel-light)] pb-6 mb-6">
                                    <div class="flex justify-between items-start mb-2"><h2 id="email-vault-subject" class="text-xl font-bold">---</h2></div>
                                </div>
                                <div class="flex items-center gap-2 mb-4 text-[9px]">
                                    <button class="btn-retro px-2 py-1 ml-auto" onclick="sendEmailVaultToBoard()" title="Add to Investigation Board">📌 [SEND TO BOARD]</button>
                                </div>
                                <div id="email-vault-body" class="whitespace-pre-wrap leading-relaxed text-sm opacity-90 select-text"></div>
                                <div id="email-vault-cross-ref" class="hidden mt-6 p-4 border-2 border-[var(--panel-light)] bg-[var(--panel-dark)]">
                                    <div class="text-[9px] font-bold mb-3 text-[var(--text-dim)]">CROSS-REFERENCES DETECTED:</div>
                                    <div id="email-vault-cross-ref-list" class="space-y-2 text-xs"></div>
                                </div>
                                <div id="email-vault-attachments" class="mt-8 space-y-6"></div>
                                <div class="mt-12 pt-6 border-t border-[var(--panel-light)] opacity-30 text-[9px]">*** END OF TRANSMISSION ***</div>
                            </div>
                        </div>

                        <!-- Metadata Board -->
                        <div id="email-vault-metadata" class="border-l-2 border-[var(--panel-light)] bg-[var(--panel-dark)] flex flex-col reveal-node">
                            <div id="email-vault-metadata-header" class="p-3 border-b-2 border-[var(--panel-light)] bg-[var(--panel-light)] flex justify-between items-center text-[var(--bg-dark)]">
                                <button onclick="toggleEmailVaultMetadata()" class="text-xs cursor-pointer hover:opacity-80 font-bold" title="Toggle metadata">[◄►]</button>
                            </div>
                            <div id="email-vault-metadata-content" class="flex-1 overflow-y-auto p-4 scrollbar-hidden">
                                <div class="text-[10px] text-[var(--text-dim)] text-center mt-10 italic">WAITING_FOR_DATA...</div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div id="email-vault-footer" class="h-8 border-t-2 border-[var(--panel-light)] bg-[var(--panel-dark)] flex items-center px-4 text-[10px] reveal-node">
                        <span class="text-[var(--text-dim)] mr-2">CPU_LOAD:</span>
                        <div class="w-16 h-2 bg-[var(--panel-light)] mr-4"><div class="bg-[var(--accent)] h-full" style="width: 42%"></div></div>
                        <span class="ml-auto animate-pulse">EMAIL-VAULT_ACTIVE</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(emailVaultDiv);
    }

    function initEmailVaultApp() {
        injectEmailVaultWindow();
        window.injectEmailVaultWindow = injectEmailVaultWindow;
    }

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmailVaultApp);
    } else {
        initEmailVaultApp();
    }
})();
