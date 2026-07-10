<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex gap-2 ms-auto">
        <!-- Filter Role -->
        <select v-model="filter" class="form-select" style="width: 180px">
          <option value="">Semua Role</option>
          <option v-for="role in roles" :key="role.id" :value="role.code">
            {{ role.name }}
          </option>
        </select>

        <!-- Search -->
        <div class="input-group">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Cari Data ..."
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
            <th>Role</th>
            <th>Deskripsi</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredRoles" :key="item.id">
            <td class="text-center">
              {{ index + 1 }}
            </td>

            <td>
              {{ item.name }}
            </td>

            <td>
              {{ item.description ?? "-" }}
            </td>

            <td class="text-center">
              <NuxtLink
                :to="`/user/role/hak-akses/${item.id}`"
                class="btn btn-sm btn-primary"
              >
                Hak Akses
              </NuxtLink>
            </td>
          </tr>

          <tr v-if="filteredRoles.length === 0">
            <td colspan="4" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-footer d-flex align-items-center">
      <ul class="pagination ms-auto m-0">
        <li class="page-item">
          <a class="page-link" href="#">1</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { IconSearch } from "@tabler/icons-vue";

definePageMeta({
  title: "Manajemen Role",
});

useSeoMeta({
  title: "Manajemen Role",
});

const roles = ref([]);
const search = ref("");
const filter = ref("");

const getRoles = async () => {
  try {
    const response = await $fetch("/api/user/role");

    roles.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

await getRoles();

const filteredRoles = computed(() => {
  return roles.value.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.code.toLowerCase().includes(search.value.toLowerCase());

    const matchFilter = !filter.value || item.code === filter.value;

    return matchSearch && matchFilter;
  });
});
</script>
