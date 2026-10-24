// Original vector illustrations, shared between the palette and PNG renderer.
const petals = Array.from(
  { length: 18 },
  (_, i) =>
    `<ellipse cx="60" cy="32" rx="10" ry="22" transform="rotate(${i * 20} 60 58)" fill="${i % 2 ? "#ef911d" : "#ffb629"}" stroke="#ce661b" stroke-width="1.5"/>`,
).join("");
const flower = `<path d="M59 80v30M59 101Q25 105 23 85Q48 81 59 101M60 96Q88 71 99 86Q91 106 60 101" fill="#638052" stroke="#36563c" stroke-width="3"/>${petals}<circle cx="60" cy="58" r="16" fill="#ca641c"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${60 + 10 * Math.cos(i)}" cy="${58 + 10 * Math.sin(i)}" r="3" fill="#ffcf55"/>`).join("")}`;
const candle = `<ellipse cx="60" cy="105" rx="35" ry="8" fill="#be8c45"/><path d="M37 45h46v57q-23 12-46 0Z" fill="url(#wax)" stroke="#c7a363" stroke-width="2"/><ellipse cx="60" cy="45" rx="23" ry="7" fill="#ffedbd"/><path d="M44 48v20q5 8 9 0V51M71 50v10q5 8 8 0V48" fill="#fff1c7"/><path d="M60 45V32" stroke="#563d32" stroke-width="3"/><path d="M60 6C85 30 71 39 60 38C43 38 46 23 60 6Z" fill="#f8a52b"/><path d="M60 21Q72 36 60 37Q52 34 60 21" fill="#fff3ac"/>`;
const bread = `<ellipse cx="60" cy="92" rx="49" ry="13" fill="#885129"/><path d="M12 83C8 24 104 18 110 81Q101 109 60 108Q18 104 12 83" fill="url(#bread)" stroke="#93471e" stroke-width="3"/><path d="M29 48Q42 71 87 92M85 45Q64 75 32 94" stroke="#eabb75" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="59" cy="56" r="14" fill="#f4cd8c" stroke="#c98c45" stroke-width="2"/>${Array.from({ length: 24 }, (_, i) => `<circle cx="${22 + ((i * 17) % 77)}" cy="${66 + ((i * 13) % 28)}" r="1" fill="#fff2cb"/>`).join("")}`;
const salt = `<path d="M21 77L48 33Q60 20 72 36l28 41Z" fill="#f9f3de" stroke="#d8cbb8" stroke-width="2"/><path d="M48 34L38 77h21l5-41" fill="#fffdf3"/><path d="M13 72Q60 91 107 72L94 99Q60 116 26 99Z" fill="#418a91" stroke="#205c6a" stroke-width="3"/><path d="M26 86Q60 101 95 86" fill="none" stroke="#e8c57b" stroke-width="3"/>`;
const water = `<path d="M30 18h60l-7 89q-23 10-46 0Z" fill="#a8dfdf" fill-opacity=".5" stroke="#c3eeea" stroke-width="3"/><path d="M33 52Q60 62 87 52l-5 51q-22 9-44 0Z" fill="#69b8c6"/><ellipse cx="60" cy="52" rx="27" ry="6" fill="#abedf0"/><path d="M40 29l4 61" stroke="#fff9e5" stroke-width="5" opacity=".7"/>`;
const cross = `<path d="M49 10h23v30h28v22H72v49H49V62H20V40h29Z" fill="#a56b38" stroke="#6b3e2e" stroke-width="4"/><path d="M60 18v85M28 51h64" stroke="#e3ae60" stroke-width="4"/>${[24, 38, 52, 66, 80, 94].map((y) => `<circle cx="60" cy="${y}" r="4" fill="#edaa30"/>`).join("")}`;
const saint = `<path d="M14 109V53a46 46 0 0 1 92 0v56Z" fill="#c89945" stroke="#825224" stroke-width="4"/><path d="M22 101V53a38 38 0 0 1 76 0v48Z" fill="#30494b"/><circle cx="60" cy="36" r="23" fill="#f1cd77"/><path d="M34 98Q31 56 60 41Q91 58 86 98Z" fill="#57939b" stroke="#d8b457" stroke-width="2"/><ellipse cx="60" cy="44" rx="12" ry="17" fill="#d9a77c"/><path d="M46 44Q42 18 60 22Q77 20 75 46L68 31Q55 39 46 31" fill="#573b32"/><path d="M60 64l-8 20M60 64l8 20" stroke="#e8bc91" stroke-width="6" stroke-linecap="round"/><path d="M47 99l13-31 14 31" fill="#f4e4b6"/>`;
const incense = `<path d="M26 77h68l-8 23H34Z" fill="#9c5437" stroke="#5d342d" stroke-width="3"/><ellipse cx="60" cy="77" rx="34" ry="10" fill="#cd8b59"/><ellipse cx="60" cy="75" rx="24" ry="6" fill="#49352f"/><path d="M49 75q-15-17 3-28T52 9M67 72q18-18 0-34" stroke="#d9d1c3" stroke-width="5" opacity=".8" fill="none" stroke-linecap="round"/><path d="M48 100l-6 11h36l-6-11" fill="#9c5437"/>`;
const food = `<ellipse cx="60" cy="88" rx="53" ry="22" fill="#3c8690" stroke="#235565" stroke-width="3"/><ellipse cx="60" cy="83" rx="44" ry="15" fill="#eddfb0"/><path d="M28 84q-8-31 24-30q12-25 33-8q26 23-2 43Z" fill="#794127" stroke="#582d20" stroke-width="2"/><path d="M31 59q13-21 21-5" fill="#bd7f3f"/><path d="M82 58l16-15" stroke="#f4d9a2" stroke-width="9" stroke-linecap="round"/>${[35, 47, 59, 70, 82].map((x, i) => `<ellipse cx="${x}" cy="${67 + (i % 2) * 9}" rx="2" ry="1" fill="#efd38b"/>`).join("")}<path d="M19 83q13-19 23 0" fill="#72964e"/>`;
const skull = `<path d="M28 71Q6 50 25 25Q40 6 62 9Q103 8 104 48Q105 65 91 73v26q-31 18-62 0Z" fill="#fff0c8" stroke="#a96e4e" stroke-width="3"/><g fill="#713967"><circle cx="40" cy="51" r="15"/><circle cx="80" cy="51" r="15"/></g><g fill="#e87e30"><circle cx="40" cy="51" r="8"/><circle cx="80" cy="51" r="8"/></g><path d="M60 60l-7 14h14Z" fill="#733961"/><path d="M39 87h44M45 82v15M57 82v16M69 82v16M81 82v13" stroke="#a96e4e" stroke-width="3"/><path d="M48 24q12-20 24 0q-12 20-24 0" fill="#469597"/><circle cx="60" cy="25" r="4" fill="#f5bb3c"/>`;
const paper = `<path d="M4 13h112" stroke="#8d653e" stroke-width="3"/><path d="M10 16h100v76l-10 10-10-10-10 10-10-10-10 10-10-10-10 10-10-10-10 10-10-10Z" fill="#d76679"/><path d="M60 30l12 13-12 13-12-13ZM30 30l7 9-7 9-7-9ZM90 30l7 9-7 9-7-9ZM30 65l7 9-7 9-7-9ZM90 65l7 9-7 9-7-9Z" fill="#fff1d8"/><path d="M48 69q0-16 12-9q12-7 12 9L60 83Z" fill="#fff1d8"/>`;
export const art = {
  flower: { name: "Cempasúchil", body: flower },
  paper: { name: "Papel picado", body: paper },
  candle: { name: "Veladora", body: candle },
  bread: { name: "Pan de muerto", body: bread },
  salt: { name: "Sal", body: salt },
  water: { name: "Agua", body: water },
  cross: { name: "Cruz", body: cross },
  saint: { name: "Imagen religiosa", body: saint },
  incense: { name: "Copal", body: incense },
  food: { name: "Mole", body: food },
  skull: { name: "Calaverita", body: skull },
};
export function svg(key) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="wax"><stop stop-color="#dec18b"/><stop offset=".5" stop-color="#fff0c7"/><stop offset="1" stop-color="#d9ba7b"/></linearGradient><radialGradient id="bread"><stop stop-color="#e5a65b"/><stop offset="1" stop-color="#ac5929"/></radialGradient></defs>${art[key].body}</svg>`;
}
export const imageURL = (key) =>
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg(key));
