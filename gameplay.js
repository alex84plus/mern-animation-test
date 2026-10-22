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