import { art, imageURL } from "./art.js";
import { enhanceSelect } from "./select-ui.js";
const $ = (s) => document.querySelector(s),
  canvas = $("#altar"),
  ctx = canvas.getContext("2d");
const schemes = {
  3: [
    [
      "Cielo",
      "Representa el plano espiritual y la esperanza de descanso del alma. Las imágenes religiosas y las cruces expresan la fe de quien dedica el altar.",
      ["saint", "cross"],
    ],
    [
      "Purificación",
      "Representa el purgatorio en esta variante: un espacio de purificación antes del descanso. La sal simboliza la pureza, las velas iluminan el camino y el copal limpia simbólicamente el lugar.",
      ["salt", "candle", "incense"],
    ],
    [
      "Tierra",
      "Representa el mundo de los vivos y los vínculos que permanecen. Los alimentos recuerdan los gustos de la persona; aquí colocamos también su retrato como adaptación de este homenaje digital.",
      ["bread", "food", "water", "skull", "photo"],
    ],
  ],
  7: [
    [
      "Guía espiritual",
      "Se dedica a la guía espiritual del alma. Una imagen religiosa representa la protección y la fe que acompañan su recorrido hacia el descanso.",
      ["saint"],
    ],
    [
      "Oración",
      "Se dedica a las ánimas y a las oraciones por su descanso. La luz de las veladoras orienta su camino; en este editor también se permite copal como símbolo de purificación.",
      ["candle", "incense"],
    ],
    [
      "Purificación",
      "La sal representa la purificación y, según la tradición, ayuda a preservar al alma durante su viaje de ida y vuelta.",
      ["salt"],
    ],
    [
      "El pan",
      "El pan de muerto es una ofrenda fraternal: expresa el cariño y la generosidad de compartir alimento con quienes recordamos.",
      ["bread"],
    ],
    [
      "El alimento",
      "Recibe a la persona con los alimentos que disfrutaba en vida. El agua calma simbólicamente la sed después del camino y la comida mantiene el vínculo con sus recuerdos.",
      ["food", "water", "skull"],
    ],
    [
      "El recuerdo",
      "El retrato identifica a la persona a quien dedicamos la ofrenda. Es un espacio para honrar su vida y mantener presente su memoria.",
      ["photo"],
    ],
    [
      "El descanso",
      "Una cruz, tradicionalmente hecha con semillas, flores o ceniza, expresa la esperanza de descanso para el alma y cierra este recorrido simbólico.",
      ["cross"],
    ],
  ],
};
let state = { levels: 3, tier: 0, items: [], photo: null },
  selected = null,
  photoImage = null,
  db = null,
  drag = null,
  saveTimer,
  revision = 0;
const images = {};
const pickers = ["tier", "objects"].map((id) =>
  enhanceSelect(document.getElementById(id)),
);
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
function notify(text) {
  $("#message").textContent = text;
}
function allowed(tier) {
  return [...schemes[state.levels][tier][2], "flower", "paper"];
}
function box(tier) {
  const height = state.levels === 3 ? 190 : 100,
    top = state.levels === 3 ? 310 : 180;
  return {
    x: 160 - tier * (state.levels === 3 ? 45 : 14),
    y: top + tier * height,
    w: 680 + tier * (state.levels === 3 ? 90 : 28),
    h: height,
  };
}
function itemSize() {
  return state.levels === 3 ? 105 : 75;
}
function position(item) {
  const b = box(item.tier),
    s = itemSize();
  return {
    x: b.x + s / 2 + item.x * (b.w - s),
    y: b.y + s / 2 + item.y * (b.h - s - 12),
    s,
  };
}
function draw() {
  ctx.clearRect(0, 0, 1000, 1100);
  ctx.fillStyle = "#291c35";
  ctx.fillRect(0, 0, 1000, 1100);
  const glow = ctx.createRadialGradient(500, 480, 30, 500, 480, 650);
  glow.addColorStop(0, "#654047");
  glow.addColorStop(1, "#291c35");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1000, 1100);
  ctx.strokeStyle = "#9c705148";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(60, 55, 880, 990, [400, 400, 8, 8]);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(80, 75, 840, 950, [390, 390, 8, 8]);
  ctx.stroke();
  ctx.fillStyle = "#e6c79a";
  ctx.textAlign = "center";
  ctx.font = "italic 30px Georgia";
  ctx.fillText("Donde vive el recuerdo", 500, 105);
  ctx.font = "12px sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("UNA OFRENDA HECHA CON AMOR", 500, 135);
  ctx.letterSpacing = "0px";
  for (let t = 0; t < state.levels; t++) {
    const b = box(t);
    ctx.fillStyle = t === state.tier ? "#ad704f" : "#8d5c45";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = "#c59164";
    ctx.fillRect(b.x, b.y, b.w, 10);
    ctx.fillStyle = "#663f37";
    ctx.fillRect(b.x, b.y + b.h - 15, b.w, 15);
    ctx.strokeStyle = "#e7b98238";
    ctx.strokeRect(b.x + 10, b.y + 17, b.w - 20, b.h - 40);
    if (t === state.tier) {
      ctx.strokeStyle = "#edba65";
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }
    if (!state.items.some((i) => i.tier === t)) {
      ctx.fillStyle = "#f3d9bb80";
      ctx.font = "italic 18px Georgia";
      ctx.fillText(schemes[state.levels][t][0], 500, b.y + b.h / 2 + 5);
    }
  }
  for (const item of state.items) {
    const p = position(item);
    ctx.save();
    ctx.shadowColor = "#130e204d";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    if (item.type === "photo" && photoImage) {
      ctx.fillStyle = "#d2a552";
      ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      ctx.fillStyle = "#f5dfac";
      ctx.fillRect(p.x - p.s / 2 + 5, p.y - p.s / 2 + 5, p.s - 10, p.s - 10);
      const side = Math.min(photoImage.width, photoImage.height);
      ctx.drawImage(
        photoImage,
        (photoImage.width - side) / 2,
        (photoImage.height - side) / 2,
        side,
        side,
        p.x - p.s / 2 + 10,
        p.y - p.s / 2 + 10,
        p.s - 20,
        p.s - 20,
      );
    } else if (images[item.type])
      ctx.drawImage(images[item.type], p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
    ctx.restore();
    if (selected === item.id) {
      ctx.strokeStyle = "#fff3c4";
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(p.x - p.s / 2 - 3, p.y - p.s / 2 - 3, p.s + 6, p.s + 6);
      ctx.setLineDash([]);
    }
  }
  ctx.fillStyle = "#dec59f";
  ctx.font = "italic 23px Georgia";
  ctx.fillText("Siempre en nuestra memoria", 500, 1000);
  ctx.fillStyle = "#c09b7b";
  ctx.font = "12px sans-serif";
  ctx.fillText("DÍA DE MUERTOS", 500, 1030);
}
function refresh() {
  document
    .querySelectorAll("[name=levels]")
    .forEach((r) => (r.checked = +r.value === state.levels));
  $("#tier").replaceChildren(
    ...schemes[state.levels].map(
      (row, t) => new Option(`${t + 1}. ${row[0]}`, t),
    ),
  );
  $("#tier").value = state.tier;
  $("#meaning").textContent = schemes[state.levels][state.tier][1];
  $("#meaning-title").textContent =
    `${state.tier + 1}. ${schemes[state.levels][state.tier][0]}`;
  $("#catalog").replaceChildren(
    ...allowed(state.tier)
      .filter((k) => k !== "photo")
      .map((key) => {
        const b = document.createElement("button");
        b.className = "decoration";
        b.innerHTML = `<img alt="" src="${imageURL(key)}"><span>${art[key].name}</span>`;
        b.title = `Agregar ${art[key].name}`;
        b.onclick = () => add(key);
        return b;
      }),
  );
  if (allowed(state.tier).includes("photo")) {
    const b = document.createElement("button");
    b.className = "decoration";
    b.textContent = "Agregar retrato";
    b.onclick = () => (state.photo ? add("photo") : $("#photo").click());
    $("#catalog").append(b);
  }
  $("#objects").replaceChildren(
    new Option("Ninguno seleccionado", ""),
    ...state.items.map(
      (i, n) =>
        new Option(
          `${n + 1}. ${i.type === "photo" ? "Retrato" : art[i.type].name} · nivel ${i.tier + 1}`,
          i.id,
        ),
    ),
  );
  $("#objects").value = selected || "";
  $("#remove").disabled = !selected;
  pickers.forEach((sync) => sync());
  draw();
}
function add(type) {
  if (!allowed(state.tier).includes(type)) return;
  if (state.items.length >= 100) {
    notify("Puedes colocar hasta 100 objetos en tu altar.");
    return;
  }
  const item = {
    id: crypto.randomUUID(),
    type,
    tier: state.tier,
    x: 0.5,
    y: 0.5,
  };
  state.items.push(item);
  selected = item.id;
  refresh();
  save();
}
function save() {
  revision++;
  $("#save-state").textContent = "Guardando…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persist, 300);
}
function persist() {
  if (!db) {
    $("#save-state").textContent = "Sin guardado local";
    return;
  }
  const version = revision;
  try {
    const tx = db.transaction("draft", "readwrite");
    tx.objectStore("draft").put(structuredClone(state), "current");
    tx.oncomplete = () => {
      if (version === revision)
        $("#save-state").textContent = "Guardado en este dispositivo";
    };
    tx.onerror = () => {
      $("#save-state").textContent = "No se pudo guardar";
      notify(
        "No hay espacio o el almacenamiento está bloqueado. Descarga tu imagen antes de salir.",
      );
    };
  } catch {
    $("#save-state").textContent = "Sin guardado local";
  }
}
function valid(s) {
  return (
    s &&
    [3, 7].includes(s.levels) &&
    Number.isInteger(s.tier) &&
    s.tier >= 0 &&
    s.tier < s.levels &&
    Array.isArray(s.items) &&
    s.items.length <= 100 &&
    (s.photo === null ||
      (typeof s.photo === "string" && s.photo.startsWith("data:image/"))) &&
    s.items.every(
      (i) =>
        typeof i.id === "string" &&
        Number.isInteger(i.tier) &&
        i.tier >= 0 &&
        i.tier < s.levels &&
        [...schemes[s.levels][i.tier][2], "flower", "paper"].includes(i.type) &&
        Number.isFinite(i.x) &&
        i.x >= 0 &&
        i.x <= 1 &&
        Number.isFinite(i.y) &&
        i.y >= 0 &&
        i.y <= 1,
    )
  );
}
async function storage() {
  try {
    db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("siempre-altar", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("draft");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const saved = await new Promise((resolve, reject) => {
      const req = db.transaction("draft").objectStore("draft").get("current");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (valid(saved)) {
      state = saved;
      if (state.photo) photoImage = await loadImage(state.photo);
    } else if (saved)
      notify("El borrador no es compatible. Puedes empezar un nuevo altar.");
  } catch {
    notify(
      "No se pudo recuperar el guardado local. Puedes crear y descargar tu altar.",
    );
  }
  refresh();
}
document.querySelectorAll("[name=levels]").forEach(
  (r) =>
    (r.onchange = () => {
      if (
        state.items.length &&
        !confirm(
          "Cambiar la estructura quitará las ofrendas colocadas. Tu foto se conservará. ¿Continuar?",
        )
      ) {
        refresh();
        return;
      }
      state.levels = +r.value;
      state.tier = 0;
      state.items = [];
      selected = null;
      refresh();
      save();
    }),
);
$("#tier").onchange = () => {
  state.tier = +$("#tier").value;
  selected = null;
  refresh();
  save();
};
$("#photo").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 15 * 1024 * 1024
  ) {
    notify("Elige una imagen JPG, PNG o WebP de hasta 15 MB.");
    e.target.value = "";
    return;
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url),
      small = document.createElement("canvas"),
      scale = Math.min(1, 1200 / Math.max(img.width, img.height));
    small.width = Math.round(img.width * scale);
    small.height = Math.round(img.height * scale);
    small.getContext("2d").drawImage(img, 0, 0, small.width, small.height);
    state.photo = small.toDataURL("image/jpeg", 0.88);
    photoImage = await loadImage(state.photo);
    state.tier = state.levels === 3 ? 2 : 5;
    if (!state.items.some((i) => i.type === "photo")) add("photo");
    else {
      refresh();
      save();
    }
    notify("Fotografía lista. Puedes moverla dentro del nivel del recuerdo.");
  } catch {
    notify("No se pudo abrir esta imagen. Intenta con otra fotografía.");
  } finally {
    URL.revokeObjectURL(url);
    e.target.value = "";
  }
};
function point(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) * 1000) / r.width,
    y: ((e.clientY - r.top) * 1100) / r.height,
  };
}
canvas.onpointerdown = (e) => {
  const q = point(e);
  const item = [...state.items].reverse().find((i) => {
    const p = position(i);
    return Math.abs(q.x - p.x) < p.s / 2 && Math.abs(q.y - p.y) < p.s / 2;
  });
  if (item) {
    selected = item.id;
    state.tier = item.tier;
    const p = position(item);
    drag = { item, dx: q.x - p.x, dy: q.y - p.y };
    canvas.setPointerCapture(e.pointerId);
    canvas.focus();
  } else {
    selected = null;
    const t = schemes[state.levels].findIndex((_, t) => {
      const b = box(t);
      return q.y >= b.y && q.y < b.y + b.h && q.x >= b.x && q.x <= b.x + b.w;
    });
    if (t >= 0) state.tier = t;
  }
  refresh();
};
canvas.onpointermove = (e) => {
  if (!drag) return;
  const q = point(e),
    b = box(drag.item.tier),
    s = itemSize();
  drag.item.x = Math.max(
    0,
    Math.min(1, (q.x - drag.dx - b.x - s / 2) / (b.w - s)),
  );
  drag.item.y = Math.max(
    0,
    Math.min(1, (q.y - drag.dy - b.y - s / 2) / (b.h - s - 12)),
  );
  draw();
};
function endDrag() {
  if (drag) {
    drag = null;
    save();
  }
}
canvas.onpointerup = endDrag;
canvas.onpointercancel = endDrag;
canvas.onkeydown = (e) => {
  const item = state.items.find((i) => i.id === selected);
  if (
    !item ||
    !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
  )
    return;
  e.preventDefault();
  item.x = Math.max(
    0,
    Math.min(
      1,
      item.x +
        (e.key === "ArrowRight" ? 0.03 : e.key === "ArrowLeft" ? -0.03 : 0),
    ),
  );
  item.y = Math.max(
    0,
    Math.min(
      1,
      item.y + (e.key === "ArrowDown" ? 0.1 : e.key === "ArrowUp" ? -0.1 : 0),
    ),
  );
  draw();
  save();
};
$("#objects").onchange = () => {
  selected = $("#objects").value || null;
  const item = state.items.find((i) => i.id === selected);
  if (item) state.tier = item.tier;
  refresh();
  canvas.focus();
};
$("#remove").onclick = () => {
  state.items = state.items.filter((i) => i.id !== selected);
  selected = null;
  refresh();
  save();
};
$("#reset").onclick = () => {
  $("#reset-dialog").showModal();
};
$("#confirm-reset").onclick = () => {
  $("#reset-dialog").close();
  state = { levels: state.levels, tier: 0, items: [], photo: null };
  photoImage = null;
  selected = null;
  refresh();
  save();
};
async function exportImage() {
  const old = selected,
    tier = state.tier;
  selected = null;
  state.tier = -1;
  draw();
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  selected = old;
  state.tier = tier;
  draw();
  if (!blob) throw Error("export");
  return blob;
}
function download(blob) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "mi-altar-siempre.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  notify(
    "Imagen preparada. Revisa tus descargas; desde ahí puedes guardarla en Fotos o compartirla.",
  );
}
$("#download").onclick = async () => {
  try {
    download(await exportImage());
  } catch {
    notify("No se pudo generar la imagen. Inténtalo de nuevo.");
  }
};
$("#share").onclick = async () => {
  try {
    const blob = await exportImage(),
      file = new File([blob], "mi-altar-siempre.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] }))
      await navigator.share({
        files: [file],
        title: "Siempre en nuestra memoria",
      });
    else download(blob);
  } catch (e) {
    if (e.name !== "AbortError")
      notify(
        "No se pudo compartir. Usa «Descargar mi altar» y comparte el archivo desde tu dispositivo.",
      );
  }
};
$("#guide").onclick = () => $("#guide-dialog").showModal();
$("#close-guide").onclick = () => $("#guide-dialog").close();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    clearTimeout(saveTimer);
    persist();
  }
});
await Promise.all(
  Object.keys(art).map(async (key) => {
    images[key] = await loadImage(imageURL(key));
  }),
);
await storage();
if ("serviceWorker" in navigator)
  navigator.serviceWorker
    .register("./sw.js")
    .catch(() =>
      notify("El modo sin conexión no está disponible en este navegador."),
    );
