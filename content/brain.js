<script>
        // --- Sketch Configuration ---
        let particles = []; // Array to hold particle objects
        const numParticles = 600; // Number of particles
        const noiseScale = 0.02; // Scale of the Perlin noise field
        const particleSpeed = 0.8; // Speed of particles
        const particleStrokeWeight = 1.2; // Base thickness of particle trails
        const particlePointSize = 4; // Size of the visible particle points
        const trailAlpha = 10; // Opacity of the background fade
        let timeOffset = 0; // Time dimension for noise
        const timeIncrement = 0.002; // How fast the noise field evolves

        // --- 3D Bounds ---
        let bounds = 300; // Half-width/height/depth of the bounding box

        // --- Pulse Configuration ---
        const pulseChance = 0.01; // Chance (0 to 1) for a particle trail segment to pulse
        const pulseAlpha = 95; // Alpha for the pulse color
        const pulseStrokeWeightMultiplier = 1.8; // How much thicker the pulse stroke is

        // --- Network Connection Configuration ---
        const connectParticles = true; // Set to true to draw connection lines
        const maxConnectionDistance = 75; // Max distance to draw a connection line
        const connectionLineStrokeWeight = 0.5; // Thickness of connection lines
        // Connection line color (HSB: Dark Orange, somewhat transparent)
        const connectionLineHue = 30;       // Orange Hue
        const connectionLineSaturation = 100; // Max Saturation
        const connectionLineBrightness = 70;  // Medium-Dark Brightness
        const connectionLineAlpha = 35;     // Somewhat Transparent

        // --- p5.js Setup Function ---
        function setup() {
            // Create canvas with WEBGL renderer
            let canvasContainer = document.getElementById('p5-canvas-container');
            let canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight, WEBGL);
            canvas.parent('p5-canvas-container');
            // Set color mode to HSB
            colorMode(HSB, 360, 100, 100, 100);

            // Initialize particles in 3D space
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
            // Set stroke cap to square for trails
            strokeCap(SQUARE);
        }

        // --- p5.js Draw Function ---
        function draw() {
            // Enable orbit control with the mouse
            orbitControl();

            // Draw a semi-transparent black background for trails
            background(0, 0, 0, trailAlpha);

            // --- Update and Draw Particle Trails & Points ---
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].show(); // Draws trail and point
                particles[i].edges(); // Check 3D bounds
            }

            // --- Draw Network Connections ---
            if (connectParticles) {
                // Set style for connection lines (Dark Orange)
                strokeWeight(connectionLineStrokeWeight);
                stroke(connectionLineHue, connectionLineSaturation, connectionLineBrightness, connectionLineAlpha);

                // Iterate through all pairs of particles
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        let p1 = particles[i];
                        let p2 = particles[j];
                        let distance = p1.pos.dist(p2.pos);
                        if (distance < maxConnectionDistance) {
                            // Optionally, make line fainter as distance increases (uncomment block below)
                            /*
                            let alpha = map(distance, 0, maxConnectionDistance, connectionLineAlpha, 0);
                            stroke(connectionLineHue, connectionLineSaturation, connectionLineBrightness, alpha);
                            */
                            line(p1.pos.x, p1.pos.y, p1.pos.z,
                                 p2.pos.x, p2.pos.y, p2.pos.z);
                        }
                    }
                }
            }

            // Increment the time dimension for the noise field
            timeOffset += timeIncrement;
        }

        // --- Particle Class ---
        class Particle {
            constructor() {
                // Position and velocity setup
                this.pos = createVector(
                    random(-bounds, bounds), random(-bounds, bounds), random(-bounds, bounds)
                );
                this.prevPos = this.pos.copy();
                this.vel = createVector(0, 0, 0);
                // No label setup needed now
            }

            // Update particle state in 3D
            update() {
                // Noise calculation... (same as before)
                let noiseFactorX = this.pos.x * noiseScale;
                let noiseFactorY = this.pos.y * noiseScale;
                let noiseFactorZ = this.pos.z * noiseScale;
                let phi = noise(noiseFactorX, noiseFactorY, noiseFactorZ, timeOffset + 10) * TWO_PI * 2;
                let theta = noise(noiseFactorX, noiseFactorY, noiseFactorZ, timeOffset + 20) * PI;
                this.vel.x = particleSpeed * sin(theta) * cos(phi);
                this.vel.y = particleSpeed * sin(theta) * sin(phi);
                this.vel.z = particleSpeed * cos(theta);
                this.updatePrev();
                this.pos.add(this.vel);
            }

            // Draw the particle's trail segment AND the particle point itself
            show() {
                // --- Draw Trail Segment ---
                let isPulsing = random(1) < pulseChance;
                if (isPulsing) {
                    // Pulse Appearance (Bright White)
                    stroke(0, 0, 100, pulseAlpha); // H(any), S:0, B:100
                    strokeWeight(particleStrokeWeight * pulseStrokeWeightMultiplier);
                } else {
                    // Normal Trail Appearance (Light Red/Pink)
                    stroke(0, 70, 100, 70); // H:0, S:70, B:100
                    strokeWeight(particleStrokeWeight);
                }
                // Draw the 3D line segment for the trail
                line(this.prevPos.x, this.prevPos.y, this.prevPos.z,
                     this.pos.x, this.pos.y, this.pos.z);

                // --- Draw Particle Point ---
                // Use the normal trail color but slightly more opaque
                stroke(0, 70, 100, 90); // Light Red/Pink, Alpha 90
                strokeWeight(particlePointSize); // Use defined point size
                point(this.pos.x, this.pos.y, this.pos.z); // Draw point at current position
            }

            // Handle 3D screen edges
            edges() {
                if (abs(this.pos.x) > bounds || abs(this.pos.y) > bounds || abs(this.pos.z) > bounds) {
                    this.pos.set(
                        random(-bounds, bounds), random(-bounds, bounds), random(-bounds, bounds)
                    );
                    this.updatePrev(); // Avoid drawing line across space after reset
                    // No label hiding needed now
                }
            }

            // Store previous position
            updatePrev() {
                this.prevPos.set(this.pos.x, this.pos.y, this.pos.z);
            }

            // No updateLabelPosition method needed now
        }

        // --- p5.js Window Resized Function ---
        function windowResized() {
            let canvasContainer = document.getElementById('p5-canvas-container');
            if (canvasContainer) { // Check if container exists
               resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
               // Re-apply HSB color mode settings after resize
               colorMode(HSB, 360, 100, 100, 100);
            }
        }

    </script>