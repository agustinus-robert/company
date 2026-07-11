import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async () => {
  const totalPegawai = await prisma.employee.count({
    where: {
      deleted_at: null,
    },
  });

  const totalKontrak = await prisma.employee.count({
    where: {
      deleted_at: null,
      employment_type: "pkwt",
    },
  });

  const totalTetap = await prisma.employee.count({
    where: {
      deleted_at: null,
      employment_type: "pkwtt",
    },
  });

  const totalMagang = await prisma.employee.count({
    where: {
      deleted_at: null,
      employment_type: "magang",
    },
  });

  const totalPria = await prisma.employee.count({
    where: {
      deleted_at: null,
      gender: "male",
    },
  });

  const totalWanita = await prisma.employee.count({
    where: {
      deleted_at: null,
      gender: "female",
    },
  });

  const pegawaiTerbaru = await prisma.employee.findMany({
    where: {
      deleted_at: null,
    },

    select: {
      nip: true,
      name: true,
      photo_path: true,
      joined_at: true,
      employment_type: true,
    },

    orderBy: {
      joined_at: "desc",
    },

    take: 5,
  });

  return {
    success: true,

    data: {
      statistik: [
        {
          title: "Total Pegawai",
          value: totalPegawai,
        },
        {
          title: "Pegawai Kontrak",
          value: totalKontrak,
        },
        {
          title: "Pegawai Tetap",
          value: totalTetap,
        },
        {
          title: "Peserta Magang",
          value: totalMagang,
        },
      ],

      chartStatus: [totalKontrak, totalTetap, totalMagang],

      chartGender: [totalPria, totalWanita],

      pegawaiTerbaru,
    },
  };
});
