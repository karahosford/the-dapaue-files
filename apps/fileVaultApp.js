// fileVaultApp.js
// Handles the FILE VAULT window with file exploration and forensics integration

(function () {
    const FILE_VAULT_WINDOW_ID = 'file-vault-window';

    function injectFileVaultWindow() {
        if (document.getElementById(FILE_VAULT_WINDOW_ID)) return;
        const container = document.body;
        const fileVaultDiv = document.createElement('div');
        fileVaultDiv.id = FILE_VAULT_WINDOW_ID;
        fileVaultDiv.className = 'window';
        fileVaultDiv.style.width = '90%';
        fileVaultDiv.style.height = '85%';
        fileVaultDiv.style.left = '5%';
        fileVaultDiv.style.top = '5%';
        fileVaultDiv.style.display = 'none';
        fileVaultDiv.innerHTML = `
            <div class="window-resize-handle"></div>
            <div class="window-titlebar" onmousedown="startDrag(event, 'file-vault-window')" ontouchstart="startDrag(event, 'file-vault-window')">
                <span class="window-title" id="file-vault-title">FILES // DAPAUE</span>
                <div class="window-controls">
                    <div class="window-btn" onclick="minimizeWindow('file-vault-window')">_</div>
                    <div class="window-btn" onclick="toggleWindowFullscreen('file-vault-window')" title="Fullscreen">□</div>
                    <div class="window-btn" onclick="closeWindow('file-vault-window')">X</div>
                </div>
            </div>
            <div class="window-content">
                <div id="file-vault-terminal" class="w-full h-full terminal-border bg-[var(--bg-dark)] overflow-hidden flex flex-col relative">
                    <div id="file-vault-login-flash" class="absolute inset-0 z-[600] pointer-events-none"></div>

                    <!-- Header -->
                    <div id="file-vault-header" class="h-12 border-b-2 border-[var(--panel-light)] flex items-center justify-between px-4 bg-[var(--panel-dark)] reveal-node">
                        <div class="flex items-center gap-4">
                            <span class="font-bold">FILES // EXPLORER // DAPAUE</span>
                            <span id="file-vault-user-display" class="text-[9px] text-green-500 border border-green-900/40 px-2 py-0.5 cursor-pointer hover:border-green-500 hover:bg-green-900/20 transition-all" onclick="openFileVaultUserSelector()">USER: ---</span>
                        </div>
                    </div>

                    <div class="flex-1 flex overflow-hidden">
                        <!-- Sidebar -->
                        <div id="file-vault-sidebar" class="w-20 md:w-48 border-r-2 border-[var(--panel-light)] flex flex-col p-2 gap-2 bg-[var(--panel-dark)] reveal-node">
                            <button onclick="toggleFileVaultSidebar()" class="btn-retro p-2 text-xs text-center mb-2 opacity-70 hover:opacity-100" title="Toggle sidebar">[◄►]</button>
                            <button id="file-vault-tab-explorer" class="btn-retro active p-2 text-xs text-left" onclick="switchFileVaultTab('explorer')"><span class="sidebar-label">[01] FILES</span></button>
                        </div>

                        <!-- User List -->
                        <div id="file-vault-list" class="w-64 md:w-80 border-r-2 border-[var(--panel-light)] overflow-y-auto scrollbar-hidden bg-[var(--bg-dark)] opacity-90 reveal-node">
                        </div>

                        <!-- File Preview -->
                        <div id="file-vault-detail" class="flex-1 flex flex-col bg-[var(--bg-dark)] overflow-hidden relative reveal-node">
                            <div id="file-vault-placeholder" class="flex-1 flex items-center justify-center flex-col text-xs tracking-widest opacity-40" style="display: flex;">
                                <p>SELECT FILE TO PREVIEW</p>
                            </div>

                            <div id="file-vault-pane" class="flex-1 flex flex-col overflow-hidden" style="display: none;">
                                <div class="border-b-2 border-[var(--panel-light)] p-4 bg-[var(--panel-dark)]">
                                    <div class="flex items-start justify-between gap-4">
                                        <div>
                                            <div id="file-vault-name" class="font-bold text-sm">---</div>
                                            <div id="file-vault-meta" class="text-[9px] text-[var(--text-dim)] mt-1">---</div>
                                        </div>
                                        <div id="file-vault-user" class="text-[10px] text-[var(--accent)] font-mono"></div>
                                    </div>
                                </div>
                                <div class="p-3 border-b-2 border-[var(--panel-light)] text-[9px] flex items-center gap-2 justify-end">
                                    <button class="btn-retro px-2 py-1 ml-auto" onclick="sendFileVaultToBoard()" title="Add to Investigation Board">📌 [SEND TO BOARD]</button>
                                </div>
                                <div id="file-vault-content" class="flex-1 overflow-y-auto p-6 md:p-10 font-mono text-xs whitespace-pre-wrap break-words"></div>
                            </div>
                        </div>

                        <!-- Metadata Board -->
                        <div id="file-vault-metadata" class="border-l-2 border-[var(--panel-light)] bg-[var(--panel-dark)] flex flex-col reveal-node">
                            <div id="file-vault-metadata-header" class="p-3 border-b-2 border-[var(--panel-light)] bg-[var(--panel-light)] flex justify-between items-center text-[var(--bg-dark)]">
                                <span class="text-xs font-bold uppercase tracking-wider">FILE_METADATA</span>
                                <button onclick="toggleFileVaultMetadata()" class="text-xs cursor-pointer hover:opacity-80 font-bold" title="Toggle metadata">[◄►]</button>
                            </div>
                            <div id="file-vault-metadata-content" class="flex-1 overflow-y-auto p-4 scrollbar-hidden">
                                <div class="text-[10px] text-[var(--text-dim)] text-center mt-10 italic">WAITING_FOR_DATA...</div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div id="file-vault-footer" class="h-8 border-t-2 border-[var(--panel-light)] bg-[var(--panel-dark)] flex items-center px-4 text-[10px] reveal-node">
                        <span class="text-[var(--text-dim)] mr-2">CPU_LOAD:</span>
                        <div class="w-16 h-2 bg-[var(--panel-light)] mr-4"><div class="bg-[var(--accent)] h-full" style="width: 42%"></div></div>
                        <span class="ml-auto animate-pulse">FILES_ACTIVE</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(fileVaultDiv);
    }

    function initFileVaultApp() {
        injectFileVaultWindow();
        window.injectFileVaultWindow = injectFileVaultWindow;
    }

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFileVaultApp);
    } else {
        initFileVaultApp();
    }
})();
