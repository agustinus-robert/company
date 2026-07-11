import bcrypt from "bcrypt";
import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const employee = await prisma.$transaction(async (tx) => {
      const password = await bcrypt.hash(body.nip, 10);

      const user = await tx.user.create({
        data: {
          name: body.name,
          username: body.nip,
          email: body.email,
          cellphone: body.phone,
          password,

          role_id: 2,
          status: "active",
        },
      });

      return await tx.employee.create({
        data: {
          user_id: user.id,

          nip: body.nip,
          name: body.name,

          email: body.email,
          phone: body.phone,
          photo_path: body.photo_path ?? "default.png",
          birth_place: body.birth_place,

          birth_date: body.birth_date ? new Date(body.birth_date) : null,

          marital_status: body.marital_status,
          children_count: Number(body.children_count ?? 0),

          joined_at: body.joined_at ? new Date(body.joined_at) : null,

          position_id: Number(body.position_id),
          department_id: Number(body.department_id),
          district_id: Number(body.district_id),

          employment_type: body.employment_type,
          gender: body.gender,

          distance_km: body.distance_km ? Number(body.distance_km) : null,

          full_address: body.full_address,

          created_by: body.created_by,
          status: body.status,

          educations: {
            create:
              body.educations?.map((item, index) => ({
                education_level: item.education_level,
                school_name: item.school_name,

                graduation_year: item.graduation_year
                  ? Number(item.graduation_year)
                  : null,

                sort_order: index,
              })) ?? [],
          },
        },

        include: {
          educations: true,
        },
      });
    });

    return {
      success: true,
      message: "Data Pegawai disimpan",
      data: employee,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error?.meta?.target
        ? `Data duplikat: ${error.meta.target.join(", ")}`
        : (error.message ?? "Gagal menyimpan data"),
    };
  }
});
