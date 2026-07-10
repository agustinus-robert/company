export function calculateAttendance({
  checkin,
  checkout,
  lokasi_checkin,
  lokasi_checkout,
}) {
  if (lokasi_checkin !== lokasi_checkout) {
    return {
      status_hadir: "Tidak masuk",
      hadir: 0,
    };
  }

  const masuk = new Date(`2026-01-01 ${checkin}`);
  const pulang = new Date(`2026-01-01 ${checkout}`);

  let duration = (pulang - masuk) / (1000 * 60 * 60);
  const istirahat = checkin < "13:00" && checkout > "12:00" ? 1 : 0;

  const jamKerja = duration - istirahat;

  const telat = masuk.getHours() * 60 + masuk.getMinutes() - 8 * 60;

  if (jamKerja < 8) {
    return {
      status_hadir: "Tidak terpenuhi",
      hadir: jamKerja,
    };
  }

  if (telat <= 15) {
    return {
      status_hadir: "Terpenuhi",
      hadir: 1,
    };
  }

  return {
    status_hadir: "Halfday",
    hadir: 0.5,
  };
}
