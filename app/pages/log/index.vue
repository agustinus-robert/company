<template>
  <div class="card">
    <div class="card-header">
      <div class="ms-auto">
        <div class="input-group">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Cari Data ..."
          />

          <button class="btn" type="button">
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
            <th>Nama User</th>
            <th>Modul</th>
            <th>Aksi</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredLog" :key="item.id">
            <td class="text-center">
              {{ index + 1 }}
            </td>

            <td>
              {{ item.user }}
            </td>

            <td>
              {{ item.modul }}
            </td>

            <td>
              <span class="badge" :class="actionClass(item.aksi)">
                {{ item.aksi }}
              </span>
            </td>

            <td>
              {{ formatDateTimeID(item.timestamp) }}
            </td>
          </tr>

          <tr v-if="filteredLog.length === 0">
            <td colspan="5" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-footer d-flex align-items-center">
      <ul class="pagination ms-auto m-0">
        <li class="page-item">
          <a class="page-link" href="#"> 1 </a>
        </li>

        <li class="page-item active">
          <a class="page-link" href="#"> 2 </a>
        </li>

        <li class="page-item">
          <a class="page-link" href="#"> 3 </a>
        </li>

        <li class="page-item">
          <a class="page-link" href="#"> 4 </a>
        </li>

        <li class="page-item">
          <a class="page-link" href="#"> 5 </a>
        </li>

        <li class="page-item">
          <a class="page-link" href="#"> next </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";
import { formatDateTimeID } from "~/utils/formatDate.js";

definePageMeta({
  title: "Log Aktifitas",
});

useSeoMeta({
  title: "Log Aktifitas",
});

const logAktivitas = ref([]);

const search = ref("");

const getLogAktivitas = async () => {
  try {
    const response = await $fetch("/api/activity-log");

    logAktivitas.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

await getLogAktivitas();

const filteredLog = computed(() => {
  const keyword = search.value.toLowerCase();

  if (!keyword) {
    return logAktivitas.value;
  }

  return logAktivitas.value.filter((item) => {
    return (
      item.user?.toLowerCase().includes(keyword) ||
      item.modul?.toLowerCase().includes(keyword) ||
      item.aksi?.toLowerCase().includes(keyword)
    );
  });
});

const actionClass = (action) => {
  switch (action) {
    case "create":
      return "bg-green";

    case "update":
      return "bg-yellow";

    case "delete":
      return "bg-red";

    case "login":
      return "bg-blue";

    case "logout":
      return "bg-secondary";

    default:
      return "bg-secondary";
  }
};
</script>
