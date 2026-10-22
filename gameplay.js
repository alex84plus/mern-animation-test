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
}

const spritePlayer = new Sprite( "/sprites/player.png", 250, 250, {
    idle: {
        row: 2,
        frames: 2,
        fps: 4
    }
    walk: {
        row: 0,
        frames: 4,
        fps: 4
    }
    attack: { 
        row: 0,
        frames: 4,
        fps: 4
    }
})

// Player functions
// Reduces player health
function takeDamage(damage){
    healthPlayer.value -= damage;
}
// Clicking attack
attackButton.addEventListener('click', () => {
    showClicks();
    dealDamage(totalClicks);
});
// Action of attack
function dealDamage(totalClicks){
    let totalDamage = totalClicks * DMGMULT;
    damageEnemy(totalDamage);
}
// Interactivity window
// Hide/reveal the clickable button to accumulate damage
function showClicks(){
    windowOpen = true;
    attackClickButton.classList.toggle('hidden');
    setTimeout(() => {
        windowOpen = false;
        attackClickButton.classList.toggle('hidden');
    }, windowTime)
}
// Calculating clicks
attackClickButton.addEventListener('click', () => {
    if(windowOpen){
        totalClicks++;
    }
});

// Enemy functions

// Selection screen
function

// Gameplay loop
// Moves the player to the next stage
function transition(){

}

function combatScene(){

}
function selectionScene(){

}