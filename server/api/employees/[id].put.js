import { prisma } from "#root/server/db/prisma.js";

export default defineEventHandler(async (event) => {
  console.log("MASUK PDF ID ROUTE put");

  try {
    const id = Number(event.context.params.id);

    const body = await readBody(event);

    const employee = await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.update({
        where: {
          id,
        },

        data: {
          name: body.name,

          email: body.email,
          phone: body.phone,

          birth_place: body.birth_place,

          birth_date: body.birth_date ? new Date(body.birth_date) : null,

          joined_at: body.joined_at ? new Date(body.joined_at) : null,

          position_id: Number(body.position_id),
          department_id: Number(body.department_id),
          district_id: Number(body.district_id),

          employment_type: body.employment_type,

          gender: body.gender,

          marital_status: body.marital_status,

          children_count: Number(body.children_count ?? 0),

          distance_km: body.distance_km ? Number(body.distance_km) : null,

          full_address: body.full_address,

          updated_by: body.updated_by,
        },
      });

      // update pendidikan
      if (body.educations) {
        await tx.employeeEducation.deleteMany({
          where: {
            employee_id: id,
          },
        });

        await tx.employeeEducation.createMany({
          data: body.educations.map((item, index) => ({
            employee_id: id,

            education_level: item.education_level,

            school_name: item.school_name,

            graduation_year: item.graduation_year
              ? Number(item.graduation_year)
              : null,

            sort_order: index,
          })),
        });
      }

      return employee;
    });

    return {
      success: true,
      message: "Data Pegawai diperbarui",
      data: employee,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error?.meta?.target
        ? `Data duplikat: ${error.meta.target.join(", ")}`
        : (error.message ?? "Gagal memperbarui data"),
    };
  }
});
