import departments from "./departments.json" with { type: "json" };
import positions from "./positions.json" with { type: "json" };
import provinces from "./provinces.json" with { type: "json" };
import regencies from "./regency.json" with { type: "json" };
import districts from "./districts.json" with { type: "json" };
import employees from "./employees.json" with { type: "json" };


async function seedDepartments(prisma) {
    console.log("Seeding departments...");

    for (const item of departments) {
        await prisma.department.create({
            data: {
                code: item.code,
                name: item.name
            }
        });
    }

    console.log("Departments seeded");
}


async function seedPositions(prisma) {
    console.log("Seeding positions...");

    for (const item of positions) {
        await prisma.position.create({
            data: {
                code: item.code,
                name: item.name,
                position_type: item.position_type
            }
        });
    }

    console.log("Positions seeded");
}


async function seedProvinces(prisma) {
    console.log("Seeding provinces...");

    for (const item of provinces) {
        await prisma.province.create({
            data: {
                code: item.code,
                name: item.name
            }
        });
    }

    console.log("Provinces seeded");
}


async function seedRegencies(prisma) {
    console.log("Seeding regencies...");

    for (const item of regencies) {
        await prisma.regency.create({
            data: {
                province_id: item.province_id,
                code: item.code,
                name: item.name
            }
        });
    }

    console.log("Regencies seeded");
}


async function seedDistricts(prisma) {
    console.log("Seeding districts...");

    for (const item of districts) {
        await prisma.district.create({
            data: {
                regency_id: item.regency_id,
                code: item.code,
                name: item.name
            }
        });
    }

    console.log("Districts seeded");
}


async function seedEmployees(prisma) {
    console.log("Seeding employees...");

    for (const item of employees.employees) {

        const employee = await prisma.employee.create({
            data: {
                nip: item.nip,
                name: item.name,
                email: item.email,
                phone: item.phone,

                photo_path: item.photo_path,

                birth_place: item.birth_place,
                birth_date: item.birth_date
                    ? new Date(item.birth_date)
                    : null,

                marital_status: item.marital_status,
                children_count: item.children_count,

                joined_at: item.joined_at
                    ? new Date(item.joined_at)
                    : null,

                user_id: item.user_id,
                position_id: item.position_id,
                department_id: item.department_id,
                district_id: item.district_id,

                employment_type: item.employment_type,
                gender: item.gender,

                distance_km: item.distance_km,

                full_address: item.full_address,

                status: item.status
            }
        });


        if (item.educations?.length) {

            for (const education of item.educations) {

                await prisma.employeeEducation.create({
                    data: {
                        employee_id: employee.id,
                        education_level: education.education_level,
                        school_name: education.school_name,
                        graduation_year: education.graduation_year,
                        sort_order: education.sort_order
                    }
                });

            }
        }
    }

    console.log("Employees seeded");
}


export default async function employeeInit(prisma) {

    await seedDepartments(prisma);

    await seedPositions(prisma);

    await seedProvinces(prisma);
    await seedRegencies(prisma);
    await seedDistricts(prisma);

    await seedEmployees(prisma);

    console.log("All employee seed completed");
}