const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

const gravity = 0.6;

class Player {
  constructor() {
    this.width = 30;
    this.height = 50;
    this.x = 50;
    this.y = canvas.height - this.height;
    this.vx = 0;
    this.vy = 0;
    this.speed = 4;
    this.jumping = false;
  }
  update() {
    if(keys["a"] || keys["arrowleft"]) this.vx = -this.speed;
    else if(keys["d"] || keys["arrowright"]) this.vx = this.speed;
    else this.vx = 0;

    if((keys["w"] || keys["arrowup"] || keys[" "]) && !this.jumping) {
      this.vy = -12;
      this.jumping = true;
    }

    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Prevent falling below canvas
    if(this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.vy = 0;
      this.jumping = false;
    }
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
  draw(){
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Define 5 levels
const levels = [
  [{x:0,y:350,w:800,h:50},{x:200,y:300,w:100,h:20},{x:400,y:250,w:100,h:20}],
  [{x:0,y:350,w:800,h:50},{x:150,y:280,w:80,h:20},{x:350,y:230,w:80,h:20},{x:600,y:180,w:100,h:20}],
  [{x:0,y:350,w:800,h:50},{x:120,y:300,w:60,h:20},{x:300,y:250,w:60,h:20},{x:500,y:200,w:60,h:20},{x:700,y:150,w:80,h:20}],
  [{x:0,y:350,w:800,h:50},{x:100,y:300,w:50,h:20},{x:250,y:260,w:50,h:20},{x:400,y:220,w:50,h:20},{x:550,y:180,w:50,h:20},{x:700,y:140,w:80,h:20}],
  [{x:0,y:350,w:800,h:50},{x:150,y:300,w:50,h:20},{x:300,y:260,w:50,h:20},{x:450,y:220,w:50,h:20},{x:600,y:180,w:50,h:20},{x:750,y:140,w:50,h:20}]
];

let currentLevel = 0;
let player = new Player();
let platforms = [];

function loadLevel(n){
  platforms = [];
  levels[n].forEach(p=>platforms.push(new Platform(p.x,p.y,p.w,p.h)));
  player.x = 50;
  player.y = canvas.height - player.height;
  player.vx = 0;
  player.vy = 0;
}

loadLevel(currentLevel);

function checkCollision(){
  platforms.forEach(p=>{
    if(player.x + player.width > p.x && player.x < p.x + p.width &&
       player.y + player.height > p.y && player.y + player.height < p.y + p.height + player.vy) {
      player.y = p.y - player.height;
      player.vy = 0;
      player.jumping = false;
    }
  });
}

function checkLevelComplete(){
  if(player.x > canvas.width){
    currentLevel++;
    if(currentLevel < levels.length){
      loadLevel(currentLevel);
      document.getElementById("message").innerText = "Level " + (currentLevel + 1);
    } else {
      document.getElementById("message").innerText = "🎉 You beat the game! Your code: CODE1234 🎉";
    }
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  player.update();
  checkCollision();
  checkLevelComplete();
  
  player.draw();
  platforms.forEach(p=>p.draw());
  
  requestAnimationFrame(animate);
}

animate();
