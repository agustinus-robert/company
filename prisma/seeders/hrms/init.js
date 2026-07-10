import attendances from "./attendances.json" with { type: "json" };
import transport from "./transport.json" with { type: "json" };


async function seedAttendance(prisma) {

    console.log("Seeding attendances...");

    for (const item of attendances.imports) {

        const attendanceImport = await prisma.attendanceImport.create({
            data: {
                user_id: item.user_id,
                original_filename: item.original_filename,

                period_year: item.period_year,
                period_month: item.period_month,

                status: item.status,

                total_rows: item.total_rows,
                processed_rows: item.processed_rows,

                error_message: item.error_message,

                started_at: item.started_at
                    ? new Date(item.started_at)
                    : null,

                finished_at: item.finished_at
                    ? new Date(item.finished_at)
                    : null
            }
        });


        if (item.attendances?.length) {

            for (const attendance of item.attendances) {

                await prisma.attendance.create({
                    data: {
                        employee_id: attendance.employee_id,

                        attendance_import_id:
                            attendanceImport.id,

                        attendance_date:
                            new Date(attendance.attendance_date),

                        checkin_at:
                            attendance.checkin_at
                                ? new Date(attendance.checkin_at)
                                : null,

                        checkout_at:
                            attendance.checkout_at
                                ? new Date(attendance.checkout_at)
                                : null,

                        checkin_location:
                            attendance.checkin_location,

                        checkout_location:
                            attendance.checkout_location,

                        attendance_type:
                            attendance.attendance_type,

                        duration_hours:
                            attendance.duration_hours,

                        status:
                            attendance.status,

                        verification_status:
                            attendance.verification_status,

                        verified_by_role:
                            attendance.verified_by_role,

                        remarks:
                            attendance.remarks
                    }
                });

            }
        }
    }


    for (const summary of attendances.summaries) {

        await prisma.attendanceSummary.create({
            data: {
                employee_id: summary.employee_id,

                period_year: summary.period_year,
                period_month: summary.period_month,

                hadir: summary.hadir,

                cuti: summary.cuti,
                kuota_cuti: summary.kuota_cuti,

                izin: summary.izin,
                kuota_izin: summary.kuota_izin,

                unpaid_leave:
                    summary.unpaid_leave,

                kuota_unpaid_leave:
                    summary.kuota_unpaid_leave,

                status_hadir:
                    summary.status_hadir,

                calculated_at:
                    summary.calculated_at
                        ? new Date(summary.calculated_at)
                        : null
            }
        });

    }


    console.log("Attendances seeded");
}



async function seedTransport(prisma) {

    console.log("Seeding transport...");


    for (const setting of transport.settings) {

        await prisma.transportAllowanceSetting.create({
            data: {
                base_fare: setting.base_fare,

                effective_start:
                    new Date(setting.effective_start),

                min_km: setting.min_km,

                max_km: setting.max_km,

                is_active: setting.is_active,

                created_by: setting.created_by
            }
        });

    }


    for (const period of transport.periods) {

        const allowancePeriod =
            await prisma.transportAllowancePeriod.create({
                data: {
                    period_year: period.period_year,

                    period_month: period.period_month,

                    total_recipients:
                        period.total_recipients,

                    total_amount:
                        period.total_amount,

                    status:
                        period.status,

                    calculated_by:
                        period.calculated_by,

                    calculated_at:
                        period.calculated_at
                            ? new Date(period.calculated_at)
                            : null
                }
            });


        if (period.details?.length) {

            for (const detail of period.details) {

                await prisma.transportAllowanceDetail.create({
                    data: {
                        transport_allowance_period_id:
                            allowancePeriod.id,

                        employee_id:
                            detail.employee_id,

                        base_fare:
                            detail.base_fare,

                        original_km:
                            detail.original_km,

                        rounded_km:
                            detail.rounded_km,

                        attendance_days:
                            detail.attendance_days,

                        nominal:
                            detail.nominal,

                        eligibility_status:
                            detail.eligibility_status,

                        calculation_note:
                            detail.calculation_note
                    }
                });

            }
        }
    }


    console.log("Transport seeded");
}



export default async function hrmsInit(prisma) {

    await seedAttendance(prisma);

    await seedTransport(prisma);

    console.log("Attendance & Transport seed completed");

}