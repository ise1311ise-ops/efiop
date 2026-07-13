const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playBtn = document.getElementById("play");
const menu = document.getElementById("menu");

const scoreLabel = document.getElementById("score");
const bestLabel = document.getElementById("bestValue");

const bg = new Image();
bg.src = "fon.png";

const head1 = new Image();
head1.src = "efiop1.png";

const head2 = new Image();
head2.src = "efiop2.png";

const burgerImg = new Image();
burgerImg.src = "burger.png";

let W;
let H;

let score = 0;

let best = Number(localStorage.getItem("best")) || 0;
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

addEventListener("resize", resize);

function spawnBurger() {

    burgers.push({

        x: Math.random() * (W - 80),

        y: -Math.random() * H,

        size: 70,

        speed: 1 + Math.random()

    });

}

function reset() {

    burgers.length = 0;

    score = 0;

    scoreLabel.textContent = "🍔 " + score;

    for (let i = 0; i < 7; i++) {

        spawnBurger();

    }

}

playBtn.onclick = () => {

    menu.classList.add("hidden");

    reset();

};

canvas.addEventListener("touchmove", e => {

    player.x = e.touches[0].clientX - player.size / 2;

    if (player.x < 0) player.x = 0;

    if (player.x > W - player.size)
        player.x = W - player.size;

});

canvas.addEventListener("mousemove", e => {

    player.x = e.clientX - player.size / 2;

    if (player.x < 0) player.x = 0;

    if (player.x > W - player.size)
        player.x = W - player.size;

});

function update() {

    burgers.forEach(b => {

        b.y += b.speed;

        if (b.y > H + 100) {

            b.y = -100;

            b.x = Math.random() * (W - 80);

        }

        const dx =
            (player.x + player.size / 2) -
            (b.x + b.size / 2);

        const dy =
            (player.y + player.size / 2) -
            (b.y + b.size / 2);

        if (Math.sqrt(dx * dx + dy * dy) < 75) {

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

            tg.HapticFeedback?.impactOccurred("light");

            b.y = -100;

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
            burgerImg,
            b.x,
            b.y,
            b.size,
            b.size
        );

    });

    const img = player.eat ? head2 : head1;

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
        head1,
        head2,
        burgerImg
    ];

    let loaded = 0;

    images.forEach(img => {

        if (img.complete) {

            loaded++;

            if (loaded === images.length) {

                resize();

                player.x = (W - player.size) / 2;

                loop();

            }

        } else {

            img.onload = () => {

                loaded++;

                if (loaded === images.length) {

                    resize();

                    player.x = (W - player.size) / 2;

                    loop();

                }

            };

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

    if (tg.HapticFeedback) {

        tg.HapticFeedback.selectionChanged();

    }

});
