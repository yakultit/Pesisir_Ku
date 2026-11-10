# Tasks: Peta Posisi, Daftar Lokasi Terkoordinasi, dan Chatbot Bahasa Manado

## 1. Peta Posisi dan Panel Daftar Lokasi Terintegrasi

- [x] 1.1 Rancang struktur layout split-pane pada `src/components/MapView.tsx` yang membagi area menjadi panel daftar lokasi (*location list*) dan kanvas peta interaktif, serta verifikasi tata letak tampil proporsional pada desktop dan mobile
- [x] 1.2 Buat komponen kartu destinasi ringkas (*DestinationCard*) di dalam daftar lokasi yang memuat foto thumbnail, nama destinasi, badge kategori, wilayah, tiket masuk, dan tombol aksi cepat (fokus peta & detail), serta verifikasi kartu dapat di-render dengan data destinasi yang ada
- [x] 1.3 Tambahkan tombol toggle responsif untuk membuka/menutup panel daftar lokasi pada tampilan desktop maupun mobile, serta pastikan `map.invalidateSize()` terpanggil agar kanvas Leaflet langsung merespons perubahan ukuran kontainer

## 2. Sinkronisasi Dua Arah dan Filter Kategori

- [x] 2.1 Perbarui kontrol filter kategori pada `src/components/MapView.tsx` ('Semua', 'Pantai', 'Pulau & Bawah Laut', 'Ekowisata Mangrove', 'Spot Diving/Snorkeling', 'Kuliner Pesisir') dan verifikasi pemilihan filter kategori secara simultan menyaring pin di peta dan kartu di daftar lokasi
- [x] 2.2 Implementasikan interaksi klik pada kartu daftar lokasi yang memusatkan pandangan peta (*map.flyTo*) ke koordinat destinasi dan membuka popup penanda terkait secara otomatis
- [x] 2.3 Implementasikan interaksi klik pada marker peta yang menyorot dan menggulir kartu terkait pada panel daftar lokasi ke posisi pandangan pengguna (*scrollIntoView*)
- [x] 2.4 Integrasikan input pencarian teks agar hasil pencarian memperbarui hitungan total destinasi dan menyaring kartu daftar lokasi beserta pin peta

## 3. Peningkatan Chatbot Berbahasa Manado & Penanganan di Luar Katalog

- [x] 3.1 Perbarui system prompt pada fungsi `askPesisirRAGChatbot` di `src/services/aiService.ts` untuk menghapus batasan penolakan kaku, mengizinkan penjelasan topik/destinasi di luar data beranda, dan menginstruksikan LLM merespons menggunakan Bahasa Manado (Melayu Manado) yang santun dan akrab
- [x] 3.2 Bangun basis pengetahuan lokal (*local fallback knowledge base*) di `src/services/aiService.ts` yang memuat informasi populer Sulawesi Utara (seperti kuliner tinutuan, klappertaart, cakalang fufu, wisata Tomohon, Danau Linow, transportasi mikro) yang diformulasikan dalam Bahasa Manado agar berfungsi optimal saat offline atau tanpa API key
- [x] 3.3 Sesuaikan antarmuka `src/components/ChatbotView.tsx` dengan menambahkan salam pembuka bernuansa Manado, contoh pertanyaan relevan (termasuk hal di luar katalog), serta badge indikator dukungan Bahasa Manado

## 4. Pengujian & Verifikasi Menyeluruh

- [x] 4.1 Lakukan uji build dan linting proyek menggunakan `npm run build` dan `npm run lint` untuk memastikan tidak ada kesalahan kompilasi TypeScript atau CSS
- [x] 4.2 Verifikasi fungsional interaktivitas peta dan daftar lokasi di peramban, serta uji variasi pertanyaan chatbot baik yang ada di dalam katalog maupun yang di luar katalog dalam Bahasa Manado
