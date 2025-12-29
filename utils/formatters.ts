
export const formatCurrency = (price: string | undefined | null): string => {
  if (price === null || price === undefined || price.trim() === '') {
    return '';
  }

  // 1. Bersihkan input dari semua karakter non-digit untuk mendapatkan angkanya saja.
  // Contoh: "Rp 64.000" -> "64000"
  const numericString = price.toString().replace(/\D/g, '');

  // 2. Jika setelah dibersihkan tidak ada angka, kembalikan string kosong.
  if (numericString === '') {
    return '';
  }

  // 3. Konversi string angka menjadi tipe number.
  const number = parseInt(numericString, 10);

  // 4. Gunakan Intl.NumberFormat untuk memformat angka sesuai standar Indonesia (id-ID),
  // yang secara otomatis menggunakan titik sebagai pemisah ribuan.
  const formattedNumber = new Intl.NumberFormat('id-ID').format(number);

  // 5. Gabungkan dengan prefix "Rp " untuk hasil akhir.
  return `Rp ${formattedNumber}`;
};
