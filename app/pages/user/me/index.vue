<template>
  <div class="row g-4">
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Diri</h3>
        </div>

        <div class="card-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label"> Nama Lengkap </label>

              <input v-model="form.name" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Username </label>

              <input v-model="form.username" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Email </label>

              <input v-model="form.email" type="email" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Nomor HP </label>

              <input v-model="form.cellphone" class="form-control" />
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-header">
          <h3 class="card-title">Ubah Password</h3>
        </div>

        <div class="card-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label"> Password Baru </label>

              <input
                v-model="form.password"
                type="password"
                class="form-control"
                autocomplete="new-password"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label"> Konfirmasi Password </label>

              <input
                v-model="form.password_confirmation"
                type="password"
                class="form-control"
                autocomplete="new-password"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-footer d-flex">
          <div class="d-flex gap-2 ms-auto">
            <button class="btn btn-primary" @click="save" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Informasi Akun</h3>
        </div>

        <div class="card-body">
          <div class="mb-3">
            <label class="form-label"> Status </label>

            <input class="form-control" :value="form.status" disabled />
          </div>

          <div class="mb-3">
            <label class="form-label"> Role </label>

            <input class="form-control" :value="form.role_name" disabled />
          </div>

          <div>
            <label class="form-label"> Login Terakhir </label>

            <input class="form-control" :value="form.last_login_at" disabled />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from "vue-sonner";

useHead({
  title: "Data Anda",
});

const loading = ref(false);

const form = reactive({
  name: "",
  username: "",
  email: "",
  cellphone: "",

  password: "",
  password_confirmation: "",

  status: "",
  role_name: "",
  last_login_at: "",
});

const loadProfile = async () => {
  try {
    const response = await $fetch("/api/user/me");

    Object.assign(form, response.data);
  } catch (error) {
    toast.error("Gagal mengambil data profile");
  }
};

const save = async () => {
  if (form.password) {
    if (form.password !== form.password_confirmation) {
      toast.error("Konfirmasi password tidak sama");

      return;
    }

    if (form.password.length < 8) {
      toast.error("Password minimal 8 karakter");

      return;
    }
  }

  try {
    loading.value = true;

    const response = await $fetch("/api/user/me", {
      method: "PUT",
      body: form,
    });

    if (response.success) {
      toast.success(response.message, {
        duration: 1000,
      });

      form.password = "";
      form.password_confirmation = "";
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error(error?.data?.message ?? "Gagal menyimpan data");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>
