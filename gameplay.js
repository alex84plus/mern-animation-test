const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const healthPlayer = document.getElementById("healthPlayer");
const healthEnemy = document.getElementById("healthEnemy");

const attackButton = document.getElementById("attackButton");
const attackClickButton = document.getElementById("attackClickButton");
const blockButton = document.getElementById("blockButton");
const healButton = document.getElementById("healButton");

const DMGMULT = 0.5;

let totalClicks = 0;
let windowOpen = false;
let windowTime = 5000;

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
                this.frame = 0;
            }
        }
    }

    draw (ctx, x, y, scale = 1){
        if(!this.image.complete || !this.image.naturalWidth) return;
        const animation = this.animation[this.currentAnimation];

        const srcX = this.frame * this.frameWidth;
        const srcY = animation.row * this.frameHeight;
        ctx.drawImage(this.image, srcX, srcY, this.frameWidth, this.frameHeight, x, y, this.frameWidth * scale, this.frameHeight * scale);
    }
}

const player = { x: 100, y: 100, scale: 1};

const spritePlayer = new Sprite( "/sprites/spritesheet1.png", 250, 250, {
    idle: {
        row: 2,
        frames: 2,
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
        row: 1,
        frames: 4,
        fps: 4,
        loop: false
    }
});

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
function showClicks(){
    windowOpen = true;
    attackButton.disabled = false;
    attackClickButton.classList.remove('hidden');
    setTimeout(() => {
        windowOpen = false;
        attackClickButton.classList.add('hidden');
        spritePlayer.setAnimation("attack");
        dealDamage(totalClicks);
        attackButton.disabled = false;
    }, windowTime);
}
// Calculating clicks
attackClickButton.addEventListener('click', () => {
    if(windowOpen){
        totalClicks++;
    }
});
// Clicking attack
attackButton.addEventListener('click', () => {
    if(windowOpen || spritePlayer.currentAnimation === "attack") return;
    totalClicks = 0;
    showClicks();
});

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
    const time = lastTime
        ? Math.min(timestamp - lastTime, 50)
        : 0;

    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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