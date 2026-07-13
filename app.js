const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreLabel = document.getElementById("score");
const bestLabel = document.getElementById("bestValue");

const bg = new Image();
bg.src = "fon.png";

const headIdle = new Image();
headIdle.src = "efiop1.png";

const headEat = new Image();
headEat.src = "efiop2.png";

const burgerImg = new Image();
burgerImg.src = "burger.png";

let W = 0;
let H = 0;

let score = 0;
let best = Number(localStorage.getItem("best") || 0);

bestLabel.textContent = best;

const player = {
    x: 0,
    y: 0,
    size: 130,
    eat: false,
    timer: 0
};

const burgers = [];

function resize() {

    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;

    player.y = H - player.size - 20;

}

window.addEventListener("resize", resize);

function spawnBurger() {

    burgers.push({

        x: Math.random() * (W - 70),

        y: -Math.random() * H,

        size: 70,

        speed: 0.8 + Math.random() * 0.8

    });

}

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

        if (b.y > H + 80) {

            b.y = -80;
            b.x = Math.random() * (W - 70);

        }

        const dx =
            (player.x + player.size / 2) -
            (b.x + b.size / 2);

        const dy =
            (player.y + player.size / 2) -
            (b.y + b.size / 2);

        if (Math.hypot(dx, dy) < 75) {

            score++;

            scoreLabel.textContent = "🍔 " + score;

            player.eat = true;
            player.timer = 10;

            if (score > best) {

                best = score;

                bestLabel.textContent = best;

                localStorage.setItem("best", best);

            }

            tg?.HapticFeedback?.impactOccurred("light");

            b.y = -80;
            b.x = Math.random() * (W - 70);

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
            burgerImg,
            b.x,
            b.y,
            b.size,
            b.size
        );

    });

    const head = player.eat ? headEat : headIdle;

    ctx.drawImage(
        head,
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

function startGame() {

    resize();

    player.x = (W - player.size) / 2;

    burgers.length = 0;

    for (let i = 0; i < 8; i++) {

        spawnBurger();

    }

    loop();

}

function preload() {

    const images = [
        bg,
        headIdle,
        headEat,
        burgerImg
    ];

    let loaded = 0;

    function ready() {

        loaded++;

        if (loaded === images.length) {

            startGame();

        }

    }

    images.forEach(img => {

        if (img.complete) {

            ready();

        } else {

            img.onload = ready;

        }

    });

}

preload();

document.addEventListener("touchmove", e => {

    e.preventDefault();

}, {
    passive: false
});

window.addEventListener("blur", () => {

    player.eat = false;

});
