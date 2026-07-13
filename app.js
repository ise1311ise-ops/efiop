const c=game,x=c.getContext("2d");
let w,h,s=0,e=0;

const bg=new Image();bg.src="fon.png";
const h1=new Image();h1.src="efiop1.png";
const h2=new Image();h2.src="efiop2.png";
const bimg=new Image();bimg.src="burger.png";

const p={x:0,y:0,size:130};
const burgers=[];

function rs(){
w=c.width=innerWidth;
h=c.height=innerHeight;
p.y=h-150;
}
onresize=rs;
rs();

for(let i=0;i<7;i++)
burgers.push({
x:Math.random()*w,
y:Math.random()*-h,
v:1+Math.random(),
s:70
});

document.addEventListener("touchmove",a=>{
p.x=a.touches[0].clientX-p.size/2;
});

document.addEventListener("mousemove",a=>{
p.x=a.clientX-p.size/2;
});

function loop(){

x.drawImage(bg,0,0,w,h);

for(let b of burgers){

b.y+=b.v;

if(b.y>h){
b.y=-80;
b.x=Math.random()*w;
}

let dx=p.x-b.x,
dy=p.y-b.y;

if(Math.hypot(dx,dy)<70){

s++;
score.innerHTML="🍔 "+s;

e=8;

b.y=-80;
b.x=Math.random()*w;

}

x.drawImage(bimg,b.x,b.y,b.s,b.s);

}

x.drawImage(e?h2:h1,p.x,p.y,p.size,p.size);

if(e)e--;

requestAnimationFrame(loop);

}

loop();
