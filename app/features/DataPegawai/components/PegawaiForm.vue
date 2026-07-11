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

              <input
                v-model="form.nip"
                type="text"
                class="form-control"
                maxlength="20"
                inputmode="numeric"
                @input="form.nip = form.nip.replace(/\D/g, '')"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Nama Lengkap </label>

              <input
                v-model="form.name"
                class="form-control"
                @input="form.name = form.name.replace(/[^A-Za-z0-9\s'’]/g, '')"
              />
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

              <UtilsBaseSelectSearch
                v-model="form.district_id"
                @selected="onSelectedDistrict"
                url="/api/master/districts"
                param="district"
                placeholder="Ketik minimal 3 karakter"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Kabupaten</label>

              <input
                v-model="form.regency_name"
                class="form-control"
                disabled
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Provinsi</label>

              <input
                v-model="form.province_name"
                class="form-control"
                disabled
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Jarak Rumah - Kantor (km)</label>
              <input
                type="number"
                v-model="form.distance_km"
                class="form-control"
                min="0"
                max="99"
                @input="
                  form.distance_km = $event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 2)
                "
              />
            </div>

            <div class="col-md-4">
              <label class="form-label d-block">Status Pernikahan</label>

              <div class="form-check form-check-inline">
                <input
                  id="marital-single"
                  v-model="form.marital_status"
                  class="form-check-input"
                  type="radio"
                  value="single"
                />

                <label class="form-check-label" for="marital-single">
                  Belum Menikah
                </label>
              </div>

              <div class="form-check form-check-inline">
                <input
                  id="marital-married"
                  v-model="form.marital_status"
                  class="form-check-input"
                  type="radio"
                  value="married"
                />

                <label class="form-check-label" for="marital-married">
                  Menikah
                </label>
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-label d-block">Usia</label>
              <input
                type="text"
                class="form-control"
                v-model="form.age"
                disabled
              />
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
          <h3 class="card-title">Upload Foto</h3>
        </div>

        <div class="card-body">
          <label class="form-label"> Foto Pegawai </label>

          <FilePond
            :files="myFiles"
            :server="server"
            accepted-file-types="image/png, image/jpeg"
            label-idle='
    <div class="text-center">
      <i class="ti ti-user fs-1 text-muted"></i><br>
      <span>Drag & Drop foto atau <span class="filepond--label-action">Browse</span></span><br>
      <small>Hanya PNG, JPG, JPEG</small>
    </div>'
            file-validate-type-label-expected-types="Hanya boleh PNG, JPG, atau JPEG"
            @processfile="onProcessFile"
            @updatefiles="onUpdateFiles"
          />
        </div>
      </div>

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

            <div class="col-md-4">
              <label class="form-label"> Jabatan </label>

              <UtilsBaseSelectSearch
                v-model="form.position_id"
                url="/api/master/positions"
                param="position"
                placeholder="Ketik minimal 3 karakter"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label"> Departemen </label>

              <UtilsBaseSelectSearch
                v-model="form.department_id"
                url="/api/master/departments"
                param="department"
                placeholder="Ketik minimal 3 karakter"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label d-block">Status</label>

              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  value="active"
                  v-model="form.status"
                />
                <label class="form-check-label"> Aktif </label>
              </div>

              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  value="inactive"
                  v-model="form.status"
                />
                <label class="form-check-label"> Tidak Aktif </label>
              </div>
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
import vueFilePond from "vue-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
const route = useRoute();
const router = useRouter();

const { goBack } = useGoBack();

const isEdit = computed(() => !!route.params.id);

const loading = ref(false);
const myFiles = ref([]);

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

const server = {
  process: "/api/utilites/upload?folder=employee",

  load: (source, load, error) => {
    const cleanSource =
      source.startsWith("uploads") || source.startsWith("/uploads")
        ? source
        : `uploads/employee/${source}`;

    fetch(`/api/utilites/load?file=${encodeURIComponent(cleanSource)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Load gambar gagal");
        return res.blob();
      })
      .then(load)
      .catch(error);
  },
};

const onProcessFile = (error, file) => {
  if (error) {
    console.log("Upload gagal", error);
    return;
  }
  let jsonParse = JSON.parse(file.serverId);
  form.photo_path = jsonParse.filename;
};

const form = reactive({
  nip: "",
  name: "",
  email: "",
  phone: "",
  age: "",

  birth_place: "",
  birth_date: "",

  marital_status: "single",
  children_count: 0,

  joined_at: "",
  photo_path: "",
  user_id: null,
  position_id: null,
  department_id: null,
  district_id: null,
  regency_name: "",
  province_name: "",

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

const calculateAge = (birthDate) => {
  if (!birthDate) return "";

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 0 ? age : "";
};

watch(
  () => form.birth_date,
  (value) => {
    form.age = calculateAge(value);
  },
  {
    immediate: true,
  },
);

const onSelectedDistrict = (item) => {
  form.district_id = item.id;

  form.regency_name = item.regency?.name ?? "";
  form.province_name = item.regency?.province?.name ?? "";
};

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

const onUpdateFiles = (files) => {
  myFiles.value = files || [];

  if (!files || files.length === 0) {
    form.photo_path = "default.png";
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

    form.distance_km = response.data.distance_km;
    form.status = response.data.status;
    if (response.data.district_id) {
      const district = await $fetch("/api/master/districts", {
        query: {
          id: response.data.district_id,
        },
      });

      const item = district.data?.[0] ?? district[0] ?? district;

      if (item) {
        form.regency_name = item.regency?.name ?? "";
        form.province_name = item.regency?.province?.name ?? "";
      }
    }
    if (response.data.photo_path) {
      myFiles.value = [
        {
          source: response.data.photo_path,
          options: {
            type: "local",
          },
        },
      ];
    }
  } catch (error) {
    console.error("Gagal load employee:", error);
  }
};

const save = async () => {
  const textRegex = /^[A-Za-z0-9\s'’]+$/;

  if (form.name && !textRegex.test(form.name)) {
    toast.error(
      "Nama Lengkap hanya boleh huruf, angka, tanda petik atas (' atau ’), dan spasi.",
    );
    return;
  }

  if (!/^\d{8,}$/.test(form.nip)) {
    toast.error(
      "NIP minimal 8 digit, hanya boleh angka, dan tidak boleh ada spasi.",
    );
    return;
  }

  if (
    form.email &&
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)
  ) {
    toast.error("Email harus menggunakan format yang valid.");
    return;
  }

  if (form.phone && !/^\+[1-9]\d{7,14}$/.test(form.phone)) {
    toast.error(
      "Nomor HP harus menggunakan format internasional, contoh: +6282218458888.",
    );
    return;
  }

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
