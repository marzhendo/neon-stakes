<div align="center">

# 🎰 Neon Stakes

Simulator betting sebagai studi kasus: sistem transaksional, concurrency, dan dark patterns UI/UX.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![Golang](https://img.shields.io/badge/Golang-00ADD8?style=for-the-badge&logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)

</div>

> ⚠️ **Disclaimer:** Project ini murni untuk keperluan riset dan edukasi software engineering. Tidak ada uang asli, payment gateway, atau nilai ekonomi apapun di sini — semua saldo hanya simulasi.

---

## Tentang Project

Neon Stakes dibuat untuk membedah tiga hal:

- **Concurrency & transaksi aman** — bagaimana backend menangani banyak request bersamaan tanpa race condition
- **Teori probabilitas** — implementasi weighted RNG dan RTP (Return to Player)
- **Dark patterns** — teknik-teknik psikologis UI/UX yang umum dipakai di aplikasi serupa, supaya bisa dikenali dan dikritisi

---

## Tampilan

| Login & Register | Player Dashboard |
|:---:|:---:|
| ![Login](/public/src/login-page.png) | ![Dashboard](/public/src/dashboard-page.png) |

| Slot Machine | Admin Panel |
|:---:|:---:|
| ![Slot](/public/src/game-page.png) | ![Admin](/public/src/admin-page.png) |


---

## Arsitektur

Prinsip utama sistem ini adalah **zero client trust** — frontend dianggap tidak bisa dipercaya sepenuhnya. Semua logika kritis (RNG, kalkulasi saldo, validasi) jalan di backend Go, bukan di browser.

![Mermaid](/public/src/mermaid-flow.png)

Flow singkatnya:
1. Client kirim request spin dengan nominal bet
2. Backend validasi JWT dan role user
3. RNG dijalankan di server, bukan client
4. Hasil dan perubahan saldo disimpan dalam satu ACID transaction
5. Client hanya terima hasil — tidak ada kalkulasi di sisi browser

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js, TailwindCSS, Framer Motion |
| Backend | Golang |
| Database | PostgreSQL via Supabase |
| Auth | JWT + RBAC |
