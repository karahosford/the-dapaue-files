// pongEasterEgg.js
// Easter egg: If "tennis" is entered in the terminal, show fullscreen Pong with fireworks on win

(function() {
    // Only attach once
    if (window.__pongEasterEggLoaded) return;
    window.__pongEasterEggLoaded = true;

    // Add global trigger
    window.triggerPongEasterEgg = function() {
        // Dim overlay
        let overlay = document.createElement('div');
        overlay.id = 'pong-easteregg-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.backdropFilter = 'blur(2px)';
        overlay.style.opacity = '0.7'; // 30% transparent
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.transition = 'opacity 0.5s';
        document.body.appendChild(overlay);

        // Pong canvas
        let canvas = document.createElement('canvas');
        canvas.id = 'pong-easteregg-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = 'block';
        canvas.style.opacity = '0.7'; // 30% transparent
        overlay.appendChild(canvas);

        // Exit button and close logic
        let exitButton = null;
        let pongActive = true;
        function closePong() {
            pongActive = false;
            document.removeEventListener('keydown', pongKeyHandler);
            window.removeEventListener('resize', resizeCanvas);
            if (exitButton) exitButton.remove();
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            let notif = document.getElementById('pong-end-notification');
            if (notif) notif.remove();
            let emojiRain = document.querySelector('#pong-end-notification ~ div');
            if (emojiRain) emojiRain.remove();
        }
        // Always show Exit button
        function showExitButton() {
            if (exitButton) exitButton.remove();
            exitButton = document.createElement('button');
            exitButton.textContent = 'Exit';
            exitButton.style.position = 'absolute';
            exitButton.style.top = '32px';
            exitButton.style.left = '50%';
            exitButton.style.transform = 'translate(-50%, 0)';
            exitButton.style.fontSize = '1.2rem';
            exitButton.style.padding = '0.4rem 1.2rem';
            exitButton.style.background = '#222';
            exitButton.style.color = '#fff';
            exitButton.style.border = '2px solid #fff';
            exitButton.style.borderRadius = '10px';
            exitButton.style.cursor = 'pointer';
            exitButton.style.zIndex = '10001';
            exitButton.style.opacity = '0.92';
            exitButton.addEventListener('click', closePong);
            overlay.appendChild(exitButton);
        }
        showExitButton();
        function pongKeyHandler(e) {
            // No Escape close
        }
        document.addEventListener('keydown', pongKeyHandler);
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);

        // Pong game logic
        const ctx = canvas.getContext('2d');
        let w = canvas.width, h = canvas.height;
        let paddleH = Math.max(80, h * 0.15), paddleW = 18;
        let ballR = 14;
        let leftY = h/2 - paddleH/2, rightY = h/2 - paddleH/2;
        let leftX = 32, rightX = w-32; // Paddle X positions (forwards/backwards)
        let leftMinX = 32, leftMaxX = w/2 - paddleW - 24;
        let rightMaxX = w-32, rightMinX = w/2 + 24;
        let leftScore = 0, rightScore = 0;
        let ballX = w/2, ballY = h/2, ballVX = 8 * (Math.random() > 0.5 ? 1 : -1), ballVY = 6 * (Math.random() * 2 - 1);
        let upPressed = false, downPressed = false;
        let leftPressed = false, rightPressed = false;
        let gameOver = false, fireworks = [];
        let sparkles = [];
        function resetBall() {
            ballX = w/2; ballY = h/2;
            ballVX = 8 * (Math.random() > 0.5 ? 1 : -1);
            ballVY = 6 * (Math.random() * 2 - 1);
            ballTrail = [];
        }
        // Color palette for paddle sparks
        let hitColorIdx = 0;
        const hitColors = ['#00eaff', '#ffea00', '#ff3b3b', '#00ff7f', '#ff00ff', '#ffa500', '#00ffd0'];
        function emitSparkBurst(x, y) {
            const color = hitColors[hitColorIdx];
            hitColorIdx = (hitColorIdx + 1) % hitColors.length;
            for (let i = 0; i < 18; i++) {
                let angle = (i / 18) * 2 * Math.PI;
                let speed = 4 + Math.random() * 2;
                sparkles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    r: 4 + Math.random() * 2,
                    color,
                    alpha: 0.9,
                    decay: 0.04 + Math.random() * 0.02
                });
            }
        }
        function draw() {
            ctx.clearRect(0,0,w,h);
            // Background
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#111';
            ctx.fillRect(0,0,w,h);
            ctx.restore();
            // Net
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([16, 24]);
            ctx.beginPath();
            ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
            // Paddles as pyramids (isosceles triangles)
            ctx.fillStyle = '#fff';
            // Left paddle (base at leftX, tip points right)
            ctx.beginPath();
            ctx.moveTo(leftX, leftY); // top left
            ctx.lineTo(leftX, leftY + paddleH); // bottom left
            ctx.lineTo(leftX + paddleW, leftY + paddleH/2); // tip (middle right)
            ctx.closePath();
            ctx.fill();
            // Right paddle (base at rightX, tip points left)
            ctx.beginPath();
            ctx.moveTo(rightX, rightY); // top right
            ctx.lineTo(rightX, rightY + paddleH); // bottom right
            ctx.lineTo(rightX - paddleW, rightY + paddleH/2); // tip (middle left)
            ctx.closePath();
            ctx.fill();
            // Ball (no glow)
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballR, 0, 2*Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            // Sparkles (firework style)
            for (let s of sparkles) {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, 2*Math.PI);
                ctx.fill();
                ctx.restore();
            }
            // Scores and Exit button between
            ctx.font = 'bold 64px monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.8;
            ctx.fillText(leftScore, w/2-120, 80);
            ctx.fillText(rightScore, w/2+120, 80);
            ctx.globalAlpha = 1;
            // Place Exit button between scores
            if (exitButton) {
                exitButton.style.top = '32px';
                exitButton.style.left = '50%';
                exitButton.style.transform = 'translate(-50%, 0)';
            }
            // Fireworks
            for (let f of fireworks) f.draw(ctx);
        }
        // Track if opponent has hit the ball this rally
        let opponentCanHit = true;
        let playerCanHit = true;
        function update() {
            if (gameOver) return;
            // Player paddle (vertical)
            if (upPressed) leftY -= 14;
            if (downPressed) leftY += 14;
            leftY = Math.max(0, Math.min(h-paddleH, leftY));
            // Player paddle (horizontal/forward-back)
            if (leftPressed) leftX -= 10;
            if (rightPressed) leftX += 10;
            leftX = Math.max(leftMinX, Math.min(leftMaxX, leftX));
            // Opponent paddle (vertical)
            let targetY = ballY - paddleH/2;
            rightY += (targetY - rightY) * 0.12;
            rightY = Math.max(0, Math.min(h-paddleH, rightY));
            // Opponent paddle (horizontal/forward-back, dynamic/anticipatory)
            if (!window._pongOpponentOffset || Math.random() < 0.012) {
                // Occasionally pick a new offset
                window._pongOpponentOffset = (Math.random() - 0.5) * 120; // -60 to +60 px
            }
            if (!window._pongOpponentRetreat) window._pongOpponentRetreat = 0;
            if (window._pongOpponentRetreat > 0) {
                window._pongOpponentRetreat--;
            }
            // After opponent hits, avoid ball until player hits
            let anticipation = (ballVX > 0) ? 1.2 : 0.7;
            let baseTargetX = Math.max(rightMinX, Math.min(rightMaxX, ballX * anticipation + window._pongOpponentOffset));
            let targetX = baseTargetX;
            if (!opponentCanHit) {
                // Stay away from ball's X position (hug the back of its half)
                targetX = rightMaxX - 30;
            } else if (window._pongOpponentRetreat > 0) {
                // Move further back in its half
                targetX = rightMaxX - 30;
            }
            rightX += (targetX - rightX) * 0.08;
            rightX = Math.max(rightMinX, Math.min(rightMaxX, rightX));
            // Ball
            ballX += ballVX; ballY += ballVY;
            // Collisions
            if (ballY-ballR < 0 || ballY+ballR > h) {
                ballVY *= -1;
                emitSparkBurst(ballX, ballY);
            }
            // Left paddle collision (triangle hitbox approx)
            if (
                ballX - ballR < leftX + paddleW &&
                ballX + ballR > leftX &&
                ballY > leftY && ballY < leftY + paddleH
            ) {
                if (playerCanHit) {
                    // Calculate impact point (relative to paddle center)
                    let rel = (ballY - (leftY + paddleH/2)) / (paddleH/2); // -1 (top) to 1 (bottom)
                    let angle = rel * Math.PI/4; // up to 45deg up/down
                    let speed = Math.sqrt(ballVX*ballVX + ballVY*ballVY) * 1.07;
                    ballVX = Math.abs(speed * Math.cos(angle));
                    ballVY = speed * Math.sin(angle);
                    emitSparkBurst(leftX + paddleW, ballY);
                    playerCanHit = false;
                    opponentCanHit = true;
                }
            }
            // Right paddle collision (triangle hitbox approx)
            if (
                ballX + ballR > rightX - paddleW &&
                ballX - ballR < rightX &&
                ballY > rightY && ballY < rightY + paddleH
            ) {
                if (opponentCanHit) {
                    // Calculate impact point (relative to paddle center)
                    let rel = (ballY - (rightY + paddleH/2)) / (paddleH/2); // -1 (top) to 1 (bottom)
                    let angle = rel * Math.PI/4; // up to 45deg up/down
                    let speed = Math.sqrt(ballVX*ballVX + ballVY*ballVY) * 1.07;
                    ballVX = -Math.abs(speed * Math.cos(angle));
                    ballVY = speed * Math.sin(angle);
                    emitSparkBurst(rightX - paddleW, ballY);
                    window._pongOpponentRetreat = 18; // retreat for a few frames
                    opponentCanHit = false;
                    playerCanHit = true;
                }
            }
            // Score
            if (ballX < 0) { rightScore++; resetBall(); opponentCanHit = true; playerCanHit = true; }
            if (ballX > w) { leftScore++; resetBall(); opponentCanHit = true; playerCanHit = true; }
            // Win
            if (leftScore === 5 || rightScore === 5) {
                gameOver = true;
                showEndNotification(leftScore === 5 ? 'You Win!' : 'You Lose!');
            }
                    // Show notification overlay at end
                    function showEndNotification(message) {
                        // Remove existing notification if any
                        let old = document.getElementById('pong-end-notification');
                        if (old) old.remove();
                        let notif = document.createElement('div');
                        notif.id = 'pong-end-notification';
                        notif.style.position = 'fixed';
                        notif.style.top = '0';
                        notif.style.left = '0';
                        notif.style.width = '100vw';
                        notif.style.height = '100vh';
                        notif.style.background = 'rgba(0,0,0,0.7)';
                        notif.style.display = 'flex';
                        notif.style.flexDirection = 'column';
                        notif.style.alignItems = 'center';
                        notif.style.justifyContent = 'center';
                        notif.style.zIndex = '100002';
                        notif.innerHTML = `<div style=\"color:#fff;font-size:3rem;font-weight:bold;margin-bottom:2rem;text-shadow:0 2px 12px #000\">${message}</div>`;
                        // Emoji rain if lost
                        let emojiRainInterval = null;
                        if (message && message.toLowerCase().includes('lose')) {
                            // Create emoji rain container
                            let emojiRain = document.createElement('div');
                            emojiRain.style.position = 'fixed';
                            emojiRain.style.top = '0';
                            emojiRain.style.left = '0';
                            emojiRain.style.width = '100vw';
                            emojiRain.style.height = '100vh';
                            emojiRain.style.pointerEvents = 'none';
                            emojiRain.style.zIndex = '100001';
                            document.body.appendChild(emojiRain);
                            // Animate falling emojis
                            function spawnEmoji() {
                                let emoji = document.createElement('div');
                                emoji.textContent = '😭';
                                emoji.style.position = 'absolute';
                                emoji.style.left = Math.random() * 100 + 'vw';
                                emoji.style.top = '-3rem';
                                emoji.style.fontSize = (2.2 + Math.random() * 1.8) + 'rem';
                                emoji.style.opacity = 0.85 + Math.random() * 0.15;
                                emoji.style.pointerEvents = 'none';
                                emoji.style.transition = 'transform 0.1s linear';
                                emojiRain.appendChild(emoji);
                                // Animate down
                                let duration = 1800 + Math.random() * 1200;
                                let translateY = window.innerHeight + 100;
                                emoji.animate([
                                    { transform: 'translateY(0)' },
                                    { transform: `translateY(${translateY}px)` }
                                ], {
                                    duration: duration,
                                    easing: 'linear',
                                    fill: 'forwards'
                                });
                                setTimeout(() => { emoji.remove(); }, duration + 100);
                            }
                            emojiRainInterval = setInterval(spawnEmoji, 120);
                        }
                        let btn = document.createElement('button');
                        btn.textContent = 'Exit';
                        btn.style.fontSize = '1.5rem';
                        btn.style.padding = '0.7rem 2.5rem';
                        btn.style.background = '#222';
                        btn.style.color = '#fff';
                        btn.style.border = '2px solid #fff';
                        btn.style.borderRadius = '12px';
                        btn.style.cursor = 'pointer';
                        btn.style.opacity = '0.92';
                        btn.onclick = () => {
                            notif.remove();
                            let emojiRain = document.querySelector('#pong-end-notification ~ div');
                            if (emojiRain) emojiRain.remove();
                            if (emojiRainInterval) clearInterval(emojiRainInterval);
                            closePong();
                            if (typeof window.triggerGemmaEasterEgg === 'function') {
                                window.triggerGemmaEasterEgg();
                            }
                        };
                        notif.appendChild(btn);
                        document.body.appendChild(notif);
                    }
            // Fireworks update
            for (let f of fireworks) f.update();
            fireworks = fireworks.filter(f => !f.done);
            // Sparkles update (firework style)
            for (let s of sparkles) {
                s.x += s.vx;
                s.y += s.vy;
                s.vx *= 0.92;
                s.vy *= 0.92;
                s.alpha -= s.decay;
                s.r *= 0.97;
            }
            sparkles = sparkles.filter(s => s.alpha > 0.05);
        }
                // Show exit button at end (between scores)
                function showExitButton() {
                    if (exitButton) exitButton.remove();
                    exitButton = document.createElement('button');
                    exitButton.textContent = 'Exit';
                    exitButton.style.position = 'absolute';
                    exitButton.style.top = '32px';
                    exitButton.style.left = '50%';
                    exitButton.style.transform = 'translate(-50%, 0)';
                    exitButton.style.fontSize = '1.2rem';
                    exitButton.style.padding = '0.4rem 1.2rem';
                    exitButton.style.background = '#222';
                    exitButton.style.color = '#fff';
                    exitButton.style.border = '2px solid #fff';
                    exitButton.style.borderRadius = '10px';
                    exitButton.style.cursor = 'pointer';
                    exitButton.style.zIndex = '10001';
                    exitButton.style.opacity = '0.92';
                    exitButton.addEventListener('click', closePong);
                    overlay.appendChild(exitButton);
                }
        // Fireworks removed (no-op)
        function triggerFireworks() {}
        function Firework(x, y) {
            this.particles = [];
            this.done = false;
            for (let i=0; i<32; i++) {
                let angle = (i/32)*2*Math.PI;
                let speed = 6+Math.random()*4;
                this.particles.push({
                    x, y,
                    vx: Math.cos(angle)*speed,
                    vy: Math.sin(angle)*speed,
                    alpha: 1
                });
            }
            this.update = function() {
                for (let p of this.particles) {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.96;
                    p.vy *= 0.96;
                    p.alpha -= 0.018;
                }
                this.done = this.particles.every(p => p.alpha <= 0);
            };
            this.draw = function(ctx) {
                for (let p of this.particles) {
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 4, 0, 2*Math.PI);
                    ctx.fill();
                    ctx.restore();
                }
            };
        }
        // Controls
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowUp' || e.key === 'w') upPressed = true;
            if (e.key === 'ArrowDown' || e.key === 's') downPressed = true;
            if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
            if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
        });
        document.addEventListener('keyup', function(e) {
            if (e.key === 'ArrowUp' || e.key === 'w') upPressed = false;
            if (e.key === 'ArrowDown' || e.key === 's') downPressed = false;
            if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
            if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
        });
        // Main loop
        function loop() {
            if (!pongActive) return;
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            update();
            draw();
            if (pongActive && (!gameOver || fireworks.length > 0)) requestAnimationFrame(loop);
        }
        loop();
    };
})();
