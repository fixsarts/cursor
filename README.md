# fixs.arts Custom Cursor

Library JavaScript ringan (±8 KB, tanpa dependency) untuk **cursor lingkaran kustom + efek ripple saat klik**. Pasang di website mana pun dengan satu script tag.

Demo: https://fixsarts.github.io/cursor/demo/

## Fitur
- Lingkaran yang mengikuti mouse dengan halus (warna dan ukuran bebas), panah bawaan tetap terlihat (bisa disembunyikan).
- Ripple saat klik, beberapa klik berurutan aman, elemen dihapus setelah animasi.
- Efek hover (cursor membesar) di link, tombol, dan elemen interaktif.
- Shadow DOM: tidak bentrok dengan CSS website, tidak mengubah `body` atau `html` secara default, `pointer-events: none`.
- Otomatis nonaktif di layar sentuh, menghormati `prefers-reduced-motion`, aman dimuat dua kali.

## Pasang (paling sederhana)
Tambahkan sebelum `</body>` (atau di `<head>`):
```html
<script src="https://fixsarts.github.io/cursor/cursor.js"></script>
```
Cursor langsung aktif.

## Contoh konfigurasi
```html
<script
  src="https://fixsarts.github.io/cursor/cursor.js"
  data-color="#3330ff"
  data-size="18"
  data-ripple="true"
  data-ripple-color="#3330ff"
  data-ripple-size="90"
  data-ripple-duration="600"
  data-hover-effect="true"
  data-hide-native-cursor="false"
></script>
```
Daftar lengkap opsi, JavaScript API, dan perilaku otomatis: [docs/configuration.md](docs/configuration.md).

## JavaScript API (ringkas)
```js
FixsCursor.configure({ color: "#0a84ff", size: 24 }); // ubah langsung
FixsCursor.disable(); FixsCursor.enable();
FixsCursor.ripple(200, 200);                           // ripple manual
FixsCursor.destroy();
```
Untuk mengendalikan sendiri kapan mulai: `data-auto="false"` lalu `FixsCursor.init({ ... })`.

## Struktur repo
```text
cursor/
├── cursor.js            versi terbaru (URL tetap)
├── releases/1.0.0/      salinan beku tiap versi
├── demo/                halaman demo (memakai ../cursor.js)
├── docs/configuration.md
├── README.md
└── LICENSE
```

## Deploy ke GitHub Pages
1. Buat repo publik `cursor` di akun `fixsarts`.
2. Upload semua isi folder ini ke root repo.
3. Settings > Pages > Source: Deploy from a branch > `main` / `(root)` > Save.
4. Tunggu 1 sampai 2 menit. Script aktif di `https://fixsarts.github.io/cursor/cursor.js` dan demo di `.../demo/`.

## Versi dan update
- **Latest**: `https://fixsarts.github.io/cursor/cursor.js`. Website pengguna otomatis dapat pembaruan setelah `cursor.js` diganti (GitHub Pages menyimpan cache sekitar 10 menit).
- **Versi tetap (Pages)**: `https://fixsarts.github.io/cursor/releases/1.0.0/cursor.js`
- **Rilis baru**: ubah `VERSION` dan komentar versi di `cursor.js`, salin ke `releases/<versi>/cursor.js`, commit, lalu buat tag Git `v<versi>`.
- Gunakan versi tetap untuk website penting, latest untuk website yang ingin selalu terbaru.

## CDN (jsDelivr)
jsDelivr mengambil langsung dari repo GitHub (perlu tag rilis, mis. `v1.0.0`):
```html
<script src="https://cdn.jsdelivr.net/gh/fixsarts/cursor@1.0.0/cursor.js"></script> <!-- versi tetap -->
<script src="https://cdn.jsdelivr.net/gh/fixsarts/cursor@1/cursor.js"></script>     <!-- terbaru 1.x -->
```
Jangan pakai `@main` di produksi (cache bisa lama).

## Troubleshooting
- **Cursor tidak muncul**: cek tab Network (script 404?), pastikan Pages aktif, dan pakai mouse (bukan layar sentuh). Ketik `FixsCursor` di Console untuk memastikan terpasang.
- **Tidak ada ripple**: `prefers-reduced-motion` aktif di sistem, atau `data-ripple="false"`.
- **Perubahan tidak terlihat**: cache. Muat ulang paksa (Ctrl+Shift+R) atau pakai URL versi.
- **Efek hover tidak muncul di elemen kustom**: tambahkan atribut `data-cursor-hover` atau atur `data-selector`.
- **Cursor tertutup elemen lain**: naikkan `data-z-index`, dan pastikan tidak ada elemen `popover`/`dialog` modal yang menutupinya (lapisan top-layer browser selalu di atas).

## Batasan
- Tidak bekerja di dalam `<iframe>` (pasang script di tiap halaman iframe yang sama origin).
- Situs dengan CSP yang melarang script dari `fixsarts.github.io` harus mengizinkannya di `script-src`.
- `dialog.showModal()` dan elemen top-layer menutupi cursor kustom.
- Perangkat hibrida: hanya gerakan mouse yang diikuti, sentuhan diabaikan.
- Ripple memerlukan Web Animations API (semua browser modern).

## Lisensi
MIT
