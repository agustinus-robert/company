# JMC Testing

Aplikasi **JMC Testing** dibangun menggunakan **Nuxt** dan **Prisma ORM**.

## Catatan

- Pastikan service MySQL sedang berjalan.
- Database `NAMA_DB_ANDA` harus dibuat terlebih dahulu sebelum menjalankan `npm run installer`.
- Installer akan melakukan generate Prisma Client, migrasi database, dan seeding data secara otomatis.
- Jika mengubah Prisma Schema, jalankan kembali migrasi sesuai kebutuhan.
- Secara default aplikasi menggunakan `DEMO_MODE=true` sehingga token JWT memiliki masa berlaku yang panjang untuk kebutuhan demo.
- Jika ingin menguji masa berlaku (expired) token JWT, ubah konfigurasi berikut pada file `.env`:

## Persyaratan

Pastikan telah terpasang:

- Node.js 20 atau lebih baru
- npm
- MySQL 8.x

---

# Instalasi

## 1. Clone Repository

```bash
git clone <repository-url>
cd <nama-folder-project>
```

## 2. Install Dependency

```bash
npm install
```

## 3. Buat Database

Sebelum menjalankan installer, buat database terlebih dahulu di MySQL.

Contoh:

```sql
CREATE DATABASE jmc;
```

> Nama database harus sama dengan nilai `DB_NAME` pada file `.env`.

---

## 4. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`.

Linux / macOS:

```bash
cp .env.example .env
```

Windows:

```cmd
copy .env.example .env
```

Kemudian isi `.env` dengan konfigurasi berikut:

```env
APP_NAME="Isian APP"
APP_CLIENT="Isian client"

JWT_SECRET="Generate dari https://www.jwt.io/"
NUXT_PUBLIC_RECAPTCHA_SITE_KEY="Isian recaptha"

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=
DB_CONNECTION_LIMIT=5

DEMO_MODE=true

JWT_EXPIRES_IN=3650d
SESSION_EXPIRES_MINUTES=3

DATABASE_URL="mysql://root:root@localhost:3306/jmc"
```

Sesuaikan nilai `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, dan `DATABASE_URL` dengan konfigurasi MySQL pada komputer Anda.

---

## 5. Jalankan Installer

Setelah file `.env` selesai dikonfigurasi, jalankan:

```bash
npm run installer
```

Perintah tersebut akan secara otomatis:

- Generate Prisma Client
- Menjalankan migrasi database
- Menjalankan proses seeding data awal

---

## 6. Jalankan Aplikasi

Mode development:

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```
http://localhost:3000
```

---

# Alur Instalasi

```text
Clone Repository
        │
        ▼
npm install
        │
        ▼
Buat Database "jmc"
        │
        ▼
Konfigurasi .env
        │
        ▼
npm run installer
        │
        ▼
npm run dev
```

---
