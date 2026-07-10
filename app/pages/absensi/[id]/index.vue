<template>
  <NuxtLayout name="default">
    <template #actions>
      <NuxtLink to="/presensi" class="btn btn-outline-secondary">
        <IconArrowLeft size="20" stroke="{2}" />
        Kembali
      </NuxtLink>
    </template>

    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title mb-1">Detail Presensi</h3>

          <div class="text-secondary">
            {{ employee.name }}

            -

            {{ employee.position?.name }}
          </div>
        </div>
      </div>

      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">No</th>

              <th>Tgl</th>

              <th>Lokasi Checkin</th>

              <th>Kehadiran</th>

              <th>Durasi</th>

              <th>Status</th>

              <th>Verifikasi</th>

              <th>Verifikator</th>

              <th>Keterangan</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in attendances" :key="item.id">
              <td>
                {{ index + 1 }}
              </td>

              <td>
                {{ formatDateID(item.attendance_date) }}
              </td>

              <td>
                {{ item.checkin_location ?? "-" }}
              </td>

              <td>
                <span class="badge bg-blue-lt">
                  {{ item.attendance_type }}
                </span>
              </td>

              <td>
                {{ item.duration }}
              </td>

              <td>
                <span
                  class="badge"
                  :class="
                    item.status === 'Terpenuhi' ? 'bg-success' : 'bg-danger'
                  "
                >
                  {{ item.status }}
                </span>
              </td>

              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-success': item.verification === 'Disetujui',

                    'bg-danger': item.verification === 'Ditolak',

                    'bg-warning': item.verification === 'Menunggu',
                  }"
                >
                  {{ item.verification }}
                </span>
              </td>

              <td>
                {{ item.verified_by_role ?? "-" }}
              </td>

              <td>
                {{ item.remarks ?? "-" }}
              </td>
            </tr>

            <tr v-if="attendances.length === 0">
              <td colspan="9" class="text-center text-secondary">
                Tidak ada data presensi
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer">
        Total Data :
        {{ attendances.length }}
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  title: "Detail Presensi",

  middleware: "auth",

  layout: false,
});

useSeoMeta({
  title: "Detail Presensi",
});

import { IconArrowLeft } from "@tabler/icons-vue";

import { formatDateID } from "~/utils/formatDate.js";

const route = useRoute();

const employee = ref({
  name: "",

  position: null,
});

const attendances = ref([]);

const getDetail = async () => {
  try {
    const response = await $fetch(
      `/api/hrms/attendance/employee/${route.params.id}`,
    );

    console.log("API RESPONSE", response);

    employee.value = response.employee ?? employee.value;

    attendances.value = response.data ?? [];
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getDetail();
});
</script>
