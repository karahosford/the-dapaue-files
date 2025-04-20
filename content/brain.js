// brain.js - Instance Mode Version
console.log("brain.js defining sketch function (Instance Mode)");

/**
 * p5.js sketch function wrapper for instance mode.
 * @param {p5} sketch The p5 instance object.
 */
const sketchWrapperFunction = ( sketch ) => {
    console.log("p5 instance created, running sketch setup");

    // --- Sketch Configuration (moved inside) ---
    let particles = [];
    const numParticles = 600;
    const noiseScale = 0.02;
    const particleSpeed = 0.8;
    const particleStrokeWeight = 1.2;
    const particlePointSize = 4;
    const trailAlpha = 10;
    let timeOffset = 0;
    const timeIncrement = 0.002;

    // --- 3D Bounds ---
    let bounds = 300;

    // --- Pulse Configuration ---
    const pulseChance = 0.01;
    const pulseAlpha = 95;
    const pulseStrokeWeightMultiplier = 1.8;

    // --- Network Connection Configuration ---
    const connectParticles = true;
    const maxConnectionDistance = 75;
    const maxConnectionDistanceSq = maxConnectionDistance * maxConnectionDistance; // Optimized
    const connectionLineStrokeWeight = 0.5;
    const connectionLineHue = 30;
    const connectionLineSaturation = 100;
    const connectionLineBrightness = 70;
    const connectionLineAlpha = 35;

    // Optimization: Frame skipping for connections
    let frameCounter = 0;
    const connectionFrameInterval = 2;

    // --- Particle Class (Defined INSIDE the wrapper function) ---
    class Particle {
        constructor() {
            // Use sketch prefix for p5 functions
            this.pos = sketch.createVector(
                sketch.random(-bounds, bounds),
                sketch.random(-bounds, bounds),
                sketch.random(-bounds, bounds)
            );
            this.prevPos = this.pos.copy();
            this.vel = sketch.createVector(0, 0, 0);
        }

        update() {
            let noiseFactorX = this.pos.x * noiseScale;
            let noiseFactorY = this.pos.y * noiseScale;
            let noiseFactorZ = this.pos.z * noiseScale;
            // Use sketch prefix for p5 functions
            let phi = sketch.noise(noiseFactorX, noiseFactorY, noiseFactorZ, timeOffset + 10) * sketch.TWO_PI * 2;
            let theta = sketch.noise(noiseFactorX, noiseFactorY, noiseFactorZ, timeOffset + 20) * sketch.PI;
            this.vel.x = particleSpeed * sketch.sin(theta) * sketch.cos(phi);
            this.vel.y = particleSpeed * sketch.sin(theta) * sketch.sin(phi);
            this.vel.z = particleSpeed * sketch.cos(theta);
            this.updatePrev();
            this.pos.add(this.vel);
        }

        show() {
            // Use sketch prefix for p5 functions/variables
            let isPulsing = sketch.random(1) < pulseChance;
            if (isPulsing) {
                sketch.stroke(0, 0, 100, pulseAlpha); // White pulse
                sketch.strokeWeight(particleStrokeWeight * pulseStrokeWeightMultiplier);
            } else {
                sketch.stroke(0, 70, 100, 70); // Light Red/Pink trail
                sketch.strokeWeight(particleStrokeWeight);
            }
            sketch.line(this.prevPos.x, this.prevPos.y, this.prevPos.z,
                 this.pos.x, this.pos.y, this.pos.z);

            // Draw Particle Point
            sketch.stroke(0, 70, 100, 90); // Light Red/Pink point
            sketch.strokeWeight(particlePointSize);
            sketch.point(this.pos.x, this.pos.y, this.pos.z);
        }

        edges() {
             // Use sketch prefix for p5 functions
            if (sketch.abs(this.pos.x) > bounds || sketch.abs(this.pos.y) > bounds || sketch.abs(this.pos.z) > bounds) {
                this.pos.set(
                    sketch.random(-bounds, bounds),
                    sketch.random(-bounds, bounds),
                    sketch.random(-bounds, bounds)
                );
                this.updatePrev();
            }
        }

        updatePrev() {
            this.prevPos.set(this.pos.x, this.pos.y, this.pos.z);
        }
    } // End Particle Class Definition


    // --- p5.js Setup Function ---
    sketch.setup = () => {
        console.log("sketch.setup started");
        let canvasContainer = document.getElementById('p5-canvas-container');
        if (!canvasContainer) {
            console.error("p5.js Error: Container div with ID 'p5-canvas-container' not found.");
            return; // Stop setup if container doesn't exist
        }
        // Use sketch prefix for p5 functions/variables
        let canvas = sketch.createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight, sketch.WEBGL);
        canvas.parent('p5-canvas-container'); // Attach canvas to the container

        sketch.colorMode(sketch.HSB, 360, 100, 100, 100);

        // Initialize particles
        particles = []; // Ensure particles array is fresh for this instance
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle()); // Particle class is defined within this scope
        }
        sketch.strokeCap(sketch.SQUARE);
    };

    // --- p5.js Draw Function ---
    sketch.draw = () => {
        // Use sketch prefix for p5 functions
        sketch.orbitControl();
        sketch.background(0, 0, 0, trailAlpha);

        // Update and Draw Particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].show();
            particles[i].edges();
        }

        // Draw Network Connections (Optimized)
        frameCounter++;
        if (connectParticles && frameCounter % connectionFrameInterval === 0) {
            sketch.strokeWeight(connectionLineStrokeWeight);
            sketch.stroke(connectionLineHue, connectionLineSaturation, connectionLineBrightness, connectionLineAlpha);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let p1 = particles[i];
                    let p2 = particles[j];
                    let dx = p1.pos.x - p2.pos.x;
                    let dy = p1.pos.y - p2.pos.y;
                    let dz = p1.pos.z - p2.pos.z;
                    let distanceSq = dx * dx + dy * dy + dz * dz;

                    if (distanceSq < maxConnectionDistanceSq) {
                        sketch.line(p1.pos.x, p1.pos.y, p1.pos.z,
                             p2.pos.x, p2.pos.y, p2.pos.z);
                    }
                }
            }
        }
        timeOffset += timeIncrement;
    }; // End sketch.draw


    // --- p5.js Window Resized Function ---
    sketch.windowResized = () => {
        console.log("sketch.windowResized triggered");
        let canvasContainer = document.getElementById('p5-canvas-container');
        if (canvasContainer) {
           // Use sketch prefix for p5 functions/variables
           sketch.resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
           sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
        } else {
           console.warn("p5.js Warning: Could not find container 'p5-canvas-container' on resize.");
        }
    }; // End sketch.windowResized

}; // End sketchWrapperFunction

// Note: We do NOT call 'new p5(...)' here.
// That will be done by the inline script in the HTML when the button is clicked.
