// slackApp.js
// Standalone Slack-style messaging window with staff chat mirroring

(function () {
    const SLACK_WINDOW_ID = 'slack-window';

    function injectSlackWindow() {
        if (document.getElementById(SLACK_WINDOW_ID)) return;
        const container = document.body;
        const slackDiv = document.createElement('div');
        slackDiv.id = SLACK_WINDOW_ID;
        slackDiv.className = 'window';
        slackDiv.style.width = '700px';
        slackDiv.style.height = '680px';
        slackDiv.style.left = '28%';
        slackDiv.style.top = '10%';
        slackDiv.style.display = 'none';
        slackDiv.innerHTML = `
            <div class="window-resize-handle"></div>
            <div class="window-titlebar" onmousedown="startDrag(event, 'slack-window')" ontouchstart="startDrag(event, 'slack-window')">
                <span class="window-title">SLACK_COMMS // MESSAGE_CENTER</span>
                <div class="window-controls">
                    <div class="window-btn" onclick="minimizeWindow('slack-window')">_</div>
                    <div class="window-btn" onclick="toggleWindowFullscreen('slack-window')" title="Fullscreen">□</div>
                    <div class="window-btn" onclick="closeWindow('slack-window')">X</div>
                </div>
            </div>
            <div class="window-content" style="height: calc(100% - 36px); background: var(--bg-dark); display: flex; flex-direction: row; border: none;">
                <div id="slack-sidebar" style="width: 200px; background: var(--panel-dark); border-right: 2px solid var(--panel-light); display: flex; flex-direction: column;">
                    <div style="padding: 10px; border-bottom: 1px solid var(--panel-light); font-size: 10px; color: var(--text-dim);">
                        CONTACTS
                    </div>
                    <div id="slack-chat-list" style="flex: 1; overflow-y: auto; padding: 6px;"></div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; background: var(--bg-dark);">
                    <div id="slack-chat-header" style="padding: 10px 12px; border-bottom: 1px solid var(--panel-light); font-size: 10px; color: var(--text-dim);">
                        SELECT A CHAT
                    </div>
                    <div style="flex: 1; overflow-y: auto; padding: 16px; background: var(--bg-dark);">
                        <div id="slack-messages" class="space-y-4">
                            <div class="text-[var(--text-dim)] text-[10px] italic text-center py-8">
                                Waiting for messages...
                            </div>
                        </div>
                    </div>
                    <div style="padding: 12px; background: var(--panel-dark); border-top: 1px solid var(--panel-light);">
                        <input id="slack-input" type="text" placeholder="Send a message..." style="width: 100%; background: var(--panel-dark); border: 1px solid var(--panel-light); color: var(--text-main); padding: 8px 12px; font-size: 10px; font-family: monospace; outline: none;" onkeypress="if(event.key==='Enter') sendSlackMessage()">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(slackDiv);
    }

    function openSlackComms() {
        injectSlackWindow();
        if (window.openWindow) {
            window.openWindow(SLACK_WINDOW_ID);
        } else {
            const win = document.getElementById(SLACK_WINDOW_ID);
            if (win) win.style.display = 'flex';
        }
    }

    function getSenderColor(sender) {
        const colors = {
            'KIB': '#ff8c42',
            'C. Hall (IT)': '#10b981',
            'SYSTEM': '#808080',
            'YOU': '#3b82f6',
        };
        
        // Try local colors first
        if (colors[sender]) return colors[sender];
        
        // Try global STAFF_COLORS if available
        if (window.STAFF_COLORS && window.STAFF_COLORS[sender]) {
            return window.STAFF_COLORS[sender];
        }
        
        // Default to blue
        return '#3b82f6';
    }

    function renderSlackMessages() {
        const messagesContainer = document.getElementById('slack-messages');
        const header = document.getElementById('slack-chat-header');
        if (!messagesContainer) return;

        const state = window.slackState;
        if (!state || !state.activeChatId || !state.chats[state.activeChatId]) {
            if (header) header.textContent = 'SELECT A CHAT';
            messagesContainer.innerHTML = '<div class="text-[var(--text-dim)] text-[10px] italic text-center py-8">Select a chat to view messages.</div>';
            return;
        }

        const activeChat = state.chats[state.activeChatId];
        if (header) header.textContent = activeChat.name || state.activeChatId;

        const messages = activeChat.messages || [];
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="text-[var(--text-dim)] text-[10px] italic text-center py-8">No messages yet.</div>';
            return;
        }

        messagesContainer.innerHTML = messages.map((msg) => {
            const senderColor = getSenderColor(msg.sender);
            const hexToRgba = (hex, alpha) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };
            const bgColor = hexToRgba(senderColor, 0.08);
            const borderColor = hexToRgba(senderColor, 0.3);

            return `
                <div class="border border-l-2 p-3 rounded text-[9px]" style="border-left-color: ${senderColor}; border-color: ${borderColor}; background-color: ${bgColor};">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold" style="color: ${senderColor};">${msg.sender}</span>
                        <span class="text-[var(--text-dim)] text-[8px]">${msg.timestamp}</span>
                    </div>
                    <div class="text-[var(--text-main)] leading-relaxed">${msg.message}</div>
                </div>
            `;
        }).join('');

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function ensureChat(chatId, name) {
        if (!window.slackState) {
            window.slackState = { chats: {}, chatOrder: [], activeChatId: null };
        }
        if (!window.slackState.chats[chatId]) {
            window.slackState.chats[chatId] = { id: chatId, name: name || chatId, messages: [] };
            window.slackState.chatOrder.unshift(chatId);
        } else if (name && window.slackState.chats[chatId].name !== name) {
            window.slackState.chats[chatId].name = name;
        }
        return window.slackState.chats[chatId];
    }

    function setActiveChat(chatId) {
        window.slackState.activeChatId = chatId;
        renderChatList();
        renderSlackMessages();
    }

    function addSlackMessage(sender, message, isSystem = false, chatId) {
        const resolvedChatId = chatId || sender || 'general';
        const chat = ensureChat(resolvedChatId, resolvedChatId);
        const msgObj = {
            sender: sender,
            message: message,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            isSystem: isSystem
        };
        chat.messages.push(msgObj);
        if (!window.slackState.activeChatId) {
            window.slackState.activeChatId = resolvedChatId;
        }
        renderChatList();
        renderSlackMessages();
    }

    function renderChatList() {
        const list = document.getElementById('slack-chat-list');
        if (!list || !window.slackState) return;

        const { chats, chatOrder, activeChatId } = window.slackState;
        if (chatOrder.length === 0) {
            list.innerHTML = '<div style="color: var(--text-dim); font-size: 9px; padding: 8px;">No chats yet.</div>';
            return;
        }

        list.innerHTML = chatOrder.map((chatId) => {
            const chat = chats[chatId];
            if (!chat) return '';
            const last = chat.messages[chat.messages.length - 1];
            const preview = last ? (last.message || '').replace(/<[^>]*>/g, '').slice(0, 28) : 'No messages';
            const isActive = chatId === activeChatId;
            return `
                <button onclick="setActiveChat('${chatId}')" style="width: 100%; text-align: left; padding: 6px 8px; margin-bottom: 4px; border: 1px solid ${isActive ? 'var(--accent)' : 'var(--panel-light)'}; background: ${isActive ? 'rgba(255,255,255,0.05)' : 'transparent'}; color: var(--text-main); font-size: 9px;">
                    <div style="font-weight: bold; color: var(--accent);">${chat.name}</div>
                    <div style="color: var(--text-dim); font-size: 8px;">${preview}</div>
                </button>
            `;
        }).join('');
    }

    function sendSlackMessage() {
        const input = document.getElementById('slack-input');
        if (!input || !input.value.trim()) return;
        const message = input.value.trim();
        const chatId = (window.slackState && window.slackState.activeChatId) ? window.slackState.activeChatId : 'general';
        addSlackMessage('YOU', message, false, chatId);
        input.value = '';
    }

    function hookStaffChatNotifications() {
        if (typeof window.showStaffChatNotification !== 'function') return false;
        if (window.showStaffChatNotification.__slackHooked) return true;

        const original = window.showStaffChatNotification;
        window.showStaffChatNotification = function (messageObj) {
            try {
                addSlackMessage(messageObj.sender || 'SYSTEM', messageObj.message || '', false, messageObj.sender || 'SYSTEM');
            } catch (e) {
                // ignore
            }
            return original.apply(this, arguments);
        };
        window.showStaffChatNotification.__slackHooked = true;
        return true;
    }

    function hookStaffChatResponses() {
        if (typeof window.handleStaffChatResponse !== 'function') return false;
        if (window.handleStaffChatResponse.__slackHooked) return true;

        const original = window.handleStaffChatResponse;
        window.handleStaffChatResponse = function (btn, which) {
            try {
                const notif = btn.closest('.system-notification');
                if (notif) {
                    const sender = notif.dataset.sender || 'SYSTEM';
                    const response = which === 'A' ? notif.dataset.responseA : notif.dataset.responseB;
                    const chosenText = (btn && btn.textContent) ? btn.textContent.trim() : 'RESPONSE';
                    addSlackMessage('YOU', chosenText, false, sender);
                    if (response) addSlackMessage(sender, response, false, sender);
                }
            } catch (e) {
                // ignore
            }
            return original.apply(this, arguments);
        };
        window.handleStaffChatResponse.__slackHooked = true;
        return true;
    }

    async function loadSlackChats() {
        try {
            const res = await fetch('assets/data/slack_chats.json');
            if (!res.ok) return;
            const data = await res.json();
            if (!data || !Array.isArray(data.chats)) return;
            data.chats.forEach((chat) => {
                const chatId = chat.id || chat.name;
                if (!chatId) return;
                ensureChat(chatId, chat.name || chatId);
                const target = window.slackState.chats[chatId];
                (chat.messages || []).forEach((msg) => {
                    target.messages.push({
                        sender: msg.sender || 'SYSTEM',
                        message: msg.message || '',
                        timestamp: msg.timestamp || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                        isSystem: !!msg.isSystem
                    });
                });
            });
            if (!window.slackState.activeChatId && window.slackState.chatOrder.length > 0) {
                window.slackState.activeChatId = window.slackState.chatOrder[0];
            }
            renderChatList();
            renderSlackMessages();
        } catch (e) {
            // ignore
        }
    }

    function initSlackApp() {
        window.slackState = window.slackState || { chats: {}, chatOrder: [], activeChatId: null };
        window.injectSlackWindow = injectSlackWindow;
        window.openSlackComms = openSlackComms;
        window.addSlackMessage = addSlackMessage;
        window.sendSlackMessage = sendSlackMessage;
        window.setActiveChat = setActiveChat;

        loadSlackChats();

        let attempts = 0;
        const maxAttempts = 50;
        const interval = setInterval(() => {
            attempts += 1;
            const okNotif = hookStaffChatNotifications();
            const okResp = hookStaffChatResponses();
            if ((okNotif && okResp) || attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlackApp);
    } else {
        initSlackApp();
    }
})();
