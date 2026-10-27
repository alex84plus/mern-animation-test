const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const healthPlayer = document.getElementById("healthPlayer");
const healthEnemy = document.getElementById("healthEnemy");

const attackButton = document.getElementById("attackButton");
const attackClickButton = document.getElementById("attackClickButton");
const blockButton = document.getElementById("blockButton");
const healButton = document.getElementById("healButton");

const roundTimerDisplay = document.getElementById("roundTimer");
const roundText = document.getElementById("roundText");


const DMGMULT = 0.5;
const BLKMULT = 0.5;
const HEALMULT = 0.5;

const enemyDamage = 10;

let roundClicks = {
    attack: 0,
    block: 0,
    heal: 0
};
let roundNumber = 0;
let combatOver = false;
let windowOpen = false;
let windowTime = 5000;
let roundTimer = null;
let roundEndTime = 0;

//Player display
class Sprite {
    constructor(imageSrc, frameWidth, frameHeight, animations){
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.animations = animations;
        this.currentAnimation = "idle";
        this.frame = 0;
        this.elapsedTime = 0;
    }

    setAnimation(name) {
        if (!this.animations[name]) return;
        if (this.currentAnimation === name) return;
        this.currentAnimation = name;
        this.frame = 0;
        this.elapsedTime = 0;

    }

    update(time){
        const animation = this.animations[this.currentAnimation];
        this.elapsedTime += time;
        const frameDuration = 1000 / animation.fps;
        while(this.elapsedTime >= frameDuration) {
            this.elapsedTime -= frameDuration;
            this.frame++;
            if(this.frame >= animation.frames){
                if(animation.loop === false){
                    this.setAnimation("idle");
                    break;
                } else {
                    this.frame = 0;
                }
            }
        }
    }

    draw (ctx, x, y, scale = 1){
        
        if(!this.image.complete || !this.image.naturalWidth) return;
        const animation = this.animations[this.currentAnimation];

        const srcX = this.frame * this.frameWidth;
        const srcY = animation.row * this.frameHeight;
        if (
            srcX + this.frameWidth > this.image.width ||
            srcY + this.frameHeight > this.image.height
        ) {
            console.warn(
                `Frame outside sprite sheet: ${this.currentAnimation}`,
                this.frame,
                srcX,
                srcY
            );
            return;
        }
        ctx.drawImage(this.image, srcX, srcY, this.frameWidth, this.frameHeight, x, y, this.frameWidth * scale, this.frameHeight * scale);
    }
}

const player = { x: 100, y: 100, scale: 1};

const spritePlayer = new Sprite( "/sprites/spritesheet1.png", 250, 250, {
    idle: {
        row: 1,
        frames: 4,
        fps: 4,
        loop: true
    },
    walk: {
        row: 0,
        frames: 4,
        fps: 4,
        loop: true
    },
    attack: { 
        row: 2,
        frames: 6,
        fps: 4,
        loop: false
    },
    victory: { 
        row: 3,
        frames: 2,
        fps: 4,
        loop: true
    }
});

function debugSpriteSheet() {
    const image = spritePlayer.image;

    console.log("SPRITE SHEET INFO:");
    console.log("Width:", image.naturalWidth);
    console.log("Height:", image.naturalHeight);

    for (const [name, animation] of Object.entries(spritePlayer.animations)) {
        const requiredWidth =
            animation.frames * spritePlayer.frameWidth;

        const requiredHeight =
            (animation.row + 1) * spritePlayer.frameHeight;

        console.log(`${name}:`, {
            row: animation.row,
            frames: animation.frames,
            requiredWidth,
            requiredHeight,
            fits:
                requiredWidth <= image.naturalWidth &&
                requiredHeight <= image.naturalHeight
        });
    }
}

spritePlayer.image.addEventListener("load", debugSpriteSheet);

const background = new Image();
background.src = "/sprites/forest-background.png";

background.onload = () => {
    console.log("Background loaded!");
};

spritePlayer.image.onload = () => {
    console.log("Sprite loaded");
    console.log(spritePlayer.image.width, spritePlayer.image.height);
};

spritePlayer.image.onerror = () => {
    console.error("failed to load sprite")
};

// Player functions
// Reduces player health
function takeDamage(damage){
    healthPlayer.value -= damage;
}
//Reduces enemy health
function damageEnemy(damage){
    healthEnemy.value -= damage;
}
// Action of attack
function dealDamage(totalClicks){
    let totalDamage = totalClicks * DMGMULT;
    damageEnemy(totalDamage);
}

// Interactivity window
// Hide/reveal the clickable button to accumulate damage
// disable buttons at first
function setActionsEnabled(enabled) {
    attackButton.disabled = !enabled;
    blockButton.disabled = !enabled;
    healButton.disabled = !enabled;
}
// start round
function startRound() {
    if (combatOver || windowOpen) return;

    roundNumber++;
    windowOpen = true;
    roundClicks = {
        attack: 0,
        block: 0,
        heal: 0
    };
    roundEndTime = performance.now() + windowTime;
    roundText.textContent = `Round ${roundNumber}`;
    roundTimerDisplay.textContent = "5.0";
    setActionsEnabled(true);
    console.log(`Round ${roundNumber} started`);
    roundTimer = setTimeout(() => {
        endRound(); }, windowTime);
}

function registerAction(action) {
    if(!windowOpen || combatOver) return;

    roundClicks[action]++;
    console.log(`${action}: ${roundClicks[action]}`);
}
// Clicking attack
attackButton.addEventListener('click', () => {
    registerAction("attack");
});
blockButton.addEventListener('click', () => {
    registerAction("block");
});
healButton.addEventListener('click', () => {
    registerAction("heal");
});

function endRound(){
    if (!windowOpen) return;

    clearTimeout(roundTimer);
    windowOpen = false;
    setActionsEnabled(false);

    const attackDamage = roundClicks.attack * DMGMULT;
    const blockedDamage = roundClicks.block * BLKMULT;
    const healingAmount = roundClicks.heal * HEALMULT;

    const incomingDamage = Math.max(0, enemyDamage - blockedDamage);
    healthEnemy.value = Math.max(0, Number(healthEnemy.value) - attackDamage);
    healthPlayer.value = Math.min(Number(healthPlayer.max), Math.max(0, Number(healthPlayer.value) - incomingDamage + healingAmount));

    console.log("Round results:", {
        round: roundNumber,
        clicks: { ...roundClicks },
        attackDamage,
        blockedDamage,
        healingAmount,
        incomingDamage,
        playerHealth: healthPlayer.value,
        enemyHealth: healthEnemy.value
    });

     if (roundClicks.attack > 0) {
    console.log("Attack animation triggered!");

    spritePlayer.setAnimation("attack");

    console.log("Current animation:", spritePlayer.currentAnimation);
    console.log("Current frame:", spritePlayer.frame);
    }
    if(healthEnemy.value <= 0 || healthPlayer.value <= 0){
        combatOver = true;
        console.log(healthEnemy.value <= 0 ? "Enemy defeated!" : "Player defeated!");
        return;
    }
    const attackAnimation = spritePlayer.animations.attack;
    const attackDuration = roundClicks.attack > 0 ? attackAnimation.frames / attackAnimation.fps * 1000 : 0;

    setTimeout (() => {
        startRound();
    }, attackDuration + 500);
}

function updateRoundTimer() {
    if (!windowOpen) return;

    const remaining = Math.max(
        0,
        (roundEndTime - performance.now()) / 1000
    );

    roundTimerDisplay.textContent = remaining.toFixed(1);
}

startRound();
// Enemy functions

// Selection screen

// Moves the player to the next stage
function transition(){

}

function combatScene(){

}
function selectionScene(){

}

// Gameplay loop

let lastTime = 0;
function gameLoop(timestamp) {

    updateRoundTimer();

    const time = lastTime
        ? Math.min(timestamp - lastTime, 50)
        : 0;

    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (background.complete && background.naturalWidth > 0) {
    ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
    );
}
    // Update animation
    spritePlayer.update(time);

    // Draw character
    spritePlayer.draw(
        ctx,
        player.x,
        player.y,
        player.scale
    );

    requestAnimationFrame(gameLoop);
}

// Start game
requestAnimationFrame(gameLoop);

setTimeout(() => {
    console.log("TEST: Starting attack animation");
    spritePlayer.setAnimation("attack");
}, 2000);
