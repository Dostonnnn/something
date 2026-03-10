const elSpan = document.querySelector(".container-keycode");
const elMainCode = document.querySelector(".container-main-code");
const elKey = document.querySelector(".container-cards-card-key");
const elLocation = document.querySelector(".container-cards-card-location");
const elCode = document.querySelector(".container-cards-card-code");
const elWhich = document.querySelector(".container-cards-card-which");
const elDes = document.querySelector(".container-cards-card-des");
window.addEventListener("keyup", (title) => {
  elSpan.innerHTML = title.keyCode;
  console.log(title);
});
window.addEventListener("keyup", (title) => {
  elMainCode.innerHTML = title.keyCode;
});
window.addEventListener("keyup", (key) => {
  elKey.innerHTML = key.key;
});
window.addEventListener("keyup", (location) => {
  elLocation.innerHTML = location.location;
});
window.addEventListener("keyup", (code) => {
  elCode.innerHTML = code.code;
});
window.addEventListener("keyup", (which) => {
  elWhich.innerHTML = which.which;
});
