<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex gap-2 ms-auto">
        <!-- Filter Tahun -->
        <select v-model="year" class="form-select" style="width: 180px">
          <option value="">Semua Tahun</option>
          <option
            v-for="tahun in [2026, 2025, 2024, 2023]"
            :key="tahun"
            :value="tahun"
          >
            {{ tahun }}
          </option>
        </select>

        <!-- Search -->
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
            <th>Nama Bulan</th>
            <th class="text-center">Total Penerima</th>
            <th class="text-end">Total Tunjangan Transport</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="pending">
            <td colspan="5" class="text-center py-4">Memuat data...</td>
          </tr>

          <tr
            v-else-if="tunjanganTransport.length"
            v-for="(item, index) in tunjanganTransport"
            :key="item.id"
          >
            <td class="text-center">
              {{ (page - 1) * limit + index + 1 }}
            </td>
            <td>{{ item.bulan }}</td>
            <td class="text-center">
              {{ item.totalPenerima }}
            </td>
            <td class="text-end">
              {{ formatRupiah(item.totalTunjangan) }}
            </td>
            <td class="text-center">
              <NuxtLink
                :to="`/tunjangan/transport/detail/${item.id}`"
                class="btn btn-primary btn-sm"
              >
                Detail
              </NuxtLink>
            </td>
          </tr>

          <tr v-else>
            <td colspan="5" class="text-center py-4">Data tidak ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-footer d-flex justify-content-between align-items-center">
      <small> Total {{ pagination.total || 0 }} data </small>

      <ul class="pagination m-0">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="page--" :disabled="page === 1">
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
          :class="{ disabled: page >= (pagination.totalPages || 1) }"
        >
          <button
            class="page-link"
            @click="page++"
            :disabled="page >= (pagination.totalPages || 1)"
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import { formatRupiah } from "~/utils/formatRupiah.js";

definePageMeta({
  title: "Tunjangan Transport",
});

useSeoMeta({
  title: "Tunjangan Transport",
});

const page = ref(1);
const limit = ref(10);
const year = ref("");
const search = ref("");

const { data, pending } = await useFetch(
  "/api/hrms/transport-allowance/period",
  {
    query: {
      page,
      limit,
      year,
      search,
    },
    watch: [page, limit, year, search],
  },
);

const tunjanganTransport = computed(() => data.value?.data ?? []);
const pagination = computed(() => data.value?.pagination ?? {});
</script>
