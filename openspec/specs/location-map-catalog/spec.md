# location-map-catalog Specification

## Purpose

Menyediakan integrasi interaktif antara peta posisi geografis dan daftar kartu lokasi pesisir yang tersinkronisasi serta dapat disaring berdasarkan kategori destinasi.

## Requirements

### Requirement: Tampilan Peta dan Daftar Lokasi Terkoordinasi
Sistem SHALL menampilkan peta geografis interaktif berdampingan atau terintegrasi dengan daftar kartu lokasi destinasi pesisir secara responsif pada perangkat desktop dan mobile.

#### Scenario: Membuka halaman peta dan melihat daftar lokasi
- **WHEN** Pengguna membuka halaman tampilan peta utama
- **THEN** Sistem menampilkan peta posisi dengan penanda (marker) dan daftar kartu lokasi destinasi yang memuat foto, nama, wilayah, kategori, dan rating

#### Scenario: Memilih kartu destinasi dari daftar lokasi
- **WHEN** Pengguna mengklik salah satu kartu destinasi pada panel daftar lokasi
- **THEN** Peta secara otomatis memusatkan pandangan (*pan/flyTo*) ke koordinat destinasi tersebut dan membuka popup penanda yang bersangkutan

#### Scenario: Memilih penanda di atas peta
- **WHEN** Pengguna mengklik penanda destinasi di peta
- **THEN** Sistem membuka popup informasi dan menyorot kartu destinasi yang bersangkutan pada daftar lokasi

### Requirement: Penyaringan Berdasarkan Kategori Destinasi
Sistem SHALL menyediakan filter kategori ('Semua', 'Pantai', 'Pulau & Bawah Laut', 'Ekowisata Mangrove', 'Spot Diving/Snorkeling', 'Kuliner Pesisir') yang secara langsung menyaring penanda peta dan item dalam daftar lokasi.

#### Scenario: Memilih kategori spesifik
- **WHEN** Pengguna memilih salah satu filter kategori (misalnya 'Ekowisata Mangrove')
- **THEN** Sistem hanya menampilkan penanda di peta dan kartu di daftar lokasi yang memiliki kategori tersebut, serta memperbarui hitungan total destinasi yang cocok

#### Scenario: Memilih kategori 'Semua'
- **WHEN** Pengguna memilih tombol filter kategori 'Semua'
- **THEN** Sistem menampilkan kembali seluruh destinasi pesisir pada peta dan daftar lokasi tanpa batasan kategori

### Requirement: Pencarian dan Penyaringan Cepat Teks
Sistem SHALL mengizinkan pencarian teks yang secara simultan memfilter daftar lokasi dan penanda pada peta berdasarkan nama, deskripsi, fasilitas, atau wilayah.

#### Scenario: Mengetik kata kunci pencarian
- **WHEN** Pengguna memasukkan teks pencarian pada kolom pencarian
- **THEN** Sistem menyaring kartu daftar lokasi dan penanda peta sehingga hanya destinasi yang cocok dengan kata kunci yang ditampilkan
