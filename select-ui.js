// Keep the original select as the editor's value source; enhance only its UI.
export function enhanceSelect(select) {
  const wrapper = document.createElement("div");
  wrapper.className = "custom-select";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.id = `${select.id}-trigger`;
  trigger.className = "select-trigger";
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  const value = document.createElement("span");
  value.id = `${select.id}-value`;
  trigger.append(value);
  const menu = document.createElement("div");
  menu.id = `${select.id}-menu`;
  menu.className = "select-menu";
  menu.setAttribute("role", "listbox");
  menu.hidden = true;
  trigger.setAttribute("aria-controls", menu.id);
  const label = document.querySelector(`label[for="${select.id}"]`);
  label.id ||= `${select.id}-label`;
  label.htmlFor = trigger.id;
  trigger.setAttribute("aria-labelledby", `${label.id} ${value.id}`);
  menu.setAttribute("aria-labelledby", label.id);
  if (select.id === "tier") trigger.setAttribute("aria-describedby", "meaning");
  select.before(wrapper);
  wrapper.append(select, trigger, menu);
  select.hidden = true;
  let active = 0,
    prefix = "",
    typedAt = 0;

  function close() {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.removeAttribute("aria-activedescendant");
    prefix = "";
  }
  function highlight(index) {
    active = Math.max(0, Math.min(menu.children.length - 1, index));
    [...menu.children].forEach((option, i) =>
      option.classList.toggle("active", i === active),
    );
    const option = menu.children[active];
    if (option) {
      trigger.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView({ block: "nearest" });
    }
  }
  function open() {
    if (!select.options.length) return;
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    highlight(Math.max(0, select.selectedIndex));
  }
  function choose(index) {
    select.selectedIndex = index;
    close();
    trigger.focus();
    select.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
  }
  function sync() {
    value.textContent = select.selectedOptions[0]?.textContent || "Seleccionar";
    trigger.disabled = select.disabled || !select.options.length;
    menu.replaceChildren(
      ...[...select.options].map((option, index) => {
        const entry = document.createElement("div");
        entry.id = `${select.id}-option-${index}`;
        entry.className = "select-option";
        entry.setAttribute("role", "option");
        entry.setAttribute("aria-selected", String(option.selected));
        entry.textContent = option.textContent;
        entry.addEventListener("pointerdown", (event) =>
          event.preventDefault(),
        );
        entry.addEventListener("click", () => choose(index));
        return entry;
      }),
    );
    close();
  }
  trigger.addEventListener("click", () => (menu.hidden ? open() : close()));
  trigger.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Tab") {
      close();
      return;
    }
    if (key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      event.preventDefault();
      if (menu.hidden) open();
      else
        highlight(
          key === "Home"
            ? 0
            : key === "End"
              ? menu.children.length - 1
              : active + (key === "ArrowDown" ? 1 : -1),
        );
      return;
    }
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (menu.hidden) open();
      else choose(active);
      return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (menu.hidden) open();
      prefix = Date.now() - typedAt > 700 ? key : prefix + key;
      typedAt = Date.now();
      const normalize = (text) =>
        text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const index = [...select.options].findIndex((option) =>
        normalize(option.textContent).startsWith(normalize(prefix)),
      );
      if (index >= 0) highlight(index);
    }
  });
  trigger.addEventListener("blur", close);
  document.addEventListener("pointerdown", (event) => {
    if (!wrapper.contains(event.target)) close();
  });
  sync();
  return sync;
}
