// chatScheduler.js
// Simple scheduling system for TAPPER chat messages

(function () {
    const events = new Map();
    const timers = new Map();

    function safeString(value, fallback = '') {
        return typeof value === 'string' ? value : fallback;
    }

    function getNextTimeDelay(atTime) {
        if (!atTime || !/^[0-2]\d:[0-5]\d$/.test(atTime)) return null;
        const [h, m] = atTime.split(':').map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(h, m, 0, 0);
        if (target <= now) target.setDate(target.getDate() + 1);
        return target.getTime() - now.getTime();
    }

    function sendToTapper(evt) {
        // For chat notifications, only call showStaffChatNotification
        // The hook in slackApp.js will handle adding to TAPPER
        if (evt.notification === 'chat' && typeof window.showStaffChatNotification === 'function') {
            window.showStaffChatNotification({
                sender: safeString(evt.sender, 'SYSTEM'),
                message: safeString(evt.message, ''),
                optionA: safeString(evt.optionA, 'ACKNOWLEDGE'),
                optionB: safeString(evt.optionB, 'DISMISS'),
                responseA: safeString(evt.responseA, ''),
                responseB: safeString(evt.responseB, '')
            });
            return;
        }
        
        // For non-chat messages, add to TAPPER directly
        if (typeof window.addSlackMessage === 'function') {
            const sender = safeString(evt.sender, 'SYSTEM');
            const message = safeString(evt.message, '');
            const chatId = safeString(evt.chatId, sender || 'SYSTEM');
            window.addSlackMessage(sender, message, !!evt.isSystem, chatId);
        }
        
        if (evt.notification === 'system' && typeof window.showSystemNotification === 'function') {
            window.showSystemNotification(safeString(evt.message, ''), evt.notificationColor || 'var(--accent)');
        }
    }

    function clearEventTimers(id) {
        const entry = timers.get(id);
        if (!entry) return;
        if (entry.timeoutId) clearTimeout(entry.timeoutId);
        if (entry.intervalId) clearInterval(entry.intervalId);
        timers.delete(id);
    }

    function scheduleEvent(evt) {
        if (!evt || evt.enabled === false) return;
        const id = safeString(evt.id, `evt_${Date.now()}`);
        events.set(id, { ...evt, id });
        clearEventTimers(id);

        const timerEntry = {};

        // If event has triggerOn but also has delayMs, don't schedule yet - wait for trigger
        if (evt.triggerOn && evt.delayMs) {
            timers.set(id, timerEntry);
            return;
        }

        if (evt.delayMs && Number.isFinite(evt.delayMs)) {
            timerEntry.timeoutId = setTimeout(() => {
                triggerChatEvent(id);
                if (evt.once !== false && !evt.intervalMs && !evt.at) clearEventTimers(id);
            }, evt.delayMs);
        }

        if (evt.at) {
            const delay = getNextTimeDelay(evt.at);
            if (delay !== null) {
                timerEntry.timeoutId = setTimeout(() => {
                    triggerChatEvent(id);
                    if (evt.repeatDaily) {
                        scheduleEvent({ ...evt, id });
                    } else if (evt.once !== false && !evt.intervalMs) {
                        clearEventTimers(id);
                    }
                }, delay);
            }
        }

        if (evt.intervalMs && Number.isFinite(evt.intervalMs)) {
            timerEntry.intervalId = setInterval(() => triggerChatEvent(id), evt.intervalMs);
        }

        timers.set(id, timerEntry);
    }

    function triggerChatEvent(idOrEvt) {
        if (!idOrEvt) return;
        const evt = typeof idOrEvt === 'string' ? events.get(idOrEvt) : idOrEvt;
        if (!evt || evt.enabled === false) return;
        sendToTapper(evt);
    }

    function triggerChatEvents(triggerName) {
        if (!triggerName) return;
        events.forEach((evt) => {
            if (evt.triggerOn === triggerName && evt.enabled !== false) {
                // If the event has a delay, schedule it now; otherwise trigger immediately
                if (evt.delayMs && Number.isFinite(evt.delayMs)) {
                    const timerEntry = timers.get(evt.id) || {};
                    timerEntry.timeoutId = setTimeout(() => {
                        triggerChatEvent(evt.id);
                        if (evt.once !== false) clearEventTimers(evt.id);
                    }, evt.delayMs);
                    timers.set(evt.id, timerEntry);
                } else {
                    triggerChatEvent(evt);
                }
            }
        });
    }

    async function loadChatSchedule() {
        try {
            const res = await fetch('assets/data/slack_triggers.json');
            if (!res.ok) return;
            const data = await res.json();
            const list = Array.isArray(data?.events) ? data.events : [];
            list.forEach(scheduleEvent);
        } catch (_) {
            // ignore
        }
    }

    window.scheduleChatEvent = scheduleEvent;
    window.triggerChatEvent = triggerChatEvent;
    window.triggerChatEvents = triggerChatEvents;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadChatSchedule);
    } else {
        loadChatSchedule();
    }
})();
