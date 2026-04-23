# Nama : Abi Sholihan
# NIM  : 123140192
# Cara Menjalankan API:
1. Unduh atau Fork Praktikum 7_NEW dan Praktikum 9 ini
2. Buka folder Praktikum 7_NEW project di command promt, powershell, ataupun git bash
3. Jalankan perintah "pip install -r requirements.txt"
4. Pastikan telah dibuat tabel pada database dengan perintah seperti berikut:
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  
6. Buka folder Praktikum 9 project di command promt, powershell, ataupun git bash
7. Jalankan perintah "npm install"
8. Untuk menjalankan web, jalankan perintah "npm run dev"
9. Buka di browser "localhost:5173"

## Catatan : Sebelum menjalankan "npm run dev" pastikan Database dan FastAPI sudah berjalan 
