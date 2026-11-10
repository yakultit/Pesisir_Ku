# Design: Peta Posisi, Daftar Lokasi Terkoordinasi, dan Chatbot Bahasa Manado

## Context

Aplikasi PesisirKu saat ini menampilkan objek wisata pesisir di Sulawesi Utara (Manado, Bitung, Minahasa Utara). Halaman utama peta (`MapView.tsx`) saat ini menggunakan layar penuh untuk peta Leaflet dengan filter mengambang di atas, tanpa daftar lokasi yang dapat ditelusuri berdampingan. Pengguna harus mengklik marker satu per satu di peta. Di sisi lain, komponen chatbot (`ChatbotView.tsx` dan `aiService.ts`) menerapkan pembatasan RAG ketat yang langsung menolak pertanyaan di luar 33 destinasi resmi dengan pesan penolakan formal, tanpa kemampuan merespons dalam dialek lokal Bahasa Manado.

Lihat `proposal.md` untuk motivasi dan `specs/` untuk persyaratan perilaku sistem.

## Goals / Non-Goals

**Goals:**
- Menghadirkan antarmuka terintegrasi yang menggabungkan peta posisi Leaflet dengan panel daftar lokasi (*location list*) yang interaktif dan responsif (split-view pada desktop, collapsible/sheet pada mobile).
- Sinkronisasi dua arah yang mulus antara daftar kartu destinasi dan penanda (*marker*) peta.
- Filter kategori yang intuitif dan cepat ('Semua', 'Pantai', 'Pulau & Bawah Laut', 'Ekowisata Mangrove', 'Spot Diving/Snorkeling', 'Kuliner Pesisir') yang menyaring pin peta dan kartu daftar lokasi secara bersamaan.
- Mengubah arsitektur prompt dan fallback chatbot agar dapat merespons pertanyaan di luar katalog beranda secara informatif dan bersahabat dengan menggunakan dialek Bahasa Manado (Melayu Manado).
- Membangun basis pengetahuan lokal (*local fallback knowledge base*) dalam Bahasa Manado untuk menangani pertanyaan di luar katalog saat API Gemini tidak tersedia atau offline.

**Non-Goals:**
- Mengganti library peta Leaflet dengan engine peta berbayar lainnya.
- Mengubah struktur data utama `Destination` yang tersimpan di Firestore atau LocalStorage.
- Mengubah algoritma perencana perjalanan (*trip planner*) di luar integrasi umum.

## Decisions

### 1. Desain Tata Letak Peta dan Daftar Lokasi (Split / Drawer Layout)
- **Keputusan**: Pada layar desktop (md ke atas), gunakan tata letak split-pane: panel kiri selebar ~380px–420px untuk daftar lokasi yang dapat di-scroll vertikal dan panel kanan untuk peta Leaflet interaktif, dilengkapi tombol toggle untuk menyembunyikan/menampilkan panel daftar jika pengguna ingin peta layar penuh. Pada layar mobile, gunakan tab toggle atau collapsible drawer bawah ('🗺️ Peta' / '📋 Daftar') agar ruang layar tetap nyaman digunakan.
- **Alternatif**: Modal daftar terpisah yang menutupi peta. Ditolak karena pengguna kehilangan konteks spasial posisi lokasi terhadap peta saat menelusuri daftar.

### 2. Sinkronisasi Dua Arah Antara Kartu dan Marker Peta
- **Keputusan**: Gunakan shared state `focusedDestination: Destination | null` dan `hoveredDestinationId: string | null`. Ketika pengguna mengklik kartu di daftar lokasi:
  1. Peta memanggil controller `map.flyTo([lat, lng], 13)` dengan animasi halus.
  2. Marker destinasi yang sesuai disorot dan popup Leaflet otomatis terbuka.
  3. Ketika marker di peta diklik oleh pengguna, kartu yang bersangkutan di daftar lokasi otomatis di-scroll ke pandangan pengguna (*scrollIntoView*).
- **Alternatif**: Navigasi pindah halaman. Ditolak karena memutus kenyamanan interaksi pengguna.

### 3. Penyesuaian Penanganan Respon Chatbot & Dialek Manado
- **Keputusan**: 
  1. Perbarui *system prompt* LLM di `aiService.ts`: Instruksikan chatbot bahwa jika pertanyaan menyangkut destinasi beranda resmi, gunakan data akurat beranda. Namun jika pertanyaan berkaitan dengan topik, tempat wisata lain, kuliner khas, tips, atau budaya di luar data beranda, chatbot DILARANG menolak dan WAJIB menjawab dengan pengetahuan umum Sulawesi Utara menggunakan Bahasa Manado (Melayu Manado) yang akrab, ramah, dan komunikatif (menggunakan istilah seperti *torang*, *ngana*, *pe gaga*, *pe sadap*, *nyanda*, *iyo*, dll.).
  2. Buat mesin fallback lokal (*Manado Local Knowledge Engine*) di `aiService.ts` yang mencakup topik-topik populer Sulawesi Utara di luar pesisir: kuliner (Tinutuan di Wakeke, Cakalang Fufu, Klappertaart, Sambal Roa), destinasi dataran tinggi (Tomohon, Danau Linow, Gunung Mahawu, Bukit Kasih, Danau Tondano), serta transportasi lokal (Mikrolet Manado, rute terminal Paal 2/Malalayang).
- **Alternatif**: Hanya mengubah prompt LLM online tanpa fallback. Ditolak karena pengguna yang tidak memiliki API key Gemini pribadi akan tetap menerima pesan penolakan lama jika sistem offline.

### 4. Kompatibilitas Leaflet saat Render Responsive
- **Keputusan**: Menambahkan pemanggilan `map.invalidateSize()` saat toggle panel daftar dibuka/tutup agar kanvas Leaflet langsung menyesuaikan ukuran kontainer tanpa lag visual atau area abu-abu (*grey tiles*).

## Risks / Trade-offs

- **[Risk]** Ruang layar pada layar smartphone terbatas jika peta dan daftar ditampilkan bersamaan.  
  → **Mitigasi**: Sediakan toggle switcher ringkas di bagian bawah layar smartphone (misal: "Tampilkan Daftar (12)" vs "Tampilkan Peta") dengan transisi mulus.
- **[Risk]** Penggunaan dialek Manado yang terlalu arkais atau sulit dipahami pengunjung dari luar daerah.  
  → **Mitigasi**: Gunakan Bahasa Melayu Manado modern yang umum, ramah, dan komunikatif dengan struktur kalimat yang tetap mudah dicerna oleh wisatawan nusantara.
- **[Risk]** Kecepatan respon chatbot fallback untuk variasi pertanyaan tak terduga.  
  → **Mitigasi**: Implementasikan pencocokan kata kunci fuzzy bertingkat (*multi-intent matcher*) pada fallback lokal serta kemampuan memberikan saran ramah dalam Bahasa Manado jika topik benar-benar asing.

## Migration Plan

1. Tidak ada perubahan destruktif (*zero breaking changes*) terhadap data yang tersimpan.
2. Komponen `MapView.tsx` diperbarui dengan arsitektur split-view baru.
3. Service `aiService.ts` dan komponen `ChatbotView.tsx` diperbarui untuk mendukung dialek Manado dan penanganan di luar katalog.
