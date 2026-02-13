// ============================================
//  CONFIG: GANTI URL APPS SCRIPT KAMU DI SINI
// ============================================
const API_URL =
  "https://script.google.com/macros/s/AKfycbyb2ph5BSueUevV9MJhj1HtAFpsD_fpNJhxry5CWIY4BMcRysEz9jfD1WoCvJg60o1t9A/exec";

// ============================================
//  FUNCTION: LOAD SISWA BERDASARKAN KELAS
// ============================================
function loadSiswa() {
  let kelas = document.getElementById("kelas").value;

  if (!kelas) return;

  let script = document.createElement("script");

  script.src = API_URL + "?kelas=" + kelas + "&callback=tampilkanSiswa";

  document.body.appendChild(script);
}

function tampilkanSiswa(data) {
  let html = "";

  data.forEach(siswa => {
    html += `
      <div class="border rounded p-2 mb-2">
        <b>${siswa.nama}</b>
        <select class="form-select mt-2 status" data-id="${siswa.id_siswa}">
          <option>Hadir</option>
          <option>Izin</option>
          <option>Sakit</option>
          <option>Alfa</option>
        </select>
      </div>
    `;
  });

      // Tampilkan ke halaman
      document.getElementById("daftarSiswa").innerHTML = html;
    })
    .catch(error => {
      document.getElementById("daftarSiswa").innerHTML =
        "<p class='text-danger'>❌ Gagal memuat data siswa.</p>";

      console.error("Error load siswa:", error);
    });
}

// ============================================
//  FUNCTION: SIMPAN ABSENSI KE GOOGLE SHEETS
// ============================================
function simpanAbsensi() {
  let kelas = document.getElementById("kelas").value;
  let mapel = document.getElementById("mapel").value;

  // Validasi input
  if (!kelas || !mapel) {
    alert("⚠ Pilih kelas dan mata pelajaran dulu!");
    return;
  }

  // Ambil tanggal hari ini
  let tanggal = new Date().toISOString().split("T")[0];

  // Ambil semua status siswa
  let absensiData = [];

  document.querySelectorAll(".status").forEach(select => {
    absensiData.push({
      id_siswa: select.dataset.id,
      status: select.value
    });
  });

  // Kalau belum ada siswa
  if (absensiData.length === 0) {
    alert("⚠ Tidak ada siswa untuk diabsen!");
    return;
  }

  // Kirim ke backend Apps Script
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      kelas: kelas,
      mapel: mapel,
      tanggal: tanggal,
      absensi: absensiData
    })
  })
    .then(response => response.json())
    .then(data => {
      alert("✅ " + data.message);
    })
    .catch(error => {
      alert("❌ Gagal menyimpan absensi!");
      console.error("Error simpan absensi:", error);
    });
}

