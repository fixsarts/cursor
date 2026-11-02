// Panel konfigurasi: memanggil FixsCursor.configure() dari library utama.
(() => {
  const C = window.FixsCursor, panel = document.getElementById("panel"), code = document.getElementById("code");
  const inputs = [...panel.querySelectorAll("[data-k]")];
  const stopEls = [...panel.querySelectorAll("[data-stop]")], cStopEls = [...panel.querySelectorAll("[data-cstop]")];
  const nStops = panel.querySelector('[data-n="stops"]');
  const bar = document.getElementById("gradbar"), chips = document.getElementById("presets"), fxBox = document.getElementById("fxchips");
  const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
  const val = (i) => (i.type === "checkbox" ? i.checked : i.type === "range" ? Number(i.value) : i.value);
  const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v);
  const hex = (v, fb) => (isHex(v) ? v : fb);
  const colors = (s) => String(s || "").split(/,(?![^(]*\))/).map((x) => x.trim()).filter(isHex);
  const stops = () => stopEls.slice(0, Number(nStops.value)).map((e) => e.value);
  const fxList = () => [...fxBox.querySelectorAll("button[aria-pressed=true]")].map((b) => b.dataset.fx);

  // Chip efek klik (bisa dipilih lebih dari satu)
  C.effects.forEach((fx) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.fx = fx; b.textContent = fx; b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); render(); mark("");
      if (b.getAttribute("aria-pressed") === "true") { const r = b.getBoundingClientRect(); C.click(r.left + r.width / 2, r.top + r.height / 2); }
    });
    fxBox.append(b);
  });

  // Isi panel dari opsi yang sedang aktif (dipakai setelah ganti preset)
  const fill = () => {
    const o = C.options;
    inputs.forEach((i) => {
      const v = o[i.dataset.k];
      if (i.type === "checkbox") i.checked = !!v;
      else if (i.type === "color") i.value = hex(v || o.color, "#3330ff");
      else i.value = v;
    });
    const list = colors(o.trailColors).slice(0, 5);
    if (list.length) { nStops.value = list.length; list.forEach((c, n) => (stopEls[n].value = c)); }
    const cl = colors(o.clickColors); const cc = cl.length ? cl : [hex(o.rippleColor || o.color, "#3330ff")];
    cStopEls.forEach((e, n) => (e.value = cc[n % cc.length]));
    const on = String(o.clickEffect).toLowerCase().split(/[\s,|+]+/);
    fxBox.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(on.includes(b.dataset.fx))));
  };

  const render = () => {
    const o = {};
    inputs.forEach((i) => (o[i.dataset.k] = val(i)));
    o.trailColors = stops().join(",");
    o.clickColors = cStopEls.map((e) => e.value).join(",");
    o.clickEffect = fxList().join(",") || "none";
    if (C) C.configure(o);
    inputs.concat(nStops).forEach((i) => {
      const out = i.parentElement.querySelector("output");
      if (out) out.textContent = i.dataset.k === "trailLength" && Number(i.value) === 0 ? "bebas" : i.value;
    });
    stopEls.forEach((e, n) => e.classList.toggle("off", n >= Number(nStops.value)));
    const s = stops();
    bar.style.background = s.length > 1 ? `linear-gradient(90deg, ${s.join(",")})` : s[0];
    document.getElementById("stops-out").textContent = s.length + " warna";
    document.getElementById("rm-note").hidden = !(matchMedia("(prefers-reduced-motion: reduce)").matches && o.reducedMotion !== "ignore");
    // Kode pemasangan: hanya opsi yang berbeda dari bawaan library
    const d = C ? C.defaults : {};
    const attrs = Object.keys(o)
      .filter((k) => o[k] !== d[k] && !(k === "rippleColor" && o[k] === o.color)
        && (k !== "trailColors" || o.trail) && !(k === "clickColors" && !/burst|confetti|sparkle/.test(o.clickEffect)))
      .map((k) => `  data-${kebab(k)}="${o[k]}"`).join("\n");
    code.textContent = `<script\n  src="https://fixsarts.github.io/cursor/cursor.js"${attrs ? "\n" + attrs : ""}\n></script>`;
  };

  const mark = (name) => chips.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.p === name)));
  const usePreset = (name) => { C.configure({ preset: name }); C.clearTrail(); fill(); render(); mark(name); };

  C.presets.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.p = p; b.textContent = p; b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => usePreset(p));
    chips.append(b);
  });

  panel.addEventListener("input", () => { render(); mark(""); });
  document.getElementById("reset").addEventListener("click", () => usePreset("default"));
  document.getElementById("rm-ignore").addEventListener("click", () => { panel.querySelector('[data-k="reducedMotion"]').value = "ignore"; render(); });
  document.getElementById("copy").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(code.textContent); e.target.textContent = "Tersalin"; } catch (err) { e.target.textContent = "Salin manual dari kotak kode"; }
    setTimeout(() => (e.target.textContent = "Salin script"), 1800);
  });
  document.querySelector('a[href="#demo-form"]').addEventListener("click", (e) => { e.preventDefault(); document.getElementById("demo-form").scrollIntoView({ behavior: "smooth" }); });
  usePreset("rocket"); // tampilan awal demo
})();
