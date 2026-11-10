# Proposal: Peta Posisi, Daftar Lokasi dengan Filter Kategori, dan Chatbot Berbahasa Manado

## Why

Pengguna saat ini hanya dapat melihat peta penuh atau modal detail terpisah tanpa adanya daftar lokasi terstruktur yang berdampingan dengan peta dan filter kategori yang mudah dijelajahi. Selain itu, chatbot saat ini menolak pertanyaan yang tidak ada dalam katalog resmi beranda dengan respons kaku ("data belum mencakup hal tersebut"), padahal wisatawan dan warga lokal sering membutuhkan rekomendasi fleksibel, panduan wisata sekitar, dan informasi umum Sulawesi Utara yang disampaikan secara ramah dan akrab menggunakan Bahasa Manado (Melayu Manado).

## What Changes

- **Peta Posisi & Daftar Lokasi Terintegrasi**:
  - Menghadirkan tampilan terpadu antara peta interaktif Leaflet dan panel/daftar lokasi (*location list*) yang responsif (desktop split-pane / mobile expandable drawer atau tab toggle).
  - Sinkronisasi dua arah: mengklik kartu destinasi di daftar lokasi akan memusatkan (*flyTo*) dan membuka pin penanda pada peta, serta sebaliknya mengklik pin pada peta akan menyorot kartu terkait di daftar lokasi.
- **Filter Kategori yang Komprehensif**:
  - Filter kategori yang jelas dan responsif ('Semua', 'Pantai', 'Pulau & Bawah Laut', 'Ekowisata Mangrove', 'Spot Diving/Snorkeling', 'Kuliner Pesisir').
  - Filter kategori secara serentak menyaring pin pada peta dan item kartu dalam daftar lokasi, dilengkapi indikator jumlah lokasi yang sesuai.
- **Chatbot Berkemampuan Luar Katalog dalam Bahasa Manado**:
  - Menghilangkan batasan kaku penolakan informasi di luar data katalog beranda.
  - Chatbot diperbarui agar mampu menjawab pertanyaan umum tentang wisata, kuliner khas (tinutuan, cakalang fufu, klappertaart), budaya, rute transportasi lokal (mikro/angkot), dan lokasi lain di Manado/Sulawesi Utara di luar katalog beranda.
  - Respons chatbot saat menjawab pertanyaan di luar daftar beranda (maupun saat berkomunikasi ramah) secara konsisten menggunakan dialek Bahasa Manado yang natural, hangat, dan komunikatif (misal: "Halo bro/sis, biar nyanda ada di list beranda...", "ngana bisa pi ka...", "jang lupa singgah...", dll.).
  - Menyediakan fallback cerdas berbasis pengetahuan lokal (*local knowledge fallback*) sehingga chatbot tetap dapat merespons dalam Bahasa Manado meskipun tanpa Gemini API key eksternal.

## Capabilities

### New Capabilities
- `location-map-catalog`: Tampilan peta posisi geografis interaktif yang terhubung langsung dengan daftar kartu destinasi, pencarian teks, dan filter kategori pesisir yang responsif.
- `manado-dialect-chatbot`: Asisten percakapan cerdas yang dapat menangani topik dan destinasi di luar data beranda dengan merespons menggunakan Bahasa Manado yang ramah dan kontekstual.

### Modified Capabilities
*(Tidak ada modifikasi kapabilitas sebelumnya karena ini adalah spesifikasi awal sistem)*

## Impact

- **Frontend Components**:
  - `src/components/MapView.tsx`: Dirombak atau diperkaya dengan panel daftar lokasi (*location list sidebar/sheet*), sinkronisasi pin dengan daftar, dan kontrol filter kategori yang lebih terpadu.
  - `src/components/ChatbotView.tsx`: Penyesuaian antarmuka percakapan (starter prompts ramah Manado, badge dialek Manado, penanganan pesan responsif).
- **Services & AI Engine**:
  - `src/services/aiService.ts`: Penyesuaian system prompt Gemini untuk mengizinkan pengetahuan luas Sulawesi Utara dengan Bahasa Manado ketika ditanyakan hal di luar katalog, serta penambahan fallback rule/knowledge base dialek Manado ketika API key tidak aktif.
- **Dependencies**:
  - Memanfaatkan dependency yang sudah ada (`leaflet`, `react-leaflet`, `lucide-react`, `@google/genai`). Tidak diperlukan package eksternal baru.
