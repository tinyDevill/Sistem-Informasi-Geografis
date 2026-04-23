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
![layar login](https://drive.google.com/uc?export=view&id=1CI6334jaPQw75EpoNEvvVVB-RdidSONp)

## Tampilan layar login ketika email atau password salah
![layar login ketika email atau password salah](https://drive.google.com/uc?export=view&id=1gKw0-592sWACfEAskhcS-R5JQPkZ8AWK)

## Tampilan layar utama map
![layar utama map](https://drive.google.com/uc?export=view&id=100-vQ_u53bn_i2eRG9g81ooT9YzEI-Sx)

## Tampilan layar ketika menambah map
![layar ketika menambah map](https://drive.google.com/uc?export=view&id=1V_lhyfrI9TmXhuKE3CX2pSsQLjnIbHv7)

## Tampilan layar ketika mengedit map
![layar ketika mengedit map](https://drive.google.com/uc?export=view&id=1YWOsHq4dS2LWfMF1TJOYCEHqNJtOfU9H)
