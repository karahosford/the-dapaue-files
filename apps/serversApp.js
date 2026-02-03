(function() {
    function injectServersWindow() {
        if (document.getElementById('servers-window-injected')) return;
        
        const container = document.createElement('div');
        container.id = 'servers-window-injected';
        container.innerHTML = `
        <div id="server-monitor-window" class="window" style="width: 800px; height: 520px; left: 20%; top: 12%;">
            <div class="window-resize-handle"></div>
            <div class="window-titlebar" onmousedown="startDrag(event, 'server-monitor-window')" ontouchstart="startDrag(event, 'server-monitor-window')">
                <span class="window-title">SERVER_MONITOR // REMOTE_NODES</span>
                <div class="window-controls">
                    <div class="window-btn" onclick="minimizeWindow('server-monitor-window')">_</div>
                    <div class="window-btn" onclick="toggleWindowFullscreen('server-monitor-window')" title="Fullscreen">□</div>
                    <div class="window-btn" onclick="closeWindow('server-monitor-window')">X</div>
                </div>
            </div>
            <div class="window-content">
                <div class="w-full h-full bg-[var(--bg-dark)] flex">
                    <!-- Server List -->
                    <div class="w-64 border-r-2 border-[var(--panel-light)] p-3 overflow-y-auto">
                        <div class="text-[var(--accent)] font-bold mb-2 text-xs">REMOTE NODES</div>
                        <div id="server-list" class="space-y-2 text-[10px]"></div>
                    </div>

                    <!-- Server Detail / Auth -->
                    <div class="flex-1 p-4 flex flex-col gap-3">
                        <div class="border-2 border-[var(--panel-light)] p-3 bg-[var(--panel-dark)]">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-[var(--accent)] font-bold text-xs">NODE DETAIL</div>
                                    <div id="server-detail-name" class="text-sm font-bold mt-1">---</div>
                                </div>
                                <div class="text-right text-[9px]">
                                    <div>Status: <span id="server-detail-status">N/A</span></div>
                                    <div>Latency: <span id="server-detail-latency">--</span> ms</div>
                                    <div>Load: <span id="server-detail-load">--</span>%</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-3 mt-3 text-[9px]">
                                <div class="border border-[var(--panel-light)] p-2">TEMP: <span id="server-detail-temp">--</span>°C</div>
                                <div class="border border-[var(--panel-light)] p-2">PACKET_LOSS: <span id="server-detail-loss">--</span>%</div>
                                <div class="border border-[var(--panel-light)] p-2">UPTIME: <span id="server-detail-uptime">--</span></div>
                            </div>
                            <div class="mt-3 flex items-center gap-3">
                                <button class="btn-retro px-3 py-2 text-[10px]" onclick="setActiveServer()">[SELECT_NODE]</button>
                                <span id="active-server-badge" class="text-[9px] text-[var(--text-dim)]"></span>
                            </div>
                        </div>

                        <div class="border-2 border-[var(--panel-light)] p-3 bg-[var(--panel-dark)]">
                            <div class="text-[var(--accent)] font-bold text-xs mb-2">AUTHENTICATION</div>
                            <div class="grid grid-cols-3 gap-3 text-[10px]">
                                <div>
                                    <div class="text-[8px] text-[var(--text-dim)] mb-1 tracking-widest">USERNAME</div>
                                    <input id="server-auth-username" type="text" class="w-full bg-[var(--panel-dark)] border border-[var(--panel-light)] p-2 text-xs text-white outline-none font-mono">
                                </div>
                                <div>
                                    <div class="text-[8px] text-[var(--text-dim)] mb-1 tracking-widest">ACCESS_KEY</div>
                                    <input id="server-auth-password" type="password" class="w-full bg-[var(--panel-dark)] border border-[var(--panel-light)] p-2 text-xs text-white outline-none font-mono">
                                </div>
                                <div class="flex items-end">
                                    <button class="btn-retro w-full p-2 text-[10px]" onclick="authenticateServerForNode()">[AUTHENTICATE]</button>
                                </div>
                            </div>
                            <div id="server-auth-status" class="mt-2 text-[9px] text-[var(--text-dim)]">Provide valid credentials to unlock data for the selected node.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.appendChild(container);
    }

    function initServersApp() {
        injectServersWindow();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServersApp);
    } else {
        initServersApp();
    }
})();
