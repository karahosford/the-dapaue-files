// sysmonApp.js
// Handles logic and markup for the SYSMON dashboard window

(function () {
    const SYSMON_WINDOW_ID = 'sysmon-window';

    function injectSysmonWindow() {
        if (document.getElementById(SYSMON_WINDOW_ID)) return;
        const container = document.body;
        const sysmonDiv = document.createElement('div');
        sysmonDiv.id = SYSMON_WINDOW_ID;
        sysmonDiv.className = 'window';
        sysmonDiv.style.width = '650px';
        sysmonDiv.style.height = '600px';
        sysmonDiv.style.left = '15%';
        sysmonDiv.style.top = '10%';
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
            <div class="window-content" style="height: calc(100% - 36px); overflow-y: auto; box-sizing: border-box; background: var(--bg-dark); padding: 16px; font-size: 10px; font-family: monospace;">
                <div style="border: 2px solid var(--panel-light); padding: 12px; margin-bottom: 12px; background: var(--panel-dark);">
                    <div style="color: var(--accent); font-weight: bold; margin-bottom: 8px; font-size: 11px;">[ SYSTEM INFORMATION ]</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9px;">
                        <div><span style="color: var(--text-dim);">HOST:</span> NEURAL-LINK-4.5</div>
                        <div><span style="color: var(--text-dim);">KERNEL:</span> DAPAUE-KERNEL 0.82</div>
                        <div><span style="color: var(--text-dim);">UPTIME:</span> <span id="sysmon-uptime">847d 14h 32m</span></div>
                        <div><span style="color: var(--text-dim);">CPU:</span> OMNI-RECURSIVE-9 @ 133MHz</div>
                    </div>
                </div>
                <div style="border: 1px solid var(--panel-light); padding: 12px; margin-bottom: 12px; background: var(--panel-dark);">
                    <div style="color: var(--accent); font-weight: bold; margin-bottom: 8px;">HISTORICAL METRICS (60s)</div>
                    <div style="overflow-x: auto; margin-bottom: 8px;">
                        <canvas id="sysmon-graph" width="600" height="100" style="background: var(--bg-dark); display: block; border: 1px solid var(--panel-light);"></canvas>
                    </div>
                    <div style="display: flex; gap: 16px; font-size: 8px;">
                        <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 2px; background: #3b82f6;"></div> CPU</div>
                        <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 2px; background: #10b981;"></div> RAM</div>
                        <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 2px; background: #f59e0b;"></div> NETWORK</div>
                    </div>
                </div>
                <div style="border: 1px solid var(--panel-light); padding: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: var(--accent); font-weight: bold;">CPU USAGE</span>
                        <span id="sysmon-cpu-val" style="font-weight: bold;">45%</span>
                    </div>
                    <div style="height: 8px; background: var(--panel-dark); margin-bottom: 8px; overflow: hidden; border: 1px solid var(--panel-light);">
                        <div id="sysmon-cpu-bar" style="height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.5s ease; width: 45%;"></div>
                    </div>
                    <div style="font-size: 8px; color: var(--text-dim);">TEMP: <span id="sysmon-cpu-temp">52°C</span> | LOAD: <span id="sysmon-cpu-load">0.68</span></div>
                </div>
                <div style="border: 1px solid var(--panel-light); padding: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: var(--accent); font-weight: bold;">MEMORY USAGE</span>
                        <span id="sysmon-ram-val" style="font-weight: bold;">62%</span>
                    </div>
                    <div style="height: 8px; background: var(--panel-dark); margin-bottom: 8px; overflow: hidden; border: 1px solid var(--panel-light);">
                        <div id="sysmon-ram-bar" style="height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.5s ease; width: 62%;"></div>
                    </div>
                    <div style="font-size: 8px; color: var(--text-dim);">TOTAL: 64512 MB | USED: <span id="sysmon-ram-used">40000</span> MB</div>
                </div>
                <div style="border: 1px solid var(--panel-light); padding: 12px; margin-bottom: 12px;">
                    <div style="color: var(--accent); font-weight: bold; margin-bottom: 8px;">NETWORK ACTIVITY</div>
                    <div style="display: flex; gap: 16px; font-size: 9px;">
                        <div style="flex: 1;">
                            <div style="color: var(--text-dim); margin-bottom: 4px; font-size: 8px;">TX (UPLOAD)</div>
                            <div style="height: 6px; background: var(--panel-dark); margin-bottom: 4px; overflow: hidden; border: 1px solid var(--panel-light);">
                                <div id="sysmon-net-tx-bar" style="height: 100%; background: #3b82f6; transition: width 0.3s ease; width: 40%;"></div>
                            </div>
                            <span id="sysmon-net-tx" style="font-weight: bold; font-size: 8px;">1250</span> Kbps
                        </div>
                        <div style="flex: 1;">
                            <div style="color: var(--text-dim); margin-bottom: 4px; font-size: 8px;">RX (DOWNLOAD)</div>
                            <div style="height: 6px; background: var(--panel-dark); margin-bottom: 4px; overflow: hidden; border: 1px solid var(--panel-light);">
                                <div id="sysmon-net-rx-bar" style="height: 100%; background: #10b981; transition: width 0.3s ease; width: 60%;"></div>
                            </div>
                            <span id="sysmon-net-rx" style="font-weight: bold; font-size: 8px;">1850</span> Kbps
                        </div>
                    </div>
                </div>
                <div style="border: 1px solid var(--panel-light); padding: 12px;">
                    <div style="color: var(--accent); font-weight: bold; margin-bottom: 8px;">SERVER STATUS</div>
                    <div id="sysmon-servers" style="font-size: 9px; line-height: 1.6;">
                        <!-- Servers will be populated by JS -->
                    </div>
                </div>
            </div>
        `;
        container.appendChild(sysmonDiv);
    }

    function initSysmonApp() {
        window.injectSysmonWindow = injectSysmonWindow;
    }

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSysmonApp);
    } else {
        initSysmonApp();
    }
})();
