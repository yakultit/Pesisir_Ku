<<<<<<< HEAD
# PesisirKu 🌊
**Sistem Cerdas Pemetaan & Trip Planner Wisata Pesisir Manado, Bitung, dan Minahasa Utara**

PesisirKu adalah sistem informasi geografis dan asisten cerdas berbasis kecerdasan buatan (AI) yang memetakan **33+ objek wisata pesisir** di wilayah segitiga pariwisata Sulawesi Utara: **Kota Manado**, **Kota Bitung**, dan **Kabupaten Minahasa Utara (Likupang)**.

Sistem ini dirancang dengan pendekatan **Grounded AI (Anti-Halusinasi)**, integrasi **Open-Meteo Weather & Marine API**, serta **Simple RAG** untuk memberikan rekomendasi perjalanan pesisir yang teruji, faktual, dan aman.

---

## 🌟 Fitur Utama (Kontribusi Nyata & Terukur)

1. **AI Trip Planner (Grounded LLM)**
   - Pengguna memasukkan kebutuhan dalam bahasa natural (contoh: *"2 hari di Bunaken, budget 500 ribu, bawa anak, suka snorkeling"*).
   - LLM menyusun itinerary harian, estimasi biaya tiket, sewa perahu/alat, dan jadwal aktivitas **hanya dari basis data resmi Firestore/katalog destinasi terverifikasi** (bebas dari halusinasi data khayalan).
   - Menyertakan *AI Rationale* (alasan pemilihan destinasi) dan *Safety Advisory* pesisir.

2. **Chatbot Berbasis Data Sendiri (Simple RAG)**
   - Data spesifik dari 33+ destinasi pesisir diinjeksikan sebagai konteks (*System Prompt Context Injection*) ke LLM.
   - Jawaban chatbot konsisten, terukur, dan tidak merekayasa fasilitas atau harga tiket yang tidak ada di lapangan.

3. **Rekomendasi Cuaca & Kelautan Realtime (Open-Meteo REST API)**
   - Mengambil data laut live dari koordinat GPS masing-masing destinasi:
     - Tinggi gelombang laut (*wave height* dalam meter)
     - Kecepatan angin (*wind speed* dalam km/jam)
     - Suhu udara & prakiraan per jam
   - **Marine Safety Badge**: Mengklasifikasikan kondisi menjadi `AMAN`, `WASPADA`, atau `BAHAYA`.
   - **AI Marine Interpreter**: LLM menjelaskan secara praktis apakah hari itu cocok untuk snorkeling, berenang balita, atau penyeberangan perahu kecil.

4. **Review & Rating Pengguna (CRUD) + AI Review Summarizer**
   - Wisatawan dapat memberikan rating (1-5 bintang) dan ulasan pengalaman.
   - LLM secara otomatis merangkum ulasan menjadi 3 poin: **Poin Positif Utama**, **Hal yang Perlu Diperhatikan**, dan **Tips Wisatawan**.

5. **Favorit & Itinerary Tersimpan per Akun**
   - Terintegrasi Firebase Auth (Google Login & Mock Demo Kawanua).
   - Pengguna dapat menyimpan destinasi favorit dan menyimpan rencana perjalanan yang dapat dicetak/diekspor.

---

## 🗺️ Fitur Pendukung

- **Peta Interaktif (Leaflet + OpenStreetMap)**: 
  - Penanda kategori khusus (*Diving/Snorkeling*, *Pantai*, *Pulau*, *Mangrove*, *Kuliner Pesisir*).
  - Filter multi-level: Wilayah (Manado, Bitung, Minut), Kategori, Ramah Anak, dan Spot Snorkeling.
- **Rute dari Lokasi Pengguna ke Wisata (OSRM Machine)**: 
  - Mendeteksi koordinat GPS pengguna / Pusat Manado dan menggambar rute jalan raya interaktif lengkap dengan estimasi jarak (km) dan durasi perjalanan (menit).
- **Dashboard Admin Dinas Pariwisata**:
  - Manajemen CRUD Objek Wisata (Tambah, Edit, Hapus).
  - Moderasi ulasan publik untuk menjaga etika platform.
- **Responsive Design & Mode Gelap**:
  - Tampilan responsif di smartphone maupun desktop.
  - Sakelar instan Dark / Light Mode.

---

## 🚀 Cara Menjalankan Aplikasi

1. **Jalankan Server Pengembangan (Vite)**:
   ```bash
   npm run dev
   ```
2. Buka browser pada alamat yang tertera (biasanya `http://localhost:5173`).
3. Anda dapat langsung menguji:
   - Tab **Peta Wisata**: Filter wilayah Manado/Bitung/Minut, klik pin objek wisata untuk melihat cuaca laut Open-Meteo dan tombol rute jalan.
   - Tab **AI Trip Planner**: Coba masukkan skenario liburan dan klik *"Susun Rencana AI Sekarang"*.
   - Tab **Chatbot RAG**: Tanyakan rekomendasi pantai pasir putih atau biaya sewa perahu Bunaken.
   - Tab **Dashboard Admin**: Klik tombol "Admin" di pojok kanan atas untuk menambah destinasi baru atau moderasi review.

---

## 📂 Struktur Proyek

```
src/
├── components/
│   ├── Navbar.tsx             # Navigasi utama, status bar, dark mode & auth
│   ├── MapView.tsx            # Peta Leaflet interaktif, filter & OSRM routing
│   ├── DestinationModal.tsx   # Modal detail wisata, Open-Meteo REST API & review CRUD
│   ├── TripPlannerView.tsx    # Antarmuka Grounded AI Trip Planner
│   ├── ChatbotView.tsx        # Antarmuka RAG Chatbot anti-halusinasi
│   ├── SavedItinerariesView.tsx # Daftar favorit & rencana perjalanan tersimpan
│   └── AdminDashboard.tsx     # Dashboard CRUD destinasi & moderasi review
├── data/
│   └── destinations.ts        # Basis data 33+ objek wisata Manado, Bitung, & Minut
├── services/
│   ├── weatherService.ts      # Integrasi Open-Meteo Weather & Marine API
│   ├── aiService.ts           # Grounded Trip Planner, RAG Chatbot & LLM Summarizer
│   └── firebaseService.ts     # Firebase Auth, Firestore sync & local persistence
├── types/
│   └── destination.ts         # Tipe TypeScript komprehensif
├── App.tsx                    # Komponen induk aplikasi
├── index.css                  # Tailwind CSS styling & custom leaflet design
└── main.tsx                   # Entry point aplikasi
```
=======
# Pesisir_Ku
>>>>>>> 49f0aaf71939eda39d9c8e3219bd6635f01d434a
