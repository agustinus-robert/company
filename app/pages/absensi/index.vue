<template>
  <NuxtLayout name="default">
    <template #actions>
      <button class="btn btn-outline-primary" @click="downloadTemplate">
        <IconDownload size="20" stroke="{2}" />

        Download Template
      </button>

      <button class="btn btn-primary" @click="openImport">
        <IconUpload size="20" stroke="{2}" />

        Import Excel
      </button>

      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls"
        hidden
        @change="importExcel"
      />
    </template>

    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto">
          <!-- Periode -->

          <select class="form-select" style="width: 180px">
            <option value="">Pilih Periode</option>
          </select>

          <!-- Status -->

          <select class="form-select" style="width: 180px">
            <option value="">Status Hadir</option>

            <option value="Terpenuhi">Terpenuhi</option>

            <option value="Tidak terpenuhi">Tidak terpenuhi</option>
          </select>

          <!-- Search -->

          <div class="input-group" style="width: 200px">
            <input
              type="text"
              class="form-control"
              placeholder="Cari Data ..."
            />

            <button class="btn">
              <IconSearch stroke="{2}" />
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">No</th>

              <th>Nama</th>

              <th>Jabatan</th>

              <th>Hadir</th>

              <th>Status Hadir</th>

              <th>Cuti</th>

              <th>Kuota Cuti</th>

              <th>Izin</th>

              <th>Kuota Izin</th>

              <th>Unpaid Leave</th>

              <th>Kuota Unpaid Leave</th>

              <th width="10">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in attendances" :key="item.id">
              <td>
                {{ index + 1 }}
              </td>

              <td>
                {{ item.name }}
              </td>

              <td>
                {{ item.position?.name }}
              </td>

              <td>
                {{ Number(item.hadir).toFixed(1) }}
              </td>

              <td>
                <span
                  class="badge"
                  :class="
                    item.status_hadir === 'Terpenuhi'
                      ? 'bg-success'
                      : 'bg-danger'
                  "
                >
                  {{ item.status_hadir }}
                </span>
              </td>

              <td>
                {{ Number(item.cuti).toFixed(1) }}
              </td>

              <td>
                {{ Number(item.kuota_cuti).toFixed(1) }}
              </td>

              <td>
                {{ Number(item.izin).toFixed(1) }}
              </td>

              <td>
                {{ Number(item.kuota_izin).toFixed(1) }}
              </td>

              <td>
                {{ Number(item.unpaid_leave).toFixed(1) }}
              </td>

              <td>
                {{ Number(item.kuota_unpaid_leave).toFixed(1) }}
              </td>

              <td>
                <NuxtLink
                  :to="`/absensi/${item.employee_id}`"
                  class="text-dark"
                >
                  <span data-bs-toggle="tooltip" title="Detail Presensi">
                    <IconEye stroke="{1}" size="20" />
                  </span>
                </NuxtLink>
              </td>
            </tr>

            <tr v-if="!attendances.length">
              <td colspan="12" class="text-center text-secondary">
                Tidak ada data presensi
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer d-flex align-items-center">
        <ul class="pagination ms-auto m-0">
          <li class="page-item active">
            <a class="page-link"> 1 </a>
          </li>
        </ul>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  title: "Presensi",

  middleware: "auth",

  layout: false,
});

useSeoMeta({
  title: "Presensi",
});

import {
  IconSearch,
  IconEye,
  IconDownload,
  IconUpload,
} from "@tabler/icons-vue";

const attendances = ref([]);

const fileInput = ref(null);

const getAttendanceSummary = async () => {
  try {
    const response = await $fetch("/api/hrms/attendance/summary");

    attendances.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const downloadTemplate = () => {
  window.open("/api/hrms/attendance/excel/template", "_blank");
};

const openImport = () => {
  fileInput.value.click();
};

const importExcel = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await $fetch("/api/hrms/attendance/excel/import", {
      method: "POST",
      body: formData,
    });

    event.target.value = "";

    toast.success("Import Excel diproses", {
      description: "Sistem sedang melakukan rekap presensi",
    });

    checkImportStatus(response.job_id);
  } catch (error) {
    console.error(error);

    toast.error("Import Excel gagal", {
      description:
        error?.data?.statusMessage ||
        "Terjadi kesalahan saat membaca file Excel",
    });
  }
};

const checkImportStatus = async (jobId) => {
  try {
    const response = await $fetch(`/api/hrms/attendance/excel/status/${jobId}`);

    if (response.status === "completed") {
      await getAttendanceSummary();

      toast.success("Rekap presensi selesai", {
        description: "Data tabel telah diperbarui",
      });

      return;
    }

    if (response.status === "failed") {
      toast.error("Rekap presensi gagal", {
        description: response.message || "Terjadi kesalahan saat proses",
      });

      return;
    }

    setTimeout(() => {
      checkImportStatus(jobId);
    }, 3000);
  } catch (error) {
    console.error(error);

    toast.error("Gagal mengecek status import");
  }
};

onMounted(() => {
  getAttendanceSummary();
});
</script>
