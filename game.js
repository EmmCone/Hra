// =============================
// Nastavení plátna
// =============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const VIEW_WIDTH = canvas.width;      // viditelná plocha
const VIEW_HEIGHT = canvas.height;
const MAP_WIDTH = 2000;               // velikost celé mapy
const MAP_HEIGHT = 2000;

// =============================
// Načtení obrázků
// =============================
const playerImg = new Image();
playerImg.src = "obrazky/tatka.png";       // hráč

const backgroundImg = new Image();
backgroundImg.src = "obrazky/mapa.png";    // sem si můžeš nakreslit celou mapu

const itemImgs = {
  Klimatex: "obrazky/klimatex.png",
  Dates: "obrazky/dates.png",
  French: "obrazky/french.png"
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
  x: MAP_WIDTH / 2,
  y: MAP_HEIGHT / 2,
  width: 80,
  height: 80,
  speed: 6
};

// =============================
// Kamera
// =============================
const camera = { x: 0, y: 0 };

// =============================
// Předměty
// =============================
const items = [];
const itemTypes = Object.keys(itemsImages);

for (let i = 0; i < 10; i++) {
  const name = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  items.push({
    name: name,
    x: Math.random() * (MAP_WIDTH - 60),
    y: Math.random() * (MAP_HEIGHT - 60),
    width: 60,
    height: 60
  });
}

// =============================
// Překážky
// =============================
const obstacles = [
  { x: 400, y: 400, width: 150, height: 150, color: "green" }, // např. strom
  { x: 1000, y: 800, width: 200, height: 100, color: "brown" } // např. kámen
];

// =============================
// Inventář
// =============================
const inventory = [];
const INVENTORY_HEIGHT = 120;

// =============================
// Ovládání
// =============================
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup",   e => keys[e.key] = false);

// =============================
// Kolize
// =============================
function isColliding(a, b) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

// =============================
// Hlavní smyčka hry
// =============================
function gameLoop() {
  // Pohyb hráče
  const oldX = player.x;
  const oldY = player.y;

  if (keys["ArrowLeft"])  player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowUp"])    player.y -= player.speed;
  if (keys["ArrowDown"])  player.y += player.speed;

  // Omezit pohyb na mapu
  player.x = Math.max(0, Math.min(MAP_WIDTH - player.width, player.x));
  player.y = Math.max(0, Math.min(MAP_HEIGHT - player.height, player.y));

  // Kolize s překážkami
  for (let obs of obstacles) {
    if (isColliding(player, obs)) {
      player.x = oldX;
      player.y = oldY;
    }
  }

  // Kamera sleduje hráče
  camera.x = player.x + player.width / 2 - VIEW_WIDTH / 2;
  camera.y = player.y + player.height / 2 - (VIEW_HEIGHT - INVENTORY_HEIGHT) / 2;

  camera.x = Math.max(0, Math.min(MAP_WIDTH - VIEW_WIDTH, camera.x));
  camera.y = Math.max(0, Math.min(MAP_HEIGHT - VIEW_HEIGHT, camera.y));

  // Vykreslení
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Pozadí
  if (backgroundImg.complete) {
    ctx.drawImage(backgroundImg, -camera.x, -camera.y, MAP_WIDTH, MAP_HEIGHT);
  } else {
    ctx.fillStyle = "#a7d08c";
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT - INVENTORY_HEIGHT);
  }

  // Předměty
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    ctx.drawImage(itemsImages[it.name], it.x - camera.x, it.y - camera.y, it.width, it.height);
    if (isColliding(player, it)) {
      inventory.push(it.name);
      items.splice(i, 1);
    }
  }

  // Překážky
  for (let obs of obstacles) {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x - camera.x, obs.y - camera.y, obs.width, obs.height);
  }

  // Hráč
  ctx.drawImage(playerImg, player.x - camera.x, player.y - camera.y, player.width, player.height);

  // Inventář
  drawInventory();

  requestAnimationFrame(gameLoop);
}

// =============================
// Inventář - vykreslení
// =============================
function drawInventory() {
  // Velký rámeček dole
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, VIEW_HEIGHT - INVENTORY_HEIGHT, VIEW_WIDTH, INVENTORY_HEIGHT);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.strokeRect(5, VIEW_HEIGHT - INVENTORY_HEIGHT + 5, VIEW_WIDTH - 10, INVENTORY_HEIGHT - 10);

  // Malé čtverečky pro předměty
  const slotSize = 80;
  const spacing = 10;
  let x = 20;
  let y = VIEW_HEIGHT - INVENTORY_HEIGHT + 20;

  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, slotSize, slotSize);

    if (inventory[i]) {
      ctx.drawImage(itemsImages[inventory[i]], x + 10, y + 10, slotSize - 20, slotSize - 20);
    }
    x += slotSize + spacing;
  }
}

// =============================
// Start hry
// =============================
gameLoop();