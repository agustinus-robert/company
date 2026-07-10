<template>
  <div class="row g-3">
    <!-- bagian kiri tetap -->

    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Diri</h3>
        </div>

        <div class="card-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label"> NIP </label>

              <input v-model="form.nip" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Nama Lengkap </label>

              <input v-model="form.name" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Email </label>

              <input v-model="form.email" type="email" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Nomor HP </label>

              <input v-model="form.phone" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Tempat Lahir </label>

              <input v-model="form.birth_place" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Tanggal Lahir </label>

              <input
                v-model="form.birth_date"
                type="date"
                class="form-control"
              />
            </div>

            <!-- Pendidikan -->

            <div class="col-12">
              <label class="form-label"> Pendidikan </label>

              <table class="table">
                <thead>
                  <tr>
                    <th>Jenjang</th>
                    <th>Sekolah</th>
                    <th>Tahun</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(edu, index) in form.educations" :key="index">
                    <td>
                      <input
                        v-model="edu.education_level"
                        class="form-control"
                      />
                    </td>

                    <td>
                      <input v-model="edu.school_name" class="form-control" />
                    </td>

                    <td>
                      <input
                        type="number"
                        v-model.number="edu.graduation_year"
                        class="form-control"
                      />
                    </td>

                    <td>
                      <IconXboxXFilled
                        class="text-danger cursor-pointer"
                        @click="removeEducation(index)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <button class="btn btn-primary" @click="addEducation">
                Tambah Data
              </button>
            </div>

            <div class="col-12">
              <label class="form-label"> Alamat Lengkap </label>

              <textarea
                v-model="form.full_address"
                class="form-control"
                rows="3"
              ></textarea>
            </div>

            <div class="col-md-4">
              <label class="form-label"> Kecamatan </label>

              <select v-model="form.district_id" class="form-select">
                <option
                  v-for="item in districts"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label"> Status Pernikahan </label>

              <select v-model="form.marital_status" class="form-select">
                <option value="single">Belum Menikah</option>

                <option value="married">Menikah</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label"> Jumlah Anak </label>

              <input
                v-model="form.children_count"
                type="number"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- kanan -->

    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Kepegawaian</h3>
        </div>

        <div class="card-body">
          <div class="row g-4">
            <div class="col-12">
              <label class="form-label"> Tanggal Masuk </label>

              <input
                v-model="form.joined_at"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Jabatan </label>

              <select v-model="form.position_id" class="form-select">
                <option
                  v-for="item in positions"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label"> Departemen </label>

              <select v-model="form.department_id" class="form-select">
                <option
                  v-for="item in departments"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="card-footer d-flex">
          <div class="d-flex gap-2 ms-auto">
            <button class="btn btn-primary" @click="save" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan" }}
            </button>

            <button class="btn btn-outline-primary" @click="goBack">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconXboxXFilled } from "@tabler/icons-vue";
import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();

const { goBack } = useGoBack();

const isEdit = computed(() => !!route.params.id);

const loading = ref(false);

const form = reactive({
  nip: "",
  name: "",
  email: "",
  phone: "",

  birth_place: "",
  birth_date: "",

  marital_status: "single",
  children_count: 0,

  joined_at: "",

  user_id: null,
  position_id: null,
  department_id: null,
  district_id: null,

  employment_type: "pkwtt",
  gender: "male",

  distance_km: null,

  full_address: "",

  status: "active",

  educations: [],
});

const positions = ref([]);
const departments = ref([]);
const districts = ref([]);

const addEducation = () => {
  form.educations.push({
    education_level: "",
    school_name: "",
    graduation_year: null,
  });
};

const removeEducation = (index) => {
  form.educations.splice(index, 1);
};

const loadMaster = async () => {
  try {
    const [positionsData, departmentsData, districtsData] = await Promise.all([
      $fetch("/api/master/positions"),

      $fetch("/api/master/departments"),

      $fetch("/api/master/districts"),
    ]);

    positions.value = positionsData;

    departments.value = departmentsData;

    districts.value = districtsData;
  } catch (error) {
    console.error("Gagal load master:", error);
  }
};

const loadEmployee = async () => {
  if (!isEdit.value) return;

  try {
    const response = await $fetch(`/api/employees/${route.params.id}`);

    Object.assign(form, response.data);

    form.birth_date = response.data.birth_date
      ? response.data.birth_date.substring(0, 10)
      : "";

    form.joined_at = response.data.joined_at
      ? response.data.joined_at.substring(0, 10)
      : "";
  } catch (error) {
    console.error("Gagal load employee:", error);
  }
};

const save = async () => {
  try {
    loading.value = true;

    let response;

    if (isEdit.value) {
      response = await $fetch(`/api/employees/${route.params.id}`, {
        method: "PUT",
        body: form,
      });
    } else {
      response = await $fetch("/api/employees", {
        method: "POST",
        body: form,
      });
    }

    if (response.success == true) {
      toast.success(response.message, {
        duration: 1000,
      });

      setTimeout(() => {
        router.push("/pegawai");
      }, 1000);
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.error(error);

    toast.error(error?.data?.message);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadMaster();

  await loadEmployee();
});
</script>
