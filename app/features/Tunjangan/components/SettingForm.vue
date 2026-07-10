<template>
  <div class="card">
    <div class="card-body">
      <div class="row g-3">
        <!-- Tarif -->
        <div class="col-md-6">
          <label class="form-label">Tarif (Rp)</label>

          <input
            type="text"
            class="form-control text-end"
            :value="formatCurrency(form.base_fare)"
            @input="updateCurrency"
          />
        </div>

        <!-- Berlaku Mulai -->
        <div class="col-md-6">
          <label class="form-label">Berlaku Mulai</label>

          <input
            type="date"
            class="form-control"
            v-model="form.effective_start"
          />
        </div>

        <!-- Minimum Kilometer -->
        <div class="col-md-6">
          <label class="form-label">Minimum Kilometer</label>

          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="form.min_km"
          />
        </div>

        <!-- Maksimum Kilometer -->
        <div class="col-md-6">
          <label class="form-label">Maksimum Kilometer</label>

          <input
            type="number"
            min="0"
            class="form-control"
            v-model.number="form.max_km"
          />
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="save" :disabled="loading">
          Simpan
        </button>

        <button class="btn btn-outline-primary">Kembali</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from "vue-sonner";
const loading = ref(false);

const form = ref({
  base_fare: 0,
  effective_start: "",
  min_km: 0,
  max_km: 0,
});

const getData = async () => {
  try {
    const response = await $fetch("/api/hrms/transport-allowance/setting");

    if (response.success) {
      if (response.data) {
        form.value = {
          base_fare: Number(response.data.base_fare),
          effective_start: response.data.effective_start
            ? response.data.effective_start.substring(0, 10)
            : "",
          min_km: Number(response.data.min_km),
          max_km: Number(response.data.max_km),
        };
      }
    } else {
      toast.error(response.message ?? "Gagal mengambil data setting transport");
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error?.data?.message ?? "Terjadi kesalahan saat mengambil data",
    );
  }
};

const save = async () => {
  try {
    loading.value = true;

    const response = await $fetch("/api/hrms/transport-allowance/setting", {
      method: "POST",
      body: form.value,
    });

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message ?? "Gagal menyimpan data");
    }
  } catch (error) {
    console.error(error);

    toast.error(error?.data?.message ?? "Terjadi kesalahan server");
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (value) => {
  if (!value) return "";

  return new Intl.NumberFormat("id-ID").format(value);
};

const updateCurrency = (event) => {
  const value = event.target.value.replace(/\D/g, "");

  form.value.base_fare = Number(value);
};

onMounted(() => {
  getData();
});
</script>
