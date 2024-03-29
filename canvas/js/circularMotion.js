var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
//Rectangle
// ctx.fillRect(100, 100, 200, 200);
// ctx.fillRect(250, 160, 200, 200);
// ctx.fillStyle = 'red'
// ctx.fillRect(350, 120, 200, 200);

// //Line
// ctx.beginPath();
// ctx.moveTo(500,300);
// ctx.lineTo(1000,800);
// ctx.strokeStyle = "#f50";
// ctx.stroke()

//Arc
//  ctx.beginPath();
// ctx.arc(800, 800, 30, 0, Math.PI*2,false);
// ctx.stroke();

// var colors = ['blue','red','green'];
// var colornum = 0;
// for (var i = 0; i < 100; i++) {
//     if(colornum<3){
//         ctx.fillStyle = colors[colornum];
//         colornum++;
//     }
//     else{
//         ctx.fillStyle = colors[colornum];
//         colornum=0;
//     }
//     var x = Math.random() * window.innerWidth;
//     var y = Math.random() * window.innerHeight;
//     ctx.beginPath();
//     ctx.arc(x, y, 50, 0, Math.PI*2,false);
//     ctx.fill();
// }
//    
var mouse = {
    x : undefined,
    y : undefined
}

var gravity = 1;
// var friction = 0.7;
window.addEventListener('mousemove',function(e){
    mouse.x = e.x;
    mouse.y = e.y;
})
window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initiate();
})
window.addEventListener('click',function(){
    initiate();
})
function randomIntFromRange(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var colorArray = ['#80a3ff','#3554a7','#1d2b4e']
function randomColor(colors){
    return colorArray[Math.floor(Math.random() * colorArray.length)];
}

function Particle(x, y, radius,color){
    this.x = x;
    this.y = y
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;
    this.distance = randomIntFromRange(50,150)
    this.lastMouse = {x:x, y:y}
    // this.friction = friction;

    this.draw = function(lastPoint){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(lastPoint.x,lastPoint.y);
        ctx.lineTo(this.x,this.y)
        ctx.stroke();
        ctx.closePath();        
    }
    this.update = function(){
        const lastPoint = {x:this.x, y:this.y}
        this.radians += this.velocity

        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

        this.x = this.lastMouse.x +  Math.cos(this.radians) * this.distance;
        this.y = this.lastMouse.y +  Math.sin(this.radians) * this.distance;
        this.draw(lastPoint)
    }
}
var particles;
function initiate(){
    particles = [];
    for(var i = 0; i < 50; i++){
        const radius = randomIntFromRange(1,2)
        particles.push(new Particle(canvas.width / 2, canvas.height / 2, radius, randomColor(colorArray)))
    }
}



function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fillRect(0,0,innerWidth,innerHeight)

    particles.forEach(particle => {
        particle.update();
    })
    // initiate();
}
initiate();
animate();
// animate();