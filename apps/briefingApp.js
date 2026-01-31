
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
                    <p>YOU ARE AN INVESTIGATIVE JOURNALIST. AFTER MONTHS OF DIGGING INTO CORPORATE CORRUPTION AND COVER-UPS, YOU SUCCESSFULLY BREACHED THE DAPAUE ARCHIVE SYSTEM. YOUR MISSION: UNCOVER THE FULL SCOPE OF TRUTH HIDDEN ACROSS FIVE PRIVILEGE-TIERED SERVERS AND EXPOSE THE CONSPIRACY AT THE HEART OF THIS ORGANIZATION.</p>
                    <div class="border-l-2 border-green-500 pl-3 my-4">
                        <div class="text-green-500 font-bold mb-2">INITIAL ACCESS ACQUIRED:</div>
                        <div>YOUR HACK GRANTED YOU ACCESS TO A PRIVILEGE LEVEL 1 ACCOUNT. YOU NOW HAVE EMAIL ACCESS AS: <span class="text-yellow-400" id="briefing-assigned-user">LOADING...</span></div>
                        <div class="text-[9px] text-[var(--text-dim)] mt-1">This account is your entry point. Access to SYSTEM-V email archive is now enabled. Use it to gather evidence.</div>
                    </div>
                    <div class="border-l-2 border-yellow-500 pl-3 my-4">
                        <div class="text-yellow-500 font-bold mb-2">INVESTIGATION STRATEGY:</div>
                        <div class="space-y-1">
                            <div>◆ REVIEW EMAILS FROM YOUR ENTRY-POINT PRIVILEGE LEVEL 1 ACCOUNT</div>
                            <div>◆ ESCALATE PRIVILEGES BY ACCESSING HIGHER SERVERS (2-5)</div>
                            <div>◆ EXPLOIT USER ACCOUNTS TO INFILTRATE THEIR EMAIL ARCHIVES</div>
                            <div>◆ COMPILE EVIDENCE ON YOUR INVESTIGATION BOARD</div>
                            <div>◆ IDENTIFY PATTERNS AND CONNECTIONS IN THE DATA</div>
                        </div>
                    </div>
                    <div class="border-l-2 border-orange-500 pl-3 my-4">
                        <div class="text-orange-500 font-bold mb-2">PRIVILEGE LEVEL SYSTEM:</div>
                        <div class="space-y-1">
                            <div>• LEVEL 1 (Operations): 5 users - Basic access tier</div>
                            <div>• LEVEL 2 (Administration): 9 users - Mid-level clearance</div>
                            <div>• LEVEL 3 (Management): 14 users - Departmental oversight</div>
                            <div>• LEVEL 4 (Executive): 6 users - Senior leadership</div>
                            <div>• LEVEL 5 (Director): 2 users - Highest classification</div>
                        </div>
                        <div class="text-[9px] text-[var(--text-dim)] mt-2">Use TERMINAL command 'list' to see users at your current privilege level.</div>
                    </div>
                    <div class="border-l-2 border-cyan-500 pl-3 my-4">
                        <div class="text-cyan-500 font-bold mb-2">TERMINAL COMMANDS:</div>
                        <div class="space-y-1">
                            <div>• active &lt;username&gt; - Switch to another user account for email access</div>
                            <div>• list - Show all users at your current privilege level</div>
                            <div>• info &lt;username&gt; - Display user details and status</div>
                            <div>• help - Display full command reference</div>
                        </div>
                    </div>
                    <div class="border-l-2 border-purple-500 pl-3 my-4">
                        <div class="text-purple-500 font-bold mb-2">FORENSICS TOOLS:</div>
                        <div class="space-y-1">
                            <div>• SYSTEM-V: Email archive browser (restricted to accessed accounts)</div>
                            <div>• FORENSICS: Investigation board with cards auto-created from emails</div>
                            <div>• TAG WRANGLE: Create and manage custom tags, visualize connections</div>
                            <div>• ADD NOTE: Create manual evidence cards with your own observations</div>
                            <div>• CONNECTIONS: Link evidence cards to map relationships</div>
                        </div>
                    </div>
                    <p>YOUR INVESTIGATION BOARD WILL ONLY DISPLAY EVIDENCE FROM ACCOUNTS YOU'VE ACCESSED. AS YOU BRUTEFORCE OR SWITCH TO NEW USERS, THEIR EMAILS WILL AUTOMATICALLY APPEAR AS CARDS. CREATE YOUR OWN TAGGING SYSTEM TO ORGANIZE EVIDENCE AND IDENTIFY PATTERNS.</p>
                    <div class="border-2 border-red-500 p-3 my-4 bg-red-900/10">
                        <div class="text-red-500 font-bold mb-2">⚠ CRITICAL WARNINGS:</div>
                        <div>• You have TWO total bruteforce attempts before detection increases risk</div>
                        <div>• Each breach destabilizes system security; use strategically</div>
                        <div>• Evidence only appears for accounts you've successfully accessed</div>
                        <div>• Higher privilege servers require authentication codes or exploitation</div>
                        <div>• All activity is logged; your presence may be discovered</div>
                    </div>
                    <p>THE TRUTH IS IN THE ARCHIVE. EXPOSE THE CONSPIRACY. YOUR STORY DEPENDS ON IT.</p>
                    <div class="mt-6 pt-4 border-t border-[var(--panel-light)] text-[var(--text-dim)] text-[10px]">
                        <div>DIRECTOR_OVERSIGHT</div>
                        <div>DAPAUE COMMAND // FORENSIC INVESTIGATION DIVISION</div>
                        <div class="mt-2">--- TRANSMISSION ENDED ---</div>
                    </div>
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
