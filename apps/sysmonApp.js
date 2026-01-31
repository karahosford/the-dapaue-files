// sysmonApp.js
// Handles logic and markup for the SYSMON dashboard window

function injectSysmonWindow() {
    if (document.getElementById('sysmon-window')) return; // Prevent duplicate
    const container = document.body;
    const sysmonDiv = document.createElement('div');
    sysmonDiv.id = 'sysmon-window';
    sysmonDiv.className = 'window';
    sysmonDiv.style.width = '600px';
    sysmonDiv.style.maxWidth = '600px';
    sysmonDiv.style.height = '600px';
    sysmonDiv.style.left = '15%';
    sysmonDiv.style.top = '10%';
    sysmonDiv.style.display = 'block'; // Ensure window is visible
    sysmonDiv.innerHTML = `
        <div class="window-resize-handle"></div>
        <div class="window-titlebar" onmousedown="startDrag(event, 'sysmon-window')" ontouchstart="startDrag(event, 'sysmon-window')">
            <span class="window-title">SYSTEM_MONITOR // DAPAUE_OS_V4.5</span>
            <div class="window-controls">
                <div class="window-btn" onclick="minimizeWindow('sysmon-window')">_</div>
                <div class="window-btn" onclick="toggleWindowFullscreen('sysmon-window')" title="Fullscreen">□</div>
                <div class="window-btn" onclick="closeWindow('sysmon-window')">X</div>
            </div>
        </div>
        <div class="window-content" style="height: calc(100% - 36px); overflow: auto; box-sizing: border-box; border-bottom: 2px solid var(--panel-light);">
            <div style="min-width: 0; min-height: 0; width: 100%; height: 100%; background: var(--bg-dark); padding: 24px; box-sizing: border-box; overflow: auto; font-size: 10px; font-family: monospace;">
                <div class="border-2 border-[var(--panel-light)] p-4 mb-4 bg-[var(--panel-dark)]">
                    <div class="text-xs font-bold mb-3 text-[var(--accent)]">[ SYSTEM INFORMATION ]</div>
                    <div class="grid grid-cols-2 gap-2 text-[9px]">
                        <div><span class="text-[var(--text-dim)]">HOST:</span> NEURAL-LINK-4.5</div>
                        <div><span class="text-[var(--text-dim)]">KERNEL:</span> DAPAUE-KERNEL 0.82</div>
                        <div><span class="text-[var(--text-dim)]">UPTIME:</span> <span id="sysmon-uptime">847d 14h 32m</span></div>
                        <div><span class="text-[var(--text-dim)]">CPU:</span> OMNI-RECURSIVE-9 @ 133MHz</div>
                    </div>
                </div>
                <div class="border border-[var(--panel-light)] p-3 mb-3">
                    <div class="text-[var(--accent)] font-bold mb-2">HISTORICAL METRICS (60s)</div>
                    <div style="overflow-x: auto;">
                        <canvas id="sysmon-graph" width="560" height="120" style="background: var(--panel-dark); max-width: 100%; display: block;"></canvas>
                    </div>
                    <div class="flex gap-4 mt-2 text-[8px]">
                        <div class="flex items-center gap-1"><div class="w-3 h-1 bg-blue-500"></div> CPU</div>
                        <div class="flex items-center gap-1"><div class="w-3 h-1 bg-green-500"></div> RAM</div>
                        <div class="flex items-center gap-1"><div class="w-3 h-1 bg-yellow-500"></div> NETWORK</div>
                    </div>
                </div>
                <div class="border border-[var(--panel-light)] p-3 mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[var(--accent)] font-bold">CPU USAGE</span>
                        <span id="sysmon-cpu-val" class="text-sm font-bold">45%</span>
                    </div>
                    <div class="h-2 bg-[var(--panel-dark)] mb-2" style="overflow: hidden;">
                        <div id="sysmon-cpu-bar" class="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500" style="width: 45%"></div>
                    </div>
                    <div class="text-[8px] text-[var(--text-dim)]">TEMP: <span id="sysmon-cpu-temp">52°C</span> | LOAD: <span id="sysmon-cpu-load">0.68</span></div>
                </div>
                <div class="border border-[var(--panel-light)] p-3 mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[var(--accent)] font-bold">MEMORY USAGE</span>
                        <span id="sysmon-ram-val" class="text-sm font-bold">62%</span>
                    </div>
                    <div class="h-2 bg-[var(--panel-dark)] mb-2" style="overflow: hidden;">
                        <div id="sysmon-ram-bar" class="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500" style="width: 62%"></div>
                    </div>
                    <div class="text-[8px] text-[var(--text-dim)]">TOTAL: 64512 MB | USED: <span id="sysmon-ram-used">40000</span> MB</div>
                </div>
                <div class="border border-[var(--panel-light)] p-3 mb-3">
                    <div class="text-[var(--accent)] font-bold mb-2">NETWORK ACTIVITY</div>
                    <div class="flex gap-4 text-[9px]">
                        <div class="flex-1">
                            <div class="text-[var(--text-dim)] mb-1">TX (UPLOAD)</div>
                            <div class="h-1 bg-[var(--panel-dark)] mb-1" style="overflow: hidden;">
                                <div id="sysmon-net-tx-bar" class="h-full bg-blue-500 transition-all duration-300" style="width: 40%"></div>
                            </div>
                            <span id="sysmon-net-tx" class="font-bold">1250</span> Kbps
                        </div>
                        <div class="flex-1">
                            <div class="text-[var(--text-dim)] mb-1">RX (DOWNLOAD)</div>
                            <div class="h-1 bg-[var(--panel-dark)] mb-1" style="overflow: hidden;">
                                <div id="sysmon-net-rx-bar" class="h-full bg-green-500 transition-all duration-300" style="width: 60%"></div>
                            </div>
                            <span id="sysmon-net-rx" class="font-bold">1850</span> Kbps
                        </div>
                    </div>
                </div>
                <div class="border border-[var(--panel-light)] p-3">
                    <div class="text-[var(--accent)] font-bold mb-3">SERVER STATUS</div>
                    <div id="sysmon-servers" class="space-y-2 text-[9px]">
                        <!-- Servers will be populated by JS -->
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(sysmonDiv);
}

// Expose globally for integration
window.injectSysmonWindow = injectSysmonWindow;
