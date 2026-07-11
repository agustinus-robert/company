<template>
  <div class="row g-3" v-if="employee">
    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Diri</h3>
        </div>

        <div class="card-body">
          <div class="row g-4">
            <div class="col-12">
              <div class="row align-items-center">
                <div class="col-auto">
                  <img
                    :src="`/uploads/employee/${employee.photo_path ?? 'default.png'}`"
                    alt=""
                    class="foto-ptofil"
                  />
                </div>

                <div class="col">
                  <div class="datagrid-item mb-4">
                    <div class="datagrid-title">NIP</div>
                    <div class="datagrid-content">
                      {{ employee.nip }}
                    </div>
                  </div>

                  <div class="datagrid-item">
                    <div class="datagrid-title">Nama Lengkap</div>
                    <div class="datagrid-content">
                      {{ employee.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Email</div>
                <div class="datagrid-content">
                  {{ employee.email ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Nomor HP</div>
                <div class="datagrid-content">
                  {{ employee.phone ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Tempat Lahir</div>
                <div class="datagrid-content">
                  {{ employee.birth_place ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Tanggal Lahir</div>
                <div class="datagrid-content">
                  {{ formatDate(employee.birth_date) }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Usia</div>
                <div class="datagrid-content">
                  {{ calculateAge(employee.birth_date) }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Pendidikan</div>

                <div
                  v-for="item in employee.educations"
                  :key="item.id"
                  class="datagrid-content"
                >
                  {{ item.education_level }}
                  /
                  {{ item.school_name }}
                  /
                  {{ item.graduation_year }}
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="datagrid-item">
                <div class="datagrid-title">Alamat Lengkap</div>

                <div class="datagrid-content">
                  {{ employee.full_address ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="datagrid-item">
                <div class="datagrid-title">Kecamatan</div>

                <div class="datagrid-content">
                  {{ employee.district?.name ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="datagrid-item">
                <div class="datagrid-title">Kabupaten</div>

                <div class="datagrid-content">
                  {{ employee.district?.regency?.name ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="datagrid-item">
                <div class="datagrid-title">Provinsi</div>

                <div class="datagrid-content">
                  {{ employee.district?.regency?.province?.name ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Status Pernikahan</div>

                <div class="datagrid-content">
                  {{
                    employee.marital_status === "married"
                      ? "Menikah"
                      : "Belum Menikah"
                  }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Jumlah Anak</div>

                <div class="datagrid-content">
                  {{ employee.children_count ?? 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Kepegawaian</h3>
        </div>

        <div class="card-body">
          <div class="row g-4">
            <div class="col-12">
              <div class="datagrid-item">
                <div class="datagrid-title">Tanggal Masuk</div>

                <div class="datagrid-content">
                  {{ formatDate(employee.joined_at) }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Jabatan</div>

                <div class="datagrid-content">
                  {{ employee.position?.name ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Departemen</div>

                <div class="datagrid-content">
                  {{ employee.department?.name ?? "-" }}
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Status</div>

                <div class="datagrid-content">
                  {{ employee.status ?? "active" }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer d-flex">
          <div class="ms-auto">
            <button class="btn btn-outline-primary" @click="goBack()">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

const { goBack } = useGoBack();

definePageMeta({
  title: "Detail Pegawai",
});

useSeoMeta({
  title: "Detail Pegawai",
});

const employee = ref(null);

const loadEmployee = async () => {
  const response = await $fetch(`/api/employees/nipp/${route.params.nipp}`);

  if (response.success) {
    employee.value = response.data;
  }
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const calculateAge = (date) => {
  if (!date) return "-";

  const birth = new Date(date);

  const now = new Date();

  let age = now.getFullYear() - birth.getFullYear();

  const month = now.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  return `${age} tahun`;
};

onMounted(() => {
  loadEmployee();
});
</script>

<style scoped>
.foto-ptofil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
