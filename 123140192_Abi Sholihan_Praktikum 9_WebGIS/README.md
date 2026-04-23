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

# Screenshot
## Tampilan layar login
![layar login](https://drive.google.com/uc?export=view&id=15j1Tzdc02KqXuXC2SuxSc1vJ6KHMNkEd)

## Tampilan layar login ketika email atau password salah
![layar login ketika email atau password salah](https://drive.google.com/uc?export=view&id=1W9odCQBlLb3VCoweK3tYej2Yaz9jtPeg)

## Tampilan layar utama map
![layar utama map](https://drive.google.com/uc?export=view&id=1uWrLeeAFd8_NF3BDUfwDZQlO-dt1YvA6)

## Tampilan layar ketika menambah map
![layar ketika menambah map](https://drive.google.com/uc?export=view&id=15j1Tzdc02KqXuXC2SuxSc1vJ6KHMNkEd)

## Tampilan layar ketika mengedit map
![layar ketika mengedit map](https://drive.google.com/uc?export=view&id=1W9odCQBlLb3VCoweK3tYej2Yaz9jtPeg)
