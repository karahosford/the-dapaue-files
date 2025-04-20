// brain_2d_animated.js - Animated 2D Network Graph (HUD Right, Tracking Box Info Added)
console.log("brain_2d_animated.js loading (2D Global Mode)");

// --- Sketch Configuration (Global Scope) ---
let particles = [];
const numParticles = 200; // User's particle count
const noiseScale = 1; // User's noise scale
const particleSpeed = .8; // User's speed
const particlePointSize = 2; // User's node size
let timeOffset = 0;
const timeIncrement = 0.1; // User's time increment
const backgroundColor = '#161618';

// --- Network Connection Configuration ---
const connectParticles = true;
const maxConnectionDistance = 85;
const connectionLineStrokeWeight = 0.5; // Static weight
const connectionLineHue = 30;
const connectionLineSaturation = 100;
const connectionLineBaseBrightness = 70;
const connectionLineAlpha = 35; // Base Alpha (out of 100)

// --- HUD Text ---
const timedText = "SCANNING_ARCHIVE"; // Static text content
const codeUpdateInterval = 5; // How often BIN/HEX changes
let currentBinary = ""; // Store current code strings
let currentHex = "";
const targetSentence = "Are we really who we say we are"; // Sentence for glitch
const hexCharSubstitutionChance = 0.15; // Chance for glitch

// --- Animated Tracking Box ---
let trackedParticleIndex = -1; // Index of the current target particle
let previousTrackedIndex = -1; // Index of the previous target particle
let boxPos; // p5.Vector for the animated box position
let isBoxTransitioning = false;
let transitionStartTime = 0;
const transitionDuration = 500; // ms for box movement animation
let nextTrackTime = 0; // When to switch next target
const minTrackDuration = 3000; // ms (3 seconds)
const maxTrackDuration = 6000; // ms (6 seconds)
const trackingBoxSize = 15; // Keep box size reasonable
const trackingBoxIdSize = 10; // Text size for ID beside box
const trackingBoxCodeSize = 8; // Smaller text size for BIN/HEX beside box
const trackingTextPadding = 5; // Padding between box and text

// --- Pre-calculated Colors ---
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
    let year = floor(random(2001, 20));
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
        this.id = generateCaseID(); // Assign unique ID on creation
    }

    update() {
        let angle = noise(this.pos.x * noiseScale, this.pos.y * noiseScale, timeOffset) * TWO_PI * 2;
        this.vel = p5.Vector.fromAngle(angle);
        this.vel.mult(particleSpeed);
        this.updatePrev();
        this.pos.add(this.vel);
    }

    show() {
        stroke(baseParticlePointColor);
        strokeWeight(particlePointSize);
        point(this.pos.x, this.pos.y);
    }

    // Edges wrap around visible canvas bounds
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

    colorMode(HSB, 360, 100, 100, 255);

    // Define Colors
    let pointP5Alpha = map(90, 0, 100, 0, 255);
    let connectionP5Alpha = map(connectionLineAlpha, 0, 100, 0, 255);
    baseParticlePointColor = color(0, 70, 100, pointP5Alpha);
    baseLinkColor = color(connectionLineHue, connectionLineSaturation, connectionLineBaseBrightness, connectionP5Alpha);

    // Initialize particles (constructor assigns ID)
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
    background(backgroundColor);

    // --- Update Data ---
    timeOffset += timeIncrement;
    for (let i = 0; i < particles.length; i++) { particles[i].update(); particles[i].edges(); }
    if (frameCount % codeUpdateInterval === 0) {
        // Generate codes used by both HUD and tracking box text
        currentBinary = generateRandomBinary(32);
        currentHex = generateRandomHex(10);
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
    // Estimate max text width (ID is longest) + padding
    let approxTextWidth = 15 * 8; // Guess based on font size 10
    let leftBound = halfBox + approxTextWidth + trackingTextPadding;
    let rightBound = width - halfBox - approxTextWidth - trackingTextPadding;
    // Ensure box center doesn't push text off edge
    boxPos.x = constrain(boxPos.x, leftBound, rightBound);
    boxPos.y = constrain(boxPos.y, halfBox + 15, height - halfBox - 10);


    // --- Draw Network Connections ---
    if (connectParticles) {
        stroke(baseLinkColor);
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
    for (let i = 0; i < particles.length; i++) { if (particles[i]) { particles[i].show(); } }

    // --- Draw Tracking Box and Associated Text ---
    if (trackedParticleIndex !== -1 && trackedParticleIndex < particles.length && particles[trackedParticleIndex]) {
        let target = particles[trackedParticleIndex];
        push(); // Isolate drawing styles

        // --- Draw the Box ---
        noFill();
        stroke(255); // White outline
        strokeWeight(1);
        rectMode(CENTER);
        rect(boxPos.x, boxPos.y, trackingBoxSize, trackingBoxSize);

        // --- Draw Text (ID, BIN, HEX) Beside Box ---
        fill(255); // White text
        noStroke();

        // Decide whether to draw text left or right of the box
        let textX_RightAlign = boxPos.x - trackingBoxSize / 2 - trackingTextPadding;
        let textX_LeftAlign = boxPos.x + trackingBoxSize / 2 + trackingTextPadding;
        let textY_Start = boxPos.y - trackingBoxSize / 2; // Align top of text block with top of box

        // Check if drawing on the left goes off screen (use a simpler check)
        if (boxPos.x < width * 0.3) { // If box is quite far left
            // Draw on the right instead
            textAlign(LEFT, TOP);
            textSize(trackingBoxIdSize);
            text(target.id, textX_LeftAlign, textY_Start);
            textSize(trackingBoxCodeSize);
            text(`B:${currentBinary.substring(0,12)}`, textX_LeftAlign, textY_Start + trackingBoxIdSize + 2); // Shorten codes
            text(`H:${currentHex.substring(0,9)}`, textX_LeftAlign, textY_Start + trackingBoxIdSize + trackingBoxCodeSize + 4);
        } else {
            // Draw on the left
            textAlign(RIGHT, TOP); // Align text's right edge
            textSize(trackingBoxIdSize);
            text(target.id, textX_RightAlign, textY_Start);
            textSize(trackingBoxCodeSize);
            text(`B:${currentBinary.substring(0,12)}`, textX_RightAlign, textY_Start + trackingBoxIdSize + 2); // Shorten codes
            text(`H:${currentHex.substring(0,9)}`, textX_RightAlign, textY_Start + trackingBoxIdSize + trackingBoxCodeSize + 4);
        }

        pop(); // Restore styles
    }

    // --- Draw Static 2D HUD (Bottom Right) --- MODIFIED
    push();
    fill(255); // White text
    noStroke();
    // MODIFIED: Align text to the RIGHT edge, starting from bottom
    textAlign(RIGHT, BOTTOM);
    textFont('monospace', 12); // Reset font size just in case

    // MODIFIED: Position from bottom-right corner
    let xPos = width - 15; // Padding from right edge
    let yPos = height - 15; // Start from bottom edge

    // Draw "Decrypting Archive" section (with BIN/HEX added back)
    textSize(11);
    text(`HEX: ${currentHex}`, xPos, yPos); // Use full hex string
    yPos -= 14;
    text(`BIN: ${currentBinary}`, xPos, yPos); // Use full binary string
    yPos -= 16;
    textSize(12);
    text("Decrypting Archive", xPos, yPos); // Header

    // Draw "SCANNING_ARCHIVE" section (always visible)
    yPos -= 20; // Space between sections
    textSize(14);
    text(timedText, xPos, yPos); // SCANNING text

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
