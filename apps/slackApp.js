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
                <span class="window-title">TAPPER // MESSAGE_CENTER</span>
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
        refreshSlackUI();
    }

    function openTapper() {
        injectSlackWindow();
        if (window.openWindow) {
            window.openWindow(SLACK_WINDOW_ID);
        } else {
            const win = document.getElementById(SLACK_WINDOW_ID);
            if (win) win.style.display = 'flex';
        }
        refreshSlackUI();
        if (window.triggerChatEvents) {
            window.triggerChatEvents('onTapperOpen');
        }
    }

    function refreshSlackUI() {
        renderChatList();
        renderSlackMessages();
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

        messagesContainer.innerHTML = messages.map((msg, idx) => {
            const senderColor = getSenderColor(msg.sender);
            const isPlayer = msg.sender === 'YOU';
            const hexToRgba = (hex, alpha) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };
            const bgColor = hexToRgba(senderColor, 0.08);
            const borderColor = hexToRgba(senderColor, 0.3);

            if (isPlayer) {
                // Player messages: right-aligned, no sender name
                return `
                    <div class="flex justify-end mb-3">
                        <div class="max-w-[70%] border border-r-2 p-3 rounded text-[9px]" style="border-right-color: ${senderColor}; border-color: ${borderColor}; background-color: ${bgColor};">
                            <div class="flex justify-end items-center gap-2 mb-2">
                                <span class="text-[var(--text-dim)] text-[8px]">${msg.timestamp}</span>
                            </div>
                            <div class="text-[var(--text-main)] leading-relaxed">${msg.message}</div>
                        </div>
                    </div>
                `;
            } else {
                // Staff messages: left-aligned with sender name
                const hasOptions = msg.responseOptions && !msg.answered;
                const optionsHtml = hasOptions ? `
                    <div style="display:flex; gap:12px; margin-top:12px; width:100%; justify-content:flex-end; max-width:70%;">
                        <button class="tapper-option btn-retro" data-option="A" data-msg-idx="${idx}" style="flex:0 1 auto; min-width:140px; max-width:70%; border:1px solid #ff8c42; border-right:2px solid #ff8c42; padding:8px 12px; font-size:9px; border-radius:4px; background:rgba(255, 140, 66, 0.08); color:#ff8c42; cursor:pointer;" onmouseover="this.style.background='rgba(255, 140, 66, 0.15)';" onmouseout="this.style.background='rgba(255, 140, 66, 0.08)';" onclick="handleTapperResponse(${idx}, 'A')">[A] ${msg.responseOptions.optionA || 'ACKNOWLEDGE'}</button>
                        <button class="tapper-option btn-retro" data-option="B" data-msg-idx="${idx}" style="flex:0 1 auto; min-width:140px; max-width:70%; border:1px solid #ff8c42; border-right:2px solid #ff8c42; padding:8px 12px; font-size:9px; border-radius:4px; background:rgba(255, 140, 66, 0.08); color:#ff8c42; cursor:pointer;" onmouseover="this.style.background='rgba(255, 140, 66, 0.15)';" onmouseout="this.style.background='rgba(255, 140, 66, 0.08)';" onclick="handleTapperResponse(${idx}, 'B')">[B] ${msg.responseOptions.optionB || 'DISMISS'}</button>
                    </div>
                ` : '';
                
                return `
                    <div class="flex justify-start mb-3 flex-col" style="align-items:flex-start;">
                        <div class="max-w-[70%] border border-l-2 p-3 rounded text-[9px]" style="border-left-color: ${senderColor}; border-color: ${borderColor}; background-color: ${bgColor};">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-bold" style="color: ${senderColor};">${msg.sender}</span>
                                <span class="text-[var(--text-dim)] text-[8px]">${msg.timestamp}</span>
                            </div>
                            <div class="text-[var(--text-main)] leading-relaxed">${msg.message}</div>
                        </div>
                        ${optionsHtml}
                    </div>
                `;
            }
        }).join('');

        // Scroll to bottom to show latest messages
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 0);
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
        
        // Close any notifications for this chat sender
        const container = document.getElementById('notification-container');
        if (container) {
            const notifications = container.querySelectorAll('.system-notification[data-persistent="true"]');
            notifications.forEach(notif => {
                // Check if this notification is for the active chat
                if (notif.dataset.sender === chatId) {
                    window.closeNotification(notif);
                }
            });
        }
    }

    function addSlackMessage(sender, message, isSystem = false, chatId, responseOptions = null) {
        const resolvedChatId = chatId || sender || 'general';
        const chat = ensureChat(resolvedChatId, resolvedChatId);
        const msgObj = {
            sender: sender,
            message: message,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            isSystem: isSystem,
            responseOptions: responseOptions  // { optionA, optionB, responseA, responseB }
        };
        
        // Deduplicate: check if the last message is identical (same sender, message, within 2 seconds)
        const lastMsg = chat.messages[chat.messages.length - 1];
        if (lastMsg && lastMsg.sender === msgObj.sender && lastMsg.message === msgObj.message) {
            const lastTime = lastMsg.timestamp;
            const currentTime = msgObj.timestamp;
            // If timestamps are the same (within same minute), skip duplicate
            if (lastTime === currentTime) {
                return;
            }
        }
        
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

    function handleTapperResponse(messageIndex, which) {
        const state = window.slackState;
        if (!state || !state.activeChatId || !state.chats[state.activeChatId]) return;
        
        const chat = state.chats[state.activeChatId];
        const msg = chat.messages[messageIndex];
        if (!msg || !msg.responseOptions || msg.answered) return;
        
        const options = msg.responseOptions;
        const chosenText = which === 'A' ? options.optionA : options.optionB;
        const response = which === 'A' ? options.responseA : options.responseB;
        
        // Find and disable buttons, apply animations
        const buttonContainer = document.querySelector(`[data-msg-idx="${messageIndex}"]`);
        if (buttonContainer) {
            const parentDiv = buttonContainer.parentElement;
            const buttons = parentDiv.querySelectorAll('.tapper-option');
            
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.style.pointerEvents = 'none';
                
                if (btn.dataset.option === which) {
                    // Chosen option: slide right
                    btn.style.animation = 'slideRightOption 0.5s ease-out forwards';
                } else {
                    // Unchosen option: fade out
                    btn.style.animation = 'fadeOutOption 0.5s ease-out forwards';
                }
            });
        }
        
        // Wait for animation, then add messages
        setTimeout(() => {
            // Special effect: If Kib and Ignore (option B) is chosen, rain 😾 for 10s
            if (msg.sender === 'KIB' && which === 'B') {
                rainAngryCatEmoji();
            }
            
            function rainAngryCatEmoji() {
                const emoji = '😾';
                const duration = 10000;
                const container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.left = '0';
                container.style.top = '0';
                container.style.width = '100vw';
                container.style.height = '100vh';
                container.style.pointerEvents = 'none';
                container.style.zIndex = '99999';
                document.body.appendChild(container);
                let running = true;
                function spawnOne() {
                    if (!running) return;
                    const span = document.createElement('span');
                    span.textContent = emoji;
                    span.style.position = 'absolute';
                    span.style.left = Math.random() * 98 + 'vw';
                    span.style.top = '-2em';
                    span.style.fontSize = (Math.random() * 32 + 32) + 'px';
                    span.style.opacity = '0.92';
                    span.style.transition = 'transform 2.2s linear, opacity 0.7s linear';
                    container.appendChild(span);
                    setTimeout(() => {
                        span.style.transform = `translateY(${window.innerHeight + 80}px)`;
                        span.style.opacity = '0.7';
                    }, 10);
                    setTimeout(() => {
                        span.remove();
                    }, 2400);
                }
                let interval = setInterval(() => {
                    for (let i = 0; i < 4; ++i) spawnOne();
                }, 120);
                setTimeout(() => {
                    running = false;
                    clearInterval(interval);
                    setTimeout(() => container.remove(), 2000);
                }, duration);
            }
            
            // Add player response
            addSlackMessage('YOU', chosenText, false, state.activeChatId);
            
            // Add staff response if provided with delay
            if (response) {
                setTimeout(() => {
                    addSlackMessage(msg.sender, response, false, state.activeChatId);
                }, 1500);
            }
            
            // Mark message as answered
            msg.answered = true;
            renderSlackMessages();
        }, 500);
    }

    function hookStaffChatNotifications() {
        if (typeof window.showStaffChatNotification !== 'function') return false;
        if (window.showStaffChatNotification.__slackHooked) return true;

        const original = window.showStaffChatNotification;
        window.showStaffChatNotification = function (messageObj) {
            try {
                // Only add to TAPPER if this isn't already flagged as coming from TAPPER
                if (!messageObj.__fromTapper) {
                    const responseOptions = (messageObj.optionA || messageObj.optionB) ? {
                        optionA: messageObj.optionA || 'ACKNOWLEDGE',
                        optionB: messageObj.optionB || 'DISMISS',
                        responseA: messageObj.responseA || '',
                        responseB: messageObj.responseB || ''
                    } : null;
                    addSlackMessage(messageObj.sender || 'SYSTEM', messageObj.message || '', false, messageObj.sender || 'SYSTEM', responseOptions);
                }
            } catch (e) {
                // ignore
            }
            return original.apply(this, arguments);
        };
        window.showStaffChatNotification.__slackHooked = true;
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
        window.openTapper = openTapper;
        window.addSlackMessage = addSlackMessage;
        window.sendSlackMessage = sendSlackMessage;
        window.setActiveChat = setActiveChat;
        window.handleTapperResponse = handleTapperResponse;

        loadSlackChats();

        let attempts = 0;
        const maxAttempts = 50;
        const interval = setInterval(() => {
            attempts += 1;
            const okNotif = hookStaffChatNotifications();
            if (okNotif || attempts >= maxAttempts) {
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
