const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const playBtn = document.getElementById("play");

const scoreLabel = document.getElementById("score");
const bestLabel = document.getElementById("bestValue");

const bg = new Image();
bg.src = "fon.png";

const headIdle = new Image();
headIdle.src = "efiop1.png";

const headEat = new Image();
headEat.src = "efiop2.png";

const burger = new Image();
burger.src = "burger.png";

let W = 0;
let H = 0;

const player = {
    x: 0,
    y: 0,
    size: 130,
    eat: false,
    timer: 0
};

let score = 0;
let best = Number(localStorage.getItem("best") || 0);
bestLabel.textContent = best;

const burgers = [];

function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;

    player.y = H - player.size - 20;
}

window.addEventListener("resize", resize);

function spawnBurger() {

    burgers.push({
        x: Math.random() * (W - 80),
        y: -Math.random() * H,
        size: 70,
        speed: 1 + Math.random()
    });

}

function startGame() {

    menu.classList.add("hidden");

    burgers.length = 0;

    score = 0;

    scoreLabel.textContent = "🍔 0";

    for (let i = 0; i < 7; i++) {
        spawnBurger();
    }

}

playBtn.onclick = startGame;

canvas.addEventListener("touchmove", e => {

    player.x = e.touches[0].clientX - player.size / 2;

    player.x = Math.max(
        0,
        Math.min(player.x, W - player.size)
    );

});

canvas.addEventListener("mousemove", e => {

    player.x = e.clientX - player.size / 2;

    player.x = Math.max(
        0,
        Math.min(player.x, W - player.size)
    );

});

function update() {

    burgers.forEach(b => {

        b.y += b.speed;

        if (b.y > H + 100) {

            b.y = -120;
            b.x = Math.random() * (W - 80);

        }

        const dx =
            (player.x + player.size / 2) -
            (b.x + b.size / 2);

        const dy =
            (player.y + player.size / 2) -
            (b.y + b.size / 2);

        if (Math.hypot(dx, dy) < 75) {

            score++;

            scoreLabel.textContent =
                "🍔 " + score;

            player.eat = true;
            player.timer = 10;

            if (score > best) {

                best = score;
                bestLabel.textContent = best;
                localStorage.setItem("best", best);

            }

            tg?.HapticFeedback?.impactOccurred("light");

            b.y = -120;
            b.x = Math.random() * (W - 80);

        }

    });

    if (player.timer > 0) {

        player.timer--;

    } else {

        player.eat = false;

    }

}
function draw() {

    ctx.clearRect(0, 0, W, H);

    ctx.drawImage(bg, 0, 0, W, H);

    burgers.forEach(b => {

        ctx.drawImage(
            burger,
            b.x,
            b.y,
            b.size,
            b.size
        );

    });

    const img = player.eat ? headEat : headIdle;

    ctx.drawImage(
        img,
        player.x,
        player.y,
        player.size,
        player.size
    );

}

function loop() {

    update();

    draw();

    requestAnimationFrame(loop);

}

function preload() {

    const images = [
        bg,
        headIdle,
        headEat,
        burger
    ];

    let loaded = 0;

    images.forEach(img => {

        const done = () => {

            loaded++;

            if (loaded === images.length) {

                resize();

                player.x = (W - player.size) / 2;

                loop();

            }

        };

        if (img.complete) {
            done();
        } else {
            img.onload = done;
        }

    });

}

preload();

setInterval(() => {

    if (burgers.length < 12) {

        spawnBurger();

    }

}, 7000);

document.addEventListener("touchmove", e => {

    e.preventDefault();

}, { passive: false });

window.addEventListener("blur", () => {

    player.eat = false;

});

window.addEventListener("load", resize);
