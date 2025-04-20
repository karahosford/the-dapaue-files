// brain_2d_animated.js - Animated 2D Network Graph (Adaptive Colors)
console.log("brain_2d_animated.js loading (2D Global Mode)");

// --- Sketch Configuration (Global Scope) ---
let particles = [];
const numParticles = 200; // User's particle count
const noiseScale = 1; // User's noise scale
const particleSpeed = .8; // User's speed
const particlePointSize = 2; // User's node size
let timeOffset = 0;
const timeIncrement = 0.1; // User's time increment
// const backgroundColor = '#161618'; // Background is transparent via clear()

// --- Network Connection Configuration ---
const connectParticles = true;
const maxConnectionDistance = 85;
const connectionLineStrokeWeight = 0.5; // Static weight
// Base HSB values (will be adjusted for light/dark)
const connectionLineHue = 30;
const connectionLineSaturation = 100;
const connectionLineBaseBrightness = 70; // For dark mode
const connectionLineAlpha = 35; // Base Alpha (out of 100)

// --- HUD Text ---
const timedText = "SCANNING_ARCHIVE"; // Static text content
const codeUpdateInterval = 5; // How often static HUD BIN/HEX changes
let currentBinary = ""; // Store current code strings for static HUD
let currentHex = "";    // Store current code strings for static HUD
const targetSentence = "Are we really who we say we are"; // Sentence for glitch
const hexCharSubstitutionChance = 0.15; // Chance for glitch

// --- Animated Tracking Box ---
let trackedParticleIndex = -1;
let previousTrackedIndex = -1;
let boxPos;
let isBoxTransitioning = false;
let transitionStartTime = 0;
const transitionDuration = 500;
let nextTrackTime = 0;
const minTrackDuration = 3000;
const maxTrackDuration = 6000;
const trackingBoxSize = 15;
const trackingBoxIdSize = 10;
const trackingBoxCodeSize = 8;
const trackingTextPadding = 5;

// --- Adaptive Colors ---
let isLightMode = false; // Default assumption
let textColor;
let boxStrokeColor;
let baseParticlePointColor;
let baseLinkColor;

// --- Helper Functions ---
function generateRandomBinary(len) {
    let bin = '';
    for (let i = 0; i < len; i++) {
        bin += random() > 0.5 ? '1' : '0';
    }
    return bin;
}

function generateRandomHex(pairs) {
    let hex = '';
    const hexChars = '0123456789ABCDEF';
    for (let i = 0; i < pairs; i++) {
        let h1 = hexChars[floor(random(16))];
        if (random() < hexCharSubstitutionChance) {
            h1 = targetSentence.charAt(floor(random(targetSentence.length)));
        }
        let h2 = hexChars[floor(random(16))];
         if (random() < hexCharSubstitutionChance) {
            h2 = targetSentence.charAt(floor(random(targetSentence.length)));
        }
        hex += h1 + h2 + ' ';
    }
    return hex.trim();
}

function generateCaseID() {
    let year = floor(random(2001, 2024));
    let month = floor(random(1, 13));
    let day = floor(random(1, 29));
    let yearStr = str(year);
    let monthStr = nf(month, 2);
    let dayStr = nf(day, 2);
    return `Case_${yearStr}_${monthStr}_${dayStr}`;
}


// --- Particle Class (Adds ID) ---
class Particle {
     constructor() {
        this.pos = createVector(random(width), random(height));
        this.prevPos = this.pos.copy();
        this.vel = createVector(0, 0);
        this.id = generateCaseID();
    }

    update() {
        let angle = noise(this.pos.x * noiseScale, this.pos.y * noiseScale, timeOffset) * TWO_PI * 2;
        this.vel = p5.Vector.fromAngle(angle);
        this.vel.mult(particleSpeed);
        this.updatePrev();
        this.pos.add(this.vel);
    }

    show() {
        // Use dynamically set color
        stroke(baseParticlePointColor);
        strokeWeight(particlePointSize);
        point(this.pos.x, this.pos.y);
    }

    edges() {
        let wrapped = false;
        if (this.pos.x > width) { this.pos.x = 0; wrapped = true; }
        if (this.pos.x < 0) { this.pos.x = width; wrapped = true; }
        if (this.pos.y > height) { this.pos.y = 0; wrapped = true; }
        if (this.pos.y < 0) { this.pos.y = height; wrapped = true; }
        if (wrapped) { this.updatePrev(); }
    }

    updatePrev() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

} // End Particle Class Definition

// --- Function to set colors based on mode ---
function setColors() {
    // Set color mode - essential for color() interpretation
    colorMode(HSB, 360, 100, 100, 255);

    // Define Base Colors (adjust light mode colors for better contrast if needed)
    let pointP5Alpha = map(90, 0, 100, 0, 255);
    let connectionP5Alpha = map(connectionLineAlpha, 0, 100, 0, 255);

    if (isLightMode) {
        textColor = color(0); // Black text
        boxStrokeColor = color(50); // Dark grey box
        // Darker versions for light mode
        baseParticlePointColor = color(0, 70, 60, pointP5Alpha); // Darker Red/Pink
        baseLinkColor = color(connectionLineHue, 100, 50, connectionP5Alpha); // Darker Orange
    } else {
        textColor = color(255); // White text
        boxStrokeColor = color(255); // White box
        // Original colors for dark mode
        baseParticlePointColor = color(0, 70, 100, pointP5Alpha); // Light Red/Pink point base
        baseLinkColor = color(connectionLineHue, connectionLineSaturation, connectionLineBaseBrightness, connectionP5Alpha); // Orange base
    }
}

// --- p5.js Setup Function ---
function setup() {
    console.log("Animated 2D graph setup started");
    let canvasContainer = document.getElementById('p5-canvas-container');
    if (!canvasContainer) {
        console.error("p5.js Error: Container div with ID 'p5-canvas-container' not found.");
        return;
    }
    let canvasWidth = canvasContainer.offsetWidth;
    let canvasHeight = canvasContainer.offsetHeight;
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-canvas-container');

    // --- Detect Color Scheme ---
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        isLightMode = true;
        console.log("Light mode detected");
    } else {
        isLightMode = false;
        console.log("Dark mode detected");
    }

    // Set colors based on detected mode
    setColors();

    // Initialize particles
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    // Initialize tracking box state
    boxPos = createVector(width / 2, height / 2);
    trackedParticleIndex = -1;
    previousTrackedIndex = -1;
    isBoxTransitioning = false;
    nextTrackTime = millis() + 1000;

    strokeCap(SQUARE);
    textFont('monospace', 12); // Default font
};

// --- p5.js Draw Function ---
function draw() {
    clear(); // Transparent background

    // --- Update Data ---
    timeOffset += timeIncrement;
    for (let i = 0; i < particles.length; i++) { particles[i].update(); particles[i].edges(); }
    if (frameCount % codeUpdateInterval === 0) {
        currentBinary = generateRandomBinary(16);
        currentHex = generateRandomHex(4);
    }

    // --- Timed Tracking Box Target Selection ---
    let currentTime = millis();
    if (currentTime >= nextTrackTime && particles.length > 0) {
        previousTrackedIndex = trackedParticleIndex;
        let newIndex = trackedParticleIndex;
        if (particles.length > 1) { while (newIndex === trackedParticleIndex) { newIndex = floor(random(particles.length)); } }
        else { newIndex = 0; }
        trackedParticleIndex = newIndex;
        isBoxTransitioning = true;
        transitionStartTime = currentTime;
        nextTrackTime = currentTime + random(minTrackDuration, maxTrackDuration);
        console.log(`Switching tracked particle to index: ${trackedParticleIndex}`);
    }

    // --- Update Animated Box Position ---
    if (isBoxTransitioning) {
        let elapsed = currentTime - transitionStartTime;
        let t = constrain(elapsed / transitionDuration, 0, 1);
        let startPos = (previousTrackedIndex !== -1 && previousTrackedIndex < particles.length && particles[previousTrackedIndex]) ? particles[previousTrackedIndex].pos : boxPos;
        let endPos = (trackedParticleIndex !== -1 && trackedParticleIndex < particles.length && particles[trackedParticleIndex]) ? particles[trackedParticleIndex].pos : boxPos;
        boxPos = p5.Vector.lerp(startPos, endPos, t);
        if (t >= 1.0) { isBoxTransitioning = false; }
    } else {
        if (trackedParticleIndex !== -1 && trackedParticleIndex < particles.length && particles[trackedParticleIndex]) {
            boxPos.set(particles[trackedParticleIndex].pos);
        }
    }

    // --- Constrain Box Position ---
    let halfBox = trackingBoxSize / 2;
    let textDrawLeftBound = 10;
    boxPos.x = constrain(boxPos.x, halfBox, width - halfBox);
    boxPos.y = constrain(boxPos.y, halfBox + trackingBoxIdSize + 5, height - halfBox);


    // --- Draw Network Connections ---
    if (connectParticles) {
        stroke(baseLinkColor); // Uses adaptive color
        strokeWeight(connectionLineStrokeWeight);
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let p1 = particles[i]; let p2 = particles[j];
                if(p1 && p2) {
                    let distance = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
                    if (distance < maxConnectionDistance) {
                        line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
                    }
                }
            }
        }
    }

    // --- Draw Particles ---
    for (let i = 0; i < particles.length; i++) { if (particles[i]) { particles[i].show(); } } // show() uses adaptive color

    // --- Draw Tracking Box and Associated Text ---
    let currentTargetParticle = particles[trackedParticleIndex];
    if (currentTargetParticle) {
        push(); // Isolate drawing styles

        // --- Draw the Box ---
        noFill();
        stroke(boxStrokeColor); // Use adaptive color
        strokeWeight(1);
        rectMode(CENTER);
        rect(boxPos.x, boxPos.y, trackingBoxSize, trackingBoxSize);

        // --- Draw Text (ID, BIN, HEX) Beside Box ---
        fill(textColor); // Use adaptive color
        noStroke();

        // Generate NEW codes specifically for the tracking box display each frame
        let boxBinary = generateRandomBinary(16);
        let boxHex = generateRandomHex(4);

        // Decide whether to draw text left or right of the box
        let textX_RightAlign = boxPos.x - trackingBoxSize / 2 - trackingTextPadding;
        let textX_LeftAlign = boxPos.x + trackingBoxSize / 2 + trackingTextPadding;
        let textY_Start = boxPos.y - trackingBoxSize / 2;
        let idWidth = textWidth(currentTargetParticle.id);
        let drawOnRight = false;
        if (textX_RightAlign - idWidth < textDrawLeftBound) { drawOnRight = true; }

        let textX, textY;
        if (drawOnRight) {
            textAlign(LEFT, TOP);
            textX = textX_LeftAlign;
            textY = textY_Start;
        } else {
            textAlign(RIGHT, TOP);
            textX = textX_RightAlign;
            textY = textY_Start;
        }

        // Draw ID
        textSize(trackingBoxIdSize);
        text(currentTargetParticle.id, textX, textY);
        textY += trackingBoxIdSize + 2;

        // Draw BIN/HEX (using locally generated codes)
        textSize(trackingBoxCodeSize);
        text(`B:${boxBinary}`, textX, textY);
        textY += trackingBoxCodeSize + 2;
        text(`H:${boxHex}`, textX, textY);

        pop(); // Restore styles
    }

    // --- Draw Static 2D HUD (Bottom Right) ---
    push();
    fill(textColor); // Use adaptive text color
    noStroke();
    textAlign(RIGHT, BOTTOM);
    textFont('monospace', 12);
    let xPos = width - 15;
    let yPos = height - 15;
    textSize(11);
    // Display the globally updated codes here
    text(`HEX: ${currentHex}`, xPos, yPos);
    yPos -= 14;
    text(`BIN: ${currentBinary}`, xPos, yPos);
    yPos -= 16;
    textSize(12);
    text("Decrypting Archive", xPos, yPos);
    yPos -= 20;
    textSize(14);
    text(timedText, xPos, yPos);
    pop();

}; // End draw


// --- p5.js Window Resized Function (2D Version) ---
function windowResized() {
    console.log("2D Global windowResized triggered");
    let canvasContainer = document.getElementById('p5-canvas-container');
    if (canvasContainer) {
       let newWidth = canvasContainer.offsetWidth;
       let newHeight = canvasContainer.offsetHeight;
       resizeCanvas(newWidth, newHeight);

       // Re-detect color scheme and set colors on resize
       if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
           isLightMode = true;
       } else {
           isLightMode = false;
       }
       setColors(); // Apply adaptive colors

       // Re-initialize particles
       console.log("Re-initializing particles for new size");
       particles = [];
       for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle()); // Constructor assigns ID
       }
       // Reset tracking box state
       boxPos = createVector(newWidth / 2, newHeight / 2);
       trackedParticleIndex = -1;
       previousTrackedIndex = -1;
       isBoxTransitioning = false;
       nextTrackTime = millis() + 1000;

    } else {
       console.warn("p5.js Warning: Could not find container 'p5-canvas-container' on resize.");
    }
}; // End windowResized
