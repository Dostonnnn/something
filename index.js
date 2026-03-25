// Ekranlar orasida o'tish
function nextScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");

  // Xaritalarni yuklash
  if (screenId === "main-screen") setTimeout(initMainMap, 100);
  if (screenId === "status-screen") setTimeout(initStatusMap, 100);
}

// Side Menu
function toggleMenu() {
  const menu = document.getElementById("side-menu");
  const overlay = document.getElementById("overlay");
  const isOpen = menu.classList.contains("open");

  menu.classList.toggle("open");
  overlay.style.display = isOpen ? "none" : "block";
}

// Tarif tanlash
function selectT(el) {
  document
    .querySelectorAll(".tariff-box")
    .forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
}

// Buyurtmani tasdiqlash
function confirmOrder() {
  nextScreen("status-screen");
}

// Yandex Maps - Asosiy
function initMainMap() {
  document.getElementById("map-main").innerHTML = "";
  ymaps.ready(() => {
    new ymaps.Map("map-main", {
      center: [41.311, 69.24],
      zoom: 14,
      controls: [],
    });
  });
}

// Yandex Maps - Status
function initStatusMap() {
  document.getElementById("map-status").innerHTML = "";
  ymaps.ready(() => {
    const map = new ymaps.Map("map-status", {
      center: [41.311, 69.24],
      zoom: 15,
      controls: [],
    });
    const car = new ymaps.Placemark(
      [41.315, 69.245],
      {},
      {
        preset: "islands#violetAutoIcon",
      },
    );
    map.geoObjects.add(car);
  });
}
