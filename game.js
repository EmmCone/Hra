// =============================
// Nastavení plátna
// =============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// =============================
// Načtení obrázků
// =============================
const playerImg = new Image();
playerImg.src = "tatka.png";

const itemImgs = {
  Klimatex: "klimatex.png",
  Dates: "dates.png",
  French: "french.png"
};

const itemsImages = {};
for (let key in itemImgs) {
  const img = new Image();
  img.src = itemImgs[key];
  itemsImages[key] = img;
}

// =============================
// Hráč
// =============================
const player = {
  x: WIDTH / 2 - 50,   // zvýšeno pro lepší rozlišení
  y: HEIGHT / 2 - 50,
  width: 100,          // původně 50
  height: 100,
  speed: 5
};

// =============================
// Předměty
// =============================
const itemTypes = Object.keys(itemsImages);
const items = [];

for (let i = 0; i < 8; i++) {
  const name = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const rect = {
    name: name,
    x: Math.random() * (WIDTH - 60 - 50) + 50,
    y: Math.random() * (HEIGHT - 60 - 50) + 50,
    width: 60,   // původně 30
    height: 60
  };
  items.push(rect);
}

// =============================
// Inventář
// =============================
const inventory = [];

// =============================
// Ovládání kláves
// =============================
const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup",   (e) => keys[e.key] = false);

// =============================
// Hlavní smyčka hry
// =============================
function gameLoop() {
  // Čištění obrazovky
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Hladké škálování obrázků
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Pohyb hráče
  if (keys["ArrowLeft"])  player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowUp"])    player.y -= player.speed;
  if (keys["ArrowDown"])  player.y += player.speed;

  // Omezit pohyb hráče na okno
  player.x = Math.max(0, Math.min(WIDTH - player.width, player.x));
  player.y = Math.max(0, Math.min(HEIGHT - player.height, player.y));

  // Vykreslit hráče
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Vykreslit předměty + kolize
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    ctx.drawImage(itemsImages[it.name], it.x, it.y, it.width, it.height);

    if (isColliding(player, it)) {
      inventory.push(it.name);
      items.splice(i, 1);
    }
  }

  // Inventář
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Inventář: " + inventory.join(", "), 10, 25);

  requestAnimationFrame(gameLoop);
}

// Kontrola kolize
function isColliding(a, b) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

// Spustit hru
gameLoop();