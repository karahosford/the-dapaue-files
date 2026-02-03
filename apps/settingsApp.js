// settingsApp.js
// Handles the SETTINGS window with configuration options

(function () {
    const SETTINGS_WINDOW_ID = 'settings-window';

    function injectSettingsWindow() {
        if (document.getElementById(SETTINGS_WINDOW_ID)) return;
        const container = document.body;
        const settingsDiv = document.createElement('div');
        settingsDiv.id = SETTINGS_WINDOW_ID;
        settingsDiv.className = 'window';
        settingsDiv.style.width = '500px';
        settingsDiv.style.height = '450px';
        settingsDiv.style.left = '30%';
        settingsDiv.style.top = '20%';
        settingsDiv.innerHTML = `
            <div class="window-resize-handle"></div>
            <div class="window-titlebar" onmousedown="startDrag(event, 'settings-window')" ontouchstart="startDrag(event, 'settings-window')">
                <span class="window-title">SYSTEM_SETTINGS // CONFIGURATION</span>
                <div class="window-controls">
                    <div class="window-btn" onclick="minimizeWindow('settings-window')">_</div>
                    <div class="window-btn" onclick="toggleWindowFullscreen('settings-window')" title="Fullscreen">□</div>
                    <div class="window-btn" onclick="closeWindow('settings-window')">X</div>
                </div>
            </div>
            <div class="window-content">
                <div class="w-full h-full bg-[var(--bg-dark)] p-6 overflow-y-auto">
                    <div class="space-y-6">
                        <!-- Display Settings -->
                        <div class="border-b border-[var(--panel-light)] pb-4">
                            <div class="text-xs font-bold text-[var(--accent)] mb-3">DISPLAY</div>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px]">FULLSCREEN MODE</span>
                                    <button onclick="toggleFullscreenSetting()" id="fullscreen-toggle" class="btn-retro px-3 py-1 text-[9px]">[TOGGLE]</button>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px]">INTERFACE ZOOM</span>
                                    <div class="flex gap-2">
                                        <button onclick="adjustZoom(-10)" class="btn-retro px-3 py-1 text-[9px]">[-]</button>
                                        <span id="zoom-display" class="text-[10px] px-2">100%</span>
                                        <button onclick="adjustZoom(10)" class="btn-retro px-3 py-1 text-[9px]">[+]</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- System Settings -->
                        <div class="border-b border-[var(--panel-light)] pb-4">
                            <div class="text-xs font-bold text-[var(--accent)] mb-3">SYSTEM</div>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-[10px]">INSTABILITY EFFECTS</div>
                                        <div class="text-[8px] text-[var(--text-dim)] mt-1">Disable visual glitch effects</div>
                                    </div>
                                    <label class="relative inline-block w-12 h-6">
                                        <input type="checkbox" id="instability-toggle" onchange="toggleInstabilityEffects()" class="opacity-0 w-0 h-0">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Audio Settings -->
                        <div class="border-b border-[var(--panel-light)] pb-4">
                            <div class="text-xs font-bold text-[var(--accent)] mb-3">AUDIO</div>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-[10px]">SOUND EFFECTS</div>
                                        <div class="text-[8px] text-[var(--text-dim)] mt-1">UI click and interaction sounds</div>
                                    </div>
                                    <label class="relative inline-block w-12 h-6">
                                        <input type="checkbox" id="sound-toggle" onchange="toggleSound()" checked class="opacity-0 w-0 h-0">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Developer Options -->
                        <div class="border-b border-[var(--panel-light)] pb-4">
                            <div class="text-xs font-bold text-[var(--accent)] mb-3">DEVELOPER</div>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-[10px]">ADMIN MODE</div>
                                        <div class="text-[8px] text-[var(--text-dim)] mt-1">Unlock all content and accounts</div>
                                    </div>
                                    <button onclick="unlockAllTestContent()" class="btn-retro px-3 py-1 text-[9px]">[ENABLE]</button>
                                </div>
                                <div class="flex items-center justify-between mt-3">
                                    <div>
                                        <div class="text-[10px]">HIDE DESKTOP APPS</div>
                                        <div class="text-[8px] text-[var(--text-dim)] mt-1">Chat Test, Tag Wrangle, Staff Directory</div>
                                    </div>
                                    <label class="relative inline-block w-12 h-6">
                                        <input type="checkbox" id="hide-admin-apps-toggle" onchange="toggleAdminAppsVisibility()" class="opacity-0 w-0 h-0" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-[10px]">RESET SYSTEM</div>
                                        <div class="text-[8px] text-[var(--text-dim)] mt-1">Lock all servers and reset content</div>
                                    </div>
                                    <button onclick="resetTestContent()" class="btn-retro px-3 py-1 text-[9px]" style="border-color: #ef4444; color: #ef4444;">[RESET]</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Info -->
                        <div class="text-[8px] text-[var(--text-dim)] italic">
                            Settings are saved to browser local storage
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(settingsDiv);
    }



    function initSettingsApp() {
        injectSettingsWindow();
        
        // Hide admin apps if setting is enabled
        const hideToggle = document.getElementById('hide-admin-apps-toggle');
        if (hideToggle) {
            hideToggle.checked = true;
            window.toggleAdminAppsVisibility?.();
        }
        
        window.injectSettingsWindow = injectSettingsWindow;
    }

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSettingsApp);
    } else {
        initSettingsApp();
    }
})();
