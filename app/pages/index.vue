<script setup>
definePageMeta({
  title: "Dashboard",
  middleware: "auth",
});

useSeoMeta({
  title: "Dashboard",
});

const { user } = useAuth();

const dashboard = ref(null);

const isSuperAdmin = computed(() => {
  return user.value?.role?.code === "SUPER_ADMIN";
});

const isManagerHRD = computed(() => {
  return user.value?.role?.code === "MANAGER_HRD";
});

const isAdminHRD = computed(() => {
  return user.value?.role?.code === "ADMIN_HRD";
});

const loadDashboard = async () => {
  try {
    const response = await $fetch("/api/dashboard");

    if (response.success) {
      dashboard.value = response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const statusPegawaiSeries = computed(() => {
  return dashboard.value?.chartStatus ?? [];
});

const genderPegawaiSeries = computed(() => {
  return dashboard.value?.chartGender ?? [];
});

const statusPegawaiOptions = {
  chart: {
    type: "donut",
    height: 200,
  },

  labels: ["PKWT", "PKWTT", "Magang"],

  legend: {
    position: "bottom",
  },

  dataLabels: {
    enabled: true,
  },
};

const genderPegawaiOptions = {
  chart: {
    type: "donut",
    height: 200,
  },

  labels: ["Laki-laki", "Perempuan"],

  legend: {
    position: "bottom",
  },

  dataLabels: {
    enabled: true,
  },
};

onMounted(() => {
  loadDashboard();
});
</script>

<template>
  <div v-if="isSuperAdmin || isAdminHRD" class="card">
    <div class="card-body text-center py-5">
      <h2>
        Selamat Datang
        {{ user?.name }}
        -
        {{ user?.role?.name }}
      </h2>
    </div>
  </div>

  <div v-if="isManagerHRD">
    <div class="row g-3">
      <div class="col-md-3">
        <div class="card bg-dark h-100">
          <div class="card-body">
            <div class="text-center">
              <img
                src="@/assets/images/greeting-img.svg"
                class="img-fluid mb-4"
              />
            </div>

            <h3 class="card-title text-white">
              Halo,
              {{ user?.name }}
            </h3>

            <p class="text-white fw-lighter fst-italic">
              "Fokuskan tujuan yang ingin didapat, jangan biarkan faktor lain
              menghalangi tujuan Anda"
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="card">
          <div class="card-body">
            <div class="row g-3">
              <div
                v-for="(item, index) in dashboard?.statistik ?? []"
                :key="index"
                class="col-md-6 col-lg-3"
              >
                <div class="text-center">
                  <h3 class="fs-2 mb-1">
                    {{ item.value }}
                  </h3>

                  <p class="text-secondary mb-0">
                    {{ item.title }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3 mt-1">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">
                  Total Pegawai Berdasarkan Status Kontrak
                </h3>

                <ClientOnly>
                  <apexchart
                    type="donut"
                    height="250"
                    :options="statusPegawaiOptions"
                    :series="statusPegawaiSeries"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">Total Pegawai Berdasarkan Gender</h3>

                <ClientOnly>
                  <apexchart
                    type="donut"
                    height="250"
                    :options="genderPegawaiOptions"
                    :series="genderPegawaiSeries"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-header">
        <h3 class="card-title">Data Pegawai Terbaru</h3>
      </div>

      <div class="table-responsive">
        <table class="table table-vcenter table-striped">
          <thead>
            <tr>
              <th>No</th>

              <th>NIP</th>

              <th>Nama Lengkap</th>

              <th>Tanggal Masuk</th>

              <th>Status</th>

              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in dashboard?.pegawaiTerbaru ?? []"
              :key="item.nip"
            >
              <td>
                {{ index + 1 }}
              </td>

              <td>
                {{ item.nip }}
              </td>

              <td>
                <div class="d-flex align-items-center gap-2">
                  <img
                    :src="`/uploads/employee/${item.photo_path ?? 'default.png'}`"
                    width="32"
                    height="32"
                    class="rounded-circle"
                  />

                  {{ item.name }}
                </div>
              </td>

              <td>
                {{
                  item.joined_at
                    ? new Date(item.joined_at).toLocaleDateString("id-ID")
                    : "-"
                }}
              </td>

              <td>
                {{ item.employment_type.toUpperCase() }}
              </td>

              <td>
                <NuxtLink
                  :to="`/pegawai/${item.nip}`"
                  class="btn btn-primary btn-sm"
                >
                  Detail Pegawai
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
