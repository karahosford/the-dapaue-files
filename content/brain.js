// brain.js - Global Mode Version (Autoplay)
console.log("brain.js loading (Global Mode)");

// --- Sketch Configuration (Global Scope) ---
let particles = [];
const numParticles = 600;
const noiseScale = 0.02;
const particleSpeed = 0.8;
const particleStrokeWeight = 1.2;
const particlePointSize = 4;
const trailAlpha = 10; // Value out of 100 for mapping convenience
let timeOffset = 0;
const timeIncrement = 0.002;

// --- 3D Bounds ---
let bounds = 300;

// --- Pulse Configuration ---
const pulseChance = 0.01;
const pulseAlpha = 95; // Alpha out of 100
const pulseStrokeWeightMultiplier = 1.8;

// --- Network Connection Configuration ---
const connectParticles = true;
const maxConnectionDistance = 75;
const maxConnectionDistanceSq = maxConnectionDistance * maxConnectionDistance; // Optimized
const connectionLineStrokeWeight = 0.5;
const connectionLineHue = 30;
const connectionLineSaturation = 100;
const connectionLineBrightness = 70;
const connectionLineAlpha = 35; // Alpha out of 100

// Optimization: Frame skipping for connections
let frameCounter = 0;
const connectionFrameInterval = 2;

// --- Timed Text Configuration ---
const timedText = "SCANNING_ARCHIVE";
const textDisplayMinDuration = 6000; // ms (6 seconds)
const textDisplayMaxDuration = 10000; // ms (10 seconds)
const minDelayBetweenText = 5000; // ms (5 seconds)
const maxDelayBetweenText = 15000; // ms (15 seconds)
let isTextVisible = false;
let targetParticleIndex = -1;
let textEndTime = 0;
let nextTextStartTime = 2000; // ms
const textOffset = 15;

// --- Particle Class (Global Scope) ---
// Needs access to p5 global functions implicitly
class Particle {
    constructor() {
        // Use p5 global functions directly
        this.pos = createVector(
            random(-bounds, bounds),
            random(-bounds, bounds),
            random(-bounds, bounds)
        );
        this.prevPos = this.pos.copy();
        this.vel = createVector(0, 0, 0);
    }

    update() {
        let noiseFactorX = this.pos.x * noiseScale;
        let noiseFactorY = this.pos.y * noiseScale;
        let noiseFactorZ = this.pos.z * noiseScale;
        // Use p5 global functions/variables directly
        let phi = noise(noiseFactorX, noiseFactorY, noiseFactorZ, timeOffset + 10) * TWO_PI * 2;
        let theta = noise(noiseFactorX, noiseFactorY, noiseFactorZ, timeOffset + 20) * PI;
        this.vel.x = particleSpeed * sin(theta) * cos(phi);
        this.vel.y = particleSpeed * sin(theta) * sin(phi);
        this.vel.z = particleSpeed * cos(theta);
        this.updatePrev();
        this.pos.add(this.vel);
    }

    show() {
        // Use p5 global functions directly
        let isPulsing = random(1) < pulseChance;
        let pulseP5Alpha = map(pulseAlpha, 0, 100, 0, 255);
        let trailP5Alpha = map(70, 0, 100, 0, 255);
        let pointP5Alpha = map(90, 0, 100, 0, 255);

        if (isPulsing) {
            stroke(0, 0, 100, pulseP5Alpha); // White pulse
            strokeWeight(particleStrokeWeight * pulseStrokeWeightMultiplier);
        } else {
            stroke(0, 70, 100, trailP5Alpha); // Light Red/Pink trail
            strokeWeight(particleStrokeWeight);
        }
        line(this.prevPos.x, this.prevPos.y, this.prevPos.z,
             this.pos.x, this.pos.y, this.pos.z);

        // Draw Particle Point
        stroke(0, 70, 100, pointP5Alpha); // Light Red/Pink point
        strokeWeight(particlePointSize);
        point(this.pos.x, this.pos.y, this.pos.z);
    }

    edges() {
        // Use p5 global functions directly
        if (abs(this.pos.x) > bounds || abs(this.pos.y) > bounds || abs(this.pos.z) > bounds) {
            this.pos.set(
                random(-bounds, bounds),
                random(-bounds, bounds),
                random(-bounds, bounds)
            );
            this.updatePrev();
            // If the target particle resets while text is visible, hide text early
            if (isTextVisible && particles.indexOf(this) === targetParticleIndex) {
                 isTextVisible = false;
            }
        }
    }

    updatePrev() {
        this.prevPos.set(this.pos.x, this.pos.y, this.pos.z);
    }
} // End Particle Class Definition


// --- p5.js Setup Function (Global Scope) ---
function setup() {
    console.log("Global setup started");
    let canvasContainer = document.getElementById('p5-canvas-container');
    if (!canvasContainer) {
        console.error("p5.js Error: Container div with ID 'p5-canvas-container' not found.");
        return;
    }
    // Use p5 global functions/variables directly
    let canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight, WEBGL);
    canvas.parent('p5-canvas-container'); // Attach canvas to the container

    colorMode(HSB, 360, 100, 100, 255); // Alpha range 0-255

    // Initialize particles
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
    strokeCap(SQUARE);
    textSize(14); // Set default text size
};

// --- p5.js Draw Function (Global Scope) ---
function draw() {
    let currentTime = millis(); // Use global millis()

    orbitControl(); // Use global orbitControl()

    // Set background
    let bgColor = color('#161618'); // Use global color()
    let alphaValue = map(trailAlpha, 0, 100, 0, 255); // Use global map()
    bgColor.setAlpha(alphaValue);
    background(bgColor); // Use global background()

    // --- Update and Draw Particles ---
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].show();
        particles[i].edges();
    }

    // --- Draw Network Connections ---
    frameCounter++;
    if (connectParticles && frameCounter % connectionFrameInterval === 0) {
        let connectionP5Alpha = map(connectionLineAlpha, 0, 100, 0, 255); // Use global map()
        strokeWeight(connectionLineStrokeWeight); // Use global strokeWeight()
        // Use global stroke()
        stroke(connectionLineHue, connectionLineSaturation, connectionLineBrightness, connectionP5Alpha);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let p1 = particles[i];
                let p2 = particles[j];
                let dx = p1.pos.x - p2.pos.x;
                let dy = p1.pos.y - p2.pos.y;
                let dz = p1.pos.z - p2.pos.z;
                let distanceSq = dx * dx + dy * dy + dz * dz;

                if (distanceSq < maxConnectionDistanceSq) {
                    // Use global line()
                    line(p1.pos.x, p1.pos.y, p1.pos.z,
                         p2.pos.x, p2.pos.y, p2.pos.z);
                }
            }
        }
    }

    // --- Timed Text Logic ---
    if (!isTextVisible && currentTime >= nextTextStartTime && particles.length > 0) {
        isTextVisible = true;
        targetParticleIndex = floor(random(particles.length)); // Use global floor(), random()
        textEndTime = currentTime + random(textDisplayMinDuration, textDisplayMaxDuration); // Use global random()
        nextTextStartTime = textEndTime + random(minDelayBetweenText, maxDelayBetweenText); // Use global random()
        console.log(`Showing text on particle ${targetParticleIndex} until ${textEndTime}`);
    }

    if (isTextVisible) {
        if (currentTime >= textEndTime) {
            isTextVisible = false;
            targetParticleIndex = -1;
            console.log("Hiding text");
        } else {
            if (targetParticleIndex >= 0 && targetParticleIndex < particles.length) {
                let targetParticle = particles[targetParticleIndex];

                // Draw Connecting Line
                stroke(0, 0, 80, 150); // Use global stroke()
                strokeWeight(0.7); // Use global strokeWeight()
                let textX = targetParticle.pos.x + textOffset;
                let textY = targetParticle.pos.y - textOffset;
                let textZ = targetParticle.pos.z;
                line(targetParticle.pos.x, targetParticle.pos.y, targetParticle.pos.z, textX, textY, textZ); // Use global line()

                // Draw Text
                fill(0, 0, 90, 220); // Use global fill()
                noStroke(); // Use global noStroke()
                text(timedText, textX, textY, textZ); // Use global text()
            } else {
                isTextVisible = false;
                targetParticleIndex = -1;
            }
        }
    }

    timeOffset += timeIncrement;
}; // End draw


// --- p5.js Window Resized Function (Global Scope) ---
function windowResized() {
    console.log("Global windowResized triggered");
    let canvasContainer = document.getElementById('p5-canvas-container');
    if (canvasContainer) {
       resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight); // Use global resizeCanvas()
       colorMode(HSB, 360, 100, 100, 255); // Use global colorMode()
    } else {
       console.warn("p5.js Warning: Could not find container 'p5-canvas-container' on resize.");
    }
}; // End windowResized
