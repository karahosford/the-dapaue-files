
// Injects the BRIEFING window markup into the DOM
function injectBriefingWindow() {
    if (document.getElementById('briefing-window')) return; // Prevent duplicate
    const container = document.body;
    const briefingDiv = document.createElement('div');
    briefingDiv.id = 'briefing-window';
    briefingDiv.className = 'window';
    briefingDiv.style.width = '650px';
    briefingDiv.style.height = '550px';
    briefingDiv.style.left = '20%';
    briefingDiv.style.top = '15%';
    briefingDiv.innerHTML = `
        <div class="window-resize-handle"></div>
        <div class="window-titlebar" onmousedown="startDrag(event, 'briefing-window')" ontouchstart="startDrag(event, 'briefing-window')">
            <span class="window-title">MISSION_BRIEFING.DOC // CLASSIFIED</span>
            <div class="window-controls">
                <div class="window-btn" onclick="minimizeWindow('briefing-window')">_</div>
                <div class="window-btn" onclick="toggleWindowFullscreen('briefing-window')" title="Fullscreen">□</div>
                <div class="window-btn" onclick="closeWindow('briefing-window')">X</div>
            </div>
        </div>
        <div class="window-content">
            <div class="w-full h-full bg-[var(--bg-dark)] text-[var(--text-main)] p-6 font-mono text-xs overflow-y-auto leading-relaxed">
                <div class="border-b-2 border-[var(--panel-light)] pb-3 mb-4">
                    <div class="text-red-500 font-bold text-sm mb-2">⚠ CLASSIFICATION: RESTRICTED ⚠</div>
                    <div class="text-[10px] text-[var(--text-dim)]">
                        <div>FROM: DIRECTOR_OVERSIGHT // DAPAUE_COMMAND</div>
                        <div>TO: INVESTIGATION_UNIT // NEURAL-LINK_OPERATOR</div>
                        <div>DATE: 2099-01-15 08:42:17</div>
                        <div>SUBJECT: ARCHIVE_INVESTIGATION_MANDATE</div>
                    </div>
                </div>
                <div class="space-y-4">
                    <p>INVESTIGATOR,</p>
                    <p>YOU ARE AN INVESTIGATIVE JOURNALIST PURSUING A DANGEROUS STORY. AFTER MONTHS OF INVESTIGATION INTO DAPAUE'S ACTIVITIES, YOU SUCCESSFULLY BREACHED THE EMAIL ACCOUNT OF ONE OF THEIR STAFF MEMBERS. YOU NOW HAVE ACCESS TO THEIR PRIVATE CORRESPONDENCE, FILES, AND COMMUNICATIONS. YOUR MISSION: UNCOVER THE TRUTH ABOUT DAPAUE'S OPERATIONS BY EXPLORING THIS ACCOUNT AND ESCALATING YOUR ACCESS TO HIGHER-LEVEL PERSONNEL.</p>
                    <div class="border-l-2 border-green-500 pl-3 my-4">
                        <div class="text-green-500 font-bold mb-2">INITIAL ACCESS ACQUIRED:</div>
                        <div>YOU HAVE SUCCESSFULLY BREACHED THE ACCOUNT OF: <span class="text-yellow-400" id="briefing-assigned-user">LOADING...</span></div>
                        <div class="text-[9px] text-[var(--text-dim)] mt-1">Their email archive is now accessible. Use the SYSTEM-V terminal to browse their communications and gather evidence about DAPAUE's true operations.</div>
                    </div>
                    <div class="border-l-2 border-yellow-500 pl-3 my-4">
                        <div class="text-yellow-500 font-bold mb-2">INVESTIGATION STRATEGY:</div>
                        <div class="space-y-1">
                            <div>◆ EXAMINE THE BREACHED ACCOUNT'S EMAILS AND FILES</div>
                            <div>◆ IDENTIFY OTHER STAFF MEMBERS AND ESCALATE ACCESS</div>
                            <div>◆ EXPLOIT WEAK CREDENTIALS OR KNOWN PASSWORDS</div>
                            <div>◆ BUILD YOUR EVIDENCE BOARD WITH DISCOVERED INFORMATION</div>
                            <div>◆ CONNECT THE DOTS: WHO KNEW WHAT? WHO'S RESPONSIBLE?</div>
                        </div>
                    </div>
                    <div class="border-l-2 border-orange-500 pl-3 my-4">
                        <div class="text-orange-500 font-bold mb-2">PRIVILEGE LEVEL SYSTEM:</div>
                        <div class="space-y-1">
                            <div>• LEVEL 1 (Operations): Entry-level staff - Basic operational knowledge</div>
                            <div>• LEVEL 2 (Administration): Mid-level management - More sensitive details</div>
                            <div>• LEVEL 3 (Management): Department heads - Access to policy and decisions</div>
                            <div>• LEVEL 4 (Executive): Senior leadership - High-level coordination</div>
                            <div>• LEVEL 5 (Director): Top command - Full knowledge of operations</div>
                        </div>
                        <div class="text-[9px] text-[var(--text-dim)] mt-2">Higher privilege accounts contain more sensitive information. Use TERMINAL command 'list' to find targets at your level.</div>
                    </div>
                    <div class="border-l-2 border-cyan-500 pl-3 my-4">
                        <div class="text-cyan-500 font-bold mb-2">TERMINAL COMMANDS:</div>
                        <div class="space-y-1">
                            <div>• active &lt;username&gt; - Switch to a different user account (requires credentials)</div>
                            <div>• list - Show all users at your current privilege level</div>
                            <div>• info &lt;username&gt; - Display user details and stored information</div>
                            <div>• help - Display full command reference</div>
                        </div>
                    </div>
                    <div class="border-l-2 border-purple-500 pl-3 my-4">
                        <div class="text-purple-500 font-bold mb-2">FORENSICS TOOLS:</div>
                        <div class="space-y-1">
                            <div>• SYSTEM-V: Email archive browser (view emails from breached accounts)</div>
                            <div>• FORENSICS: Digital evidence board displaying extracted information</div>
                            <div>• TAG WRANGLE: Create tags and connections, build your narrative</div>
                            <div>• ADD NOTE: Create manual evidence entries with your own analysis</div>
                            <div>• CONNECTIONS: Link evidence together to expose the conspiracy</div>
                        </div>
                    </div>
                    <p>YOUR EVIDENCE BOARD AUTOMATICALLY POPULATES WITH DATA FROM ACCOUNTS YOU'VE ACCESSED. AS YOU BREACH NEW ACCOUNTS, THEIR COMMUNICATIONS AND FILES BECOME VISIBLE. CREATE YOUR OWN TAGGING SYSTEM TO TRACK PATTERNS, RELATIONSHIPS, AND EVIDENCE OF WRONGDOING.</p>
                    <div class="border-2 border-red-500 p-3 my-4 bg-red-900/10">
                        <div class="text-red-500 font-bold mb-2">⚠ CRITICAL WARNINGS:</div>
                        <div>• Your unauthorized access is traceable and may trigger alarms</div>
                        <div>• Some accounts may have two-factor authentication or security codes</div>
                        <div>• Failed login attempts increase detection risk</div>
                        <div>• The more you breach, the more you learn—but the more danger you're in</div>
                        <div>• Discovery could be fatal to your investigation and yourself</div>
                    </div>
                    <p>THE EVIDENCE IS IN THE EMAILS. BUILD YOUR STORY. EXPOSE THE TRUTH ABOUT DAPAUE.</p>
                    <div class="mt-6 pt-4 border-t border-[var(--panel-light)] text-[var(--text-dim)] text-[10px]">
                        <div>-- YOUR INVESTIGATION BEGINS NOW --</div>
                        <div class="mt-2">[ PROCEED WITH CAUTION ]</div>
                    </div>
            </div>
        </div>
    `;
    container.appendChild(briefingDiv);
}

// Updates the assigned user in the briefing window
function updateBriefingAssignedUser(user) {
    const briefingElement = document.getElementById('briefing-assigned-user');
    if (briefingElement && user) {
        briefingElement.textContent = `${user.name.toUpperCase()} (${user.username})`;
    }
}

// Expose globally for integration
window.injectBriefingWindow = injectBriefingWindow;
window.updateBriefingAssignedUser = updateBriefingAssignedUser;
