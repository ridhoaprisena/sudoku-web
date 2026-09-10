# Sudoku Web

Game Sudoku interaktif berbasis web dengan desain **Material Design 3**. Dibangun menggunakan React + Vite, responsif untuk desktop, tablet, dan mobile.

## Preview

![Sudoku Web — Menu](https://raw.githubusercontent.com/ridhoaprisena/sudoku-web/main/preview-menu.png)
![Sudoku Web — Game](https://raw.githubusercontent.com/ridhoaprisena/sudoku-web/main/preview-game.png)

---

## Fitur

- **4 Tingkat Kesulitan** — Mudah (36 petunjuk), Sedang (28), Sulit (22), Ahli (17)
- **Mode Mudah tanpa nyawa** — salah tetap ditandai, tapi tidak ada game over
- **3 Nyawa** pada mode Sedang, Sulit, dan Ahli
- **Timer** — jam berjalan dengan fungsi pause/resume
- **Mode Catatan** — tulis angka sementara di sel
- **Undo** — batalkan langkah terakhir (unlimited)
- **Hint** — 3 bantuan per sesi, mengisi sel yang dipilih secara otomatis
- **6 Tema Warna** — Ungu, Samudra, Hutan, Senja, Mawar, Gelap (disimpan di localStorage)
- **Highlight otomatis** — baris, kolom, kotak, dan angka yang sama ikut tersorot
- **Konflik real-time** — sel merah jika ada duplikat
- **Animasi** — sel bergetar saat salah, pop saat benar, konfeti saat menang
- **Keyboard support** — tekan `1`–`9`, `Del`, `Ctrl+Z`, `Esc`
- **Responsif** — layout vertikal di mobile, sidebar di desktop

---

## Tech Stack

| Teknologi | Keterangan |
|---|---|
| [React 19](https://react.dev) | UI library |
| [Vite 8](https://vitejs.dev) | Build tool & dev server |
| [Material Design 3](https://m3.material.io) | Design system (CSS custom properties) |
| [Google Fonts — Roboto](https://fonts.google.com/specimen/Roboto) | Tipografi |
| [Material Icons Round](https://fonts.google.com/icons) | Ikonografi |
| Vanilla CSS | Styling (tanpa framework CSS) |

---

## Struktur Proyek

```
sudoku-web/
├── public/
│   └── favicon.svg            # Ikon Sudoku kustom
├── src/
│   ├── index.css              # Design tokens MD3, animasi global
│   ├── main.jsx               # Entry point
│   ├── App.jsx                # Root — routing menu/game
│   ├── contexts/
│   │   ├── ThemeContext.jsx   # State tema warna
│   │   └── GameContext.jsx    # State game (board, lives, timer, dst)
│   ├── utils/
│   │   └── sudokuGenerator.js # Algoritma generate & solve (backtracking)
│   ├── screens/
│   │   ├── MenuScreen.jsx     # Layar menu utama
│   │   ├── MenuScreen.css
│   │   ├── GameScreen.jsx     # Layar permainan
│   │   └── GameScreen.css
│   └── components/
│       ├── SudokuBoard.jsx    # Papan 9×9
│       ├── SudokuBoard.css
│       ├── SudokuCell.jsx     # Sel individual
│       ├── SudokuCell.css
│       ├── NumberPad.jsx      # Pad angka 1–9
│       ├── NumberPad.css
│       ├── GameHeader.jsx     # Header — timer, nyawa, pause
│       ├── GameHeader.css
│       ├── GameControls.jsx   # Undo, Hapus, Catatan, Bantuan
│       ├── GameControls.css
│       ├── ThemePicker.jsx    # Pemilih tema warna
│       ├── ThemePicker.css
│       ├── ResultModal.jsx    # Dialog menang/kalah + konfeti
│       └── ResultModal.css
├── index.html
├── vite.config.js
└── package.json
```

---

## Instalasi & Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org) versi 18 atau lebih baru
- npm (sudah termasuk bersama Node.js)

### Langkah

```bash
# 1. Clone repositori
git clone https://github.com/username/sudoku-web.git
cd sudoku-web

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5173`.

### Build Production

```bash
npm run build
npm run preview
```

---

## Cara Bermain

1. **Pilih tingkat kesulitan** di menu — Mudah tidak pakai nyawa, yang lain pakai 3 nyawa
2. **Pilih tema warna** sesuai selera
3. Klik **Mulai Bermain**
4. Klik sel yang kosong, lalu ketuk angka di numpad (atau tekan keyboard `1`–`9`)
5. Gunakan tombol aksi:
   - **Batal** — undo langkah terakhir
   - **Hapus** — kosongkan sel yang dipilih
   - **Catatan** — aktifkan mode pencil untuk menulis angka sementara
   - **Bantuan** — isi otomatis sel yang dipilih (maks. 3×)
6. Selesaikan semua sel untuk menang!

### Shortcut Keyboard

| Tombol | Aksi |
|---|---|
| `1` – `9` | Input angka |
| `Del` / `Backspace` | Hapus angka di sel |
| `Ctrl+Z` | Undo |
| `Esc` | Pause / Resume |

---

## Algoritma Sudoku

Puzzle dibuat menggunakan **backtracking algorithm**:

1. **Generate solusi**: Isi papan 9×9 secara rekursif dengan angka teracak yang valid
2. **Buat puzzle**: Hapus sel secara acak sesuai jumlah petunjuk per tingkat kesulitan
3. **Validasi unik** (khusus mode Sulit & Ahli): Pastikan puzzle memiliki tepat satu solusi menggunakan `countSolutions()`

---

## Lisensi

[MIT License](LICENSE)

---

> Dibuat dengan React + Vite · Material Design 3
