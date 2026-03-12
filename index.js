// const elSpan = document.querySelector(".container-keycode");
// const elMainCode = document.querySelector(".container-main-code");
// const elKey = document.querySelector(".container-cards-card-key");
// const elLocation = document.querySelector(".container-cards-card-location");
// const elCode = document.querySelector(".container-cards-card-code");
// const elWhich = document.querySelector(".container-cards-card-which");
// const elDes = document.querySelector(".container-cards-card-des");
// window.addEventListener("keyup", (title) => {
//   elSpan.innerHTML = title.keyCode;
//   console.log(title);
// });
// window.addEventListener("keyup", (title) => {
//   elMainCode.innerHTML = title.keyCode;
// });
// window.addEventListener("keyup", (key) => {
//   elKey.innerHTML = key.key;
// });
// window.addEventListener("keyup", (location) => {
//   elLocation.innerHTML = location.location;
// });
// window.addEventListener("keyup", (code) => {
//   elCode.innerHTML = code.code;
// });
// window.addEventListener("keyup", (which) => {
//   elWhich.innerHTML = which.which;
// });

const button = document.querySelector(".btn");
const input = document.querySelector(".input");
button.addEventListener("click", () => {
  console.log("Button clicked!");
});

button.addEventListener("dblclick", () => {
  console.log("Double clicked!");
});

button.addEventListener("mouseover", () => {
  button.style.backgroundColor = "yellow";
});

button.addEventListener("mouseout", () => {
  button.style.backgroundColor = "yellow";
});

// document.addEventListener('mousemove', (e) => {
//   console.log(`X: ${e.clientX}, Y: ${e.clientY}`);
// });

button.addEventListener("mousedown", () => {
  console.log("Mouse button down!");
});

document.addEventListener("mouseup", () => {
  console.log("Mouse button up!");
});

document.addEventListener("keydown", (e) => {
  console.log(`Pressed: ${e.key}`);
});

document.addEventListener("keyup", (e) => {
  console.log(`Released: ${e.key}`);
});

document.addEventListener("keypress", (e) => {
  console.log(`Char pressed: ${e.key}`);
});

button.addEventListener("focus", () => {
  console.log("Input focused!");
});

button.addEventListener("blur", () => {
  console.log("Input blurred!");
});

input.addEventListener("input", () => {
  console.log(input.value);
});

input.addEventListener("input", () => {
  console.log(input.value);
});

window.addEventListener("resize", () => {
  console.log("Window resized!");
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  console.log("Right click detected!");
});

button.addEventListener("drag", () => {
  console.log("Dragging...");
});

button.addEventListener("drop", (e) => {
  e.preventDefault();
  console.log("Dropped!");
});
