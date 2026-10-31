// Panel konfigurasi: memanggil FixsCursor.configure() dari library utama.
(() => {
  const C = window.FixsCursor, panel = document.getElementById("panel"), code = document.getElementById("code");
  const inputs = [...panel.querySelectorAll("[data-k]")];
  const defaults = inputs.map((i) => (i.type === "checkbox" ? i.checked : i.value));
  const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
  const val = (i) => (i.type === "checkbox" ? i.checked : i.type === "range" ? Number(i.value) : i.value);
  const render = () => {
    const o = {}; inputs.forEach((i) => (o[i.dataset.k] = val(i)));
    if (C) C.configure(o);
    inputs.forEach((i) => { const out = i.parentElement.querySelector("output"); if (out) out.textContent = i.value; });
    const attrs = inputs.map((i) => `  data-${kebab(i.dataset.k)}="${val(i)}"`).join("\n");
    code.textContent = `<script\n  src="https://fixsarts.github.io/cursor/cursor.js"\n${attrs}\n></script>`;
  };
  panel.addEventListener("input", render);
  document.getElementById("reset").addEventListener("click", () => { inputs.forEach((i, n) => { i.type === "checkbox" ? (i.checked = defaults[n]) : (i.value = defaults[n]); }); render(); });
  document.getElementById("copy").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(code.textContent); e.target.textContent = "Tersalin"; } catch (err) { e.target.textContent = "Salin manual dari kotak kode"; }
    setTimeout(() => (e.target.textContent = "Salin script"), 1800);
  });
  document.querySelector('a[href="#demo-form"]').addEventListener("click", (e) => { e.preventDefault(); document.getElementById("demo-form").scrollIntoView({ behavior: "smooth" }); });
  render();
})();
