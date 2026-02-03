(function() {
    // Notification state
    let systemNotificationShown = false;
    const notificationHistory = [];
    
    // Get or create the notification container
    window.getOrCreateNotificationContainer = function() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    };
    
    // Close notification function
    window.closeNotification = function(notificationElem, message) {
        // Add hiding animation
        notificationElem.classList.add('hiding');
        
        // Remove after animation completes (500ms)
        setTimeout(() => {
            notificationElem.remove();
            if (message) {
                const idx = notificationHistory.indexOf(message);
                if (idx !== -1) notificationHistory.splice(idx, 1);
            }
        }, 500);
    };
    
    // Main system notification function
    window.showSystemNotification = function(message, progressColor = 'var(--accent)') {
        // If no message provided, it's the welcome notification - only show once
        if (!message && systemNotificationShown) {
            return;
        }
        
        if (!message) {
            systemNotificationShown = true;
        }
        
        // Play error sound for error notifications, regular notification sound for others
        if (message && window.soundEnabled) {
            if (progressColor === '#ff6b6b' || message.includes('✗') || message.includes('ERROR') || message.includes('FAILED')) {
                try {
                    const errorAudio = new Audio('assets/audio/error.mp3');
                    errorAudio.volume = 0.5;
                    errorAudio.play().catch(e => console.log('Error audio playback failed:', e));
                } catch (e) {
                    console.log('Error audio error:', e);
                }
            } else {
                try {
                    const notifAudio = new Audio('assets/audio/notification.mp3');
                    notifAudio.volume = 0.5;
                    notifAudio.play().catch(e => console.log('Notification audio playback failed:', e));
                } catch (e) {
                    console.log('Notification audio error:', e);
                }
            }
        }
        
        // Check if this notification message already exists
        if (message) {
            const existingIndex = notificationHistory.findIndex(n => n === message);
            if (existingIndex !== -1) {
                // Remove the oldest duplicate
                const container = document.getElementById('notification-container');
                if (container && container.children[existingIndex]) {
                    const oldNotif = container.children[existingIndex];
                    oldNotif.classList.add('hiding');
                    setTimeout(() => oldNotif.remove(), 500);
                    notificationHistory.splice(existingIndex, 1);
                }
            }
            notificationHistory.push(message);
        }
        
        const notification = document.createElement('div');
        notification.className = 'system-notification';
        
        if (message) {
            // Custom message notification
            notification.innerHTML = `
                <div class="notification-header">
                    <div class="notification-title">⚡ SYSTEM NOTICE</div>
                    <div class="notification-close" style="user-select:none;">✕</div>
                </div>
                <div class="notification-body">
                    <p style="margin-bottom: 6px; color: var(--accent);">${message}</p>
                </div>
                <div class="notification-progress">
                    <div class="notification-progress-bar" style="background: ${progressColor};"></div>
                </div>
            `;
        } else {
            // Welcome notification
            notification.innerHTML = `
                <div class="notification-header">
                    <div class="notification-title">⚡ SYSTEM NOTICE // NEURAL-LINK STATUS</div>
                    <div class="notification-close" style="user-select:none;">✕</div>
                </div>
                <div class="notification-body">
                    <p style="margin-bottom: 8px; color: var(--accent);">WELCOME, OPERATOR.</p>
                    <p style="margin-bottom: 6px;">YOUR NEURAL-LINK HAS BEEN ESTABLISHED. SESSION DATA IS NOW SYNCED TO LOCAL CORTEX MEMORY.</p>
                    <p style="margin-bottom: 6px; font-size: 8px; color: var(--text-dim);">⚠ IMPORTANT: All progress, notes, and unlocked accounts are stored in your LOCAL BROWSER CACHE. Clearing your browser data will result in COMPLETE MEMORY WIPE.</p>
                </div>
                <div class="notification-progress">
                    <div class="notification-progress-bar"></div>
                </div>
            `;
        }
        
        // Attach click event listener to close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => window.closeNotification(notification, message));
        }
        
        const container = getOrCreateNotificationContainer();
        container.appendChild(notification);
        
        // Start fade-out at 14.5 seconds for smooth transition
        setTimeout(() => {
            notification.classList.add('hiding');
        }, 14500);
        
        // Remove after full 15 seconds
        setTimeout(() => {
            notification.remove();
            if (message) {
                const index = notificationHistory.indexOf(message);
                if (index !== -1) notificationHistory.splice(index, 1);
            }
        }, 15000);
    };
    
    // Simplified notification function (replaces old showNotification)
    // Now uses the same system as showSystemNotification for consistency
    window.showNotification = function(message, type = 'info') {
        const color = type === 'success' ? '#22c55e' : 
                      type === 'error' ? '#ff6b6b' : 
                      type === 'warning' ? '#fbbf24' : 
                      'var(--accent)';
        
        window.showSystemNotification(message, color);
    };
    
    // Initialize notification container on load
    function initNotificationSystem() {
        getOrCreateNotificationContainer();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNotificationSystem);
    } else {
        initNotificationSystem();
    }
})();
