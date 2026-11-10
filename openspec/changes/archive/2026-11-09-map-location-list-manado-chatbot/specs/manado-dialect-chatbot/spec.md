# Spec Delta: manado-dialect-chatbot

## Purpose

Memberikan kemampuan bagi chatbot cerdas untuk menangani pertanyaan pengguna seputar tempat, kuliner, dan topik di luar katalog resmi beranda dengan menggunakan Bahasa Manado yang hangat dan informatif.

## ADDED Requirements

### Requirement: Penanganan Pertanyaan di Luar Data Katalog Beranda
Sistem chatbot SHALL merespons secara informatif dan solutif terhadap pertanyaan pengguna mengenai destinasi, kuliner khas, budaya, dan rute di wilayah Sulawesi Utara yang tidak tercantum dalam katalog resmi beranda.

#### Scenario: Pengguna menanyakan lokasi atau kuliner di luar katalog
- **WHEN** Pengguna menanyakan objek wisata atau kuliner yang tidak terdapat dalam katalog destinasi beranda (misalnya kuliner tinutuan di Wakeke, Danau Linow di Tomohon, atau transportasi mikrolet)
- **THEN** Chatbot memberikan jawaban informatif mengenai topik tersebut tanpa menampilkan pesan penolakan kaku bahwa data tidak mencakup hal tersebut

### Requirement: Penggunaan Dialek Bahasa Manado yang Natural
Sistem chatbot SHALL menggunakan Bahasa Manado (Melayu Manado) yang santun, ramah, dan komunikatif saat menjawab pertanyaan pengguna, khususnya saat menjelaskan hal-hal di luar data katalog beranda atau berdialog dengan pengguna.

#### Scenario: Respons dalam Bahasa Manado untuk hal di luar katalog
- **WHEN** Pengguna mengajukan pertanyaan tentang hal di luar daftar destinasi beranda
- **THEN** Chatbot menyusun respons menggunakan kosakata dan gaya khas Bahasa Manado yang bersahabat (seperti penggunaan kata 'ngana', 'torang', 'nyanda', 'kalo mo cari', atau sejenisnya) seraya tetap memberikan informasi yang jelas dan akurat

#### Scenario: Penanganan mode offline tanpa sambungan API live
- **WHEN** Permintaan chatbot dieksekusi tanpa kunci API live atau ketika koneksi jaringan gagal
- **THEN** Sistem fallback lokal menyediakan jawaban informatif seputar Sulawesi Utara menggunakan Bahasa Manado berdasarkan basis pengetahuan lokal yang telah ditanamkan
