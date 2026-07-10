<template>
  <div>
    <h3 class="card-title">Bulan {{ period.title }}</h3>

    <div class="card">
      <div class="card-header">
        <button class="btn btn-primary">Hitung Tunjangan</button>

        <div class="ms-auto">
          <div class="input-group">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Cari Data..."
            />

            <button class="btn" type="button">
              <IconSearch :stroke="2" />
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">No</th>
              <th>Nama Penerima</th>
              <th class="text-center">Kilometer</th>
              <th class="text-center">Jumlah Hari</th>
              <th class="text-end">Nominal</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="pending">
              <td colspan="5" class="text-center py-4">Memuat data...</td>
            </tr>

            <tr
              v-else-if="detailTunjanganTransport.length"
              v-for="(item, index) in detailTunjanganTransport"
              :key="item.id"
            >
              <td class="text-center">
                {{ (page - 1) * limit + index + 1 }}
              </td>

              <td>{{ item.nama }}</td>

              <td class="text-center">
                {{ item.km }}
              </td>

              <td class="text-center">
                {{ item.hari }}
              </td>

              <td class="text-end">
                {{ formatRupiah(item.nominal) }}
              </td>
            </tr>

            <tr v-else>
              <td colspan="5" class="text-center py-4">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="card-footer d-flex justify-content-between align-items-center"
      >
        <small> Total {{ pagination.total || 0 }} data </small>

        <ul class="pagination m-0">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" :disabled="page === 1" @click="page--">
              Previous
            </button>
          </li>

          <li
            v-for="n in pagination.totalPages || 1"
            :key="n"
            class="page-item"
            :class="{ active: page === n }"
          >
            <button class="page-link" @click="page = n">
              {{ n }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{
              disabled: page >= (pagination.totalPages || 1),
            }"
          >
            <button
              class="page-link"
              :disabled="page >= (pagination.totalPages || 1)"
              @click="page++"
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import { formatRupiah } from "~/utils/formatRupiah.js";

definePageMeta({
  title: "Detail Tunjangan Transport",
});

useSeoMeta({
  title: "Detail Tunjangan Transport",
});

const route = useRoute();

const page = ref(1);
const limit = ref(10);
const search = ref("");

const { data, pending } = await useFetch(
  `/api/hrms/transport-allowance/period/${route.params.id}`,
  {
    query: {
      page,
      limit,
      search,
    },
    watch: [page, limit, search],
  },
);

const period = computed(() => ({
  title: data.value?.period?.title ?? "",
  status: data.value?.period?.status ?? "",
  totalRecipients: data.value?.period?.totalRecipients ?? 0,
  totalAmount: data.value?.period?.totalAmount ?? 0,
}));

const detailTunjanganTransport = computed(() => data.value?.data ?? []);

const pagination = computed(() => data.value?.pagination ?? {});
</script>
