let alreadyConfirmed = false;

/* =========================
   STORAGE
========================= */
class Storage {
constructor() {
this.data = {};
}
set(k, v) { this.data[k] = v }
get(k) { return this.data[k] }
all() { return this.data }
}

/* =========================
   FLOW
========================= */
class Flow {
constructor() {
this.steps = [...document.querySelectorAll(".step")];
this.current = 0;
this.bar = document.querySelector(".progress-bar");
this.render();
}

go(i) {
this.steps[this.current].classList.remove("active");
this.current = i;
this.steps[this.current].classList.add("active");
this.render();

if (i === 4) summary.render();
}

next() {
this.go(this.current + 1);
}

render() {
this.bar.style.width =
((this.current + 1) / this.steps.length) * 100 + "%";
}
}

/* =========================
   BOTÃO NÃO
========================= */
const nao = document.getElementById("btn-nao");

const frases = [
"Tem certeza? 😏","Pensa bem 👀","Última chance 🥺","Vai mesmo?",
"Reconsidera ❤️","Não foge 😅","Tá me testando?",
"Eu sabia 😆","Não clica nisso 👀","Você vai se arrepender 😳",
"Respira e pensa","Quase lá 😌","Eu não aceito não 😏",
"Escolhe direito 😤","Você consegue melhor 😌","Última chamada ❤️"
];

function move() {
nao.style.position = "relative";
nao.style.left = Math.random() * 200 + "px";
nao.style.top = Math.random() * 200 + "px";
nao.innerText = frases[Math.floor(Math.random() * frases.length)];
}

nao.onmouseover = move;
nao.onclick = move;
nao.ontouchstart = move;

/* =========================
   CORAÇÕES
========================= */
setInterval(() => {
const h = document.createElement("div");
h.className = "heart";
h.innerText = "❤️";
h.style.left = Math.random() * 100 + "vw";
document.getElementById("hearts").appendChild(h);
setTimeout(() => h.remove(), 6000);
}, 400);

/* =========================
   CALENDÁRIO
========================= */
class Calendar {
constructor(storage, time) {
this.storage = storage;
this.time = time;
this.date = new Date();

this.grid = document.getElementById("calendar-grid");
this.label = document.getElementById("month-label");

this.render();
this.bind();
}

bind() {
document.getElementById("prev-month").onclick = () => {
this.date.setMonth(this.date.getMonth() - 1);
this.render();
};

document.getElementById("next-month").onclick = () => {
this.date.setMonth(this.date.getMonth() + 1);
this.render();
};
}

render() {
this.grid.innerHTML = "";

const y = this.date.getFullYear();
const m = this.date.getMonth();

const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
this.label.innerText = `${months[m]} ${y}`;

const first = new Date(y, m, 1).getDay();
const days = new Date(y, m + 1, 0).getDate();

for (let i = 0; i < first; i++) {
this.grid.innerHTML += "<div></div>";
}

for (let d = 1; d <= days; d++) {
const date = new Date(y, m, d);
const week = date.getDay();

const div = document.createElement("div");
div.className = "day";

div.innerHTML = `${d}<small>${["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][week]}</small>`;

div.onclick = () => {

document.querySelectorAll(".day").forEach(e => e.classList.remove("selected"));
div.classList.add("selected");

this.storage.set("date", date);
this.time.render();

document.getElementById("next-date").disabled = false;
};

this.grid.appendChild(div);
}
}
}

/* =========================
   HORÁRIOS (1 SELEÇÃO)
========================= */
class Time {
constructor(storage) {
this.storage = storage;
this.grid = document.getElementById("time-grid");
}

render() {
this.grid.innerHTML = "";

const date = this.storage.get("date");
if (!date) return;

const weekend = (date.getDay() === 0 || date.getDay() === 6);

const times = weekend
? [13,14,15,16,17,18,19,20,21,22]
: [18,19,20,21,22];

times.forEach(h => {
const div = document.createElement("div");
div.className = "card-item";
div.innerText = h + ":00";

div.onclick = () => {

document.querySelectorAll("#time-grid .card-item")
.forEach(e => e.classList.remove("selected"));

div.classList.add("selected");

this.storage.set("time", h + ":00");

document.getElementById("next-time").disabled = false;
};

this.grid.appendChild(div);
});
}
}

/* =========================
   COMIDA (SEM BUG)
========================= */
class Food {
constructor(storage) {
this.storage = storage;
this.grid = document.getElementById("food-grid");
this.box = document.getElementById("custom-food-box");
this.input = document.getElementById("custom-food-input");

this.customMode = false;

this.input.addEventListener("input", () => {
if (this.customMode) {
this.storage.set("food", this.input.value);
document.getElementById("next-food").disabled =
this.input.value.trim().length === 0;
}
});

this.render();
}

render() {
this.grid.innerHTML = "";

const foods = [
"🍕 Pizza",
"🍔 Burger",
"🍧 Açaí",
"🥩 Churrasco",
"🌮 Tacos",
"🍝 Massa",
"✍️ Outra opção"
];

foods.forEach(f => {
const div = document.createElement("div");
div.className = "card-item";
div.innerText = f;

div.onclick = () => {

document.querySelectorAll("#food-grid .card-item")
.forEach(e => e.classList.remove("selected"));

div.classList.add("selected");

if (f.includes("Outra")) {

this.customMode = true;
this.box.style.display = "block";
this.input.value = "";

this.storage.set("food", "");
document.getElementById("next-food").disabled = true;

} else {

this.customMode = false;
this.box.style.display = "none";

this.storage.set("food", f);
document.getElementById("next-food").disabled = false;
}
};

this.grid.appendChild(div);
});
}
}

/* =========================
   SUMMARY
========================= */
class Summary {
constructor(storage) {
this.storage = storage;
this.el = document.getElementById("summary");
}

render() {
const d = this.storage.all();

this.el.innerHTML = `
<p>📅 ${d.date?.toLocaleDateString()}</p>
<p>🕒 ${d.time}</p>
<p>🍕 ${d.food}</p>
`;
}
}

/* =========================
   CONFIRMAÇÃO FINAL
========================= */
function fireConfetti() {
confetti({
particleCount: 200,
spread: 90,
origin: { y: 0.6 }
});
}

/* =========================
   INIT
========================= */
let summary;

window.onload = () => {

const storage = new Storage();
const flow = new Flow();

const time = new Time(storage);
const calendar = new Calendar(storage, time);
const food = new Food(storage);

summary = new Summary(storage);

/* FLOW */
document.getElementById("btn-sim").onclick = () => flow.next();
document.getElementById("next-date").onclick = () => flow.next();
document.getElementById("next-time").onclick = () => flow.next();
document.getElementById("next-food").onclick = () => flow.next();

/* CONFIRMAR */
document.getElementById("confirm-btn").onclick = async () => {

if (alreadyConfirmed) return;
alreadyConfirmed = true;

const d = storage.all();

fireConfetti();

document.getElementById("confirm-btn").innerText = "Enviado ❤️";

try {
await fetch("/confirm", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
date: d.date?.toLocaleDateString(),
time: d.time,
food: d.food
})
});
} catch (e) {
console.log(e);
}

setTimeout(() => {
alert("Encontro confirmado ❤️");
}, 500);
};

};
