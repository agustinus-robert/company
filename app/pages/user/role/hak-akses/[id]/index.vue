<template>
  <div>
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4 col-lg-3">
            <label class="form-label">Nama Role</label>
            <input
              type="text"
              class="form-control"
              :value="role?.name ?? ''"
              readonly
              disabled
            />
          </div>

          <div class="col-md-4 col-lg-3">
            <label class="form-label">Deskripsi</label>
            <input
              type="text"
              class="form-control"
              :value="role?.description ?? ''"
              readonly
              disabled
            />
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">No</th>
              <th>Modul/Fitur</th>
              <th class="text-center">Akses</th>
              <th class="text-center">Create</th>
              <th>Read</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in hakAkses" :key="item.id">
              <td class="text-center">
                {{ index + 1 }}
              </td>

              <td>
                {{ item.name }}
              </td>

              <td class="text-center">
                <IconCircleCheckFilled
                  v-if="item.can_access"
                  class="text-green"
                />

                <IconXboxXFilled v-else class="text-red" />
              </td>

              <td class="text-center">
                <IconCircleCheckFilled
                  v-if="item.can_create"
                  class="text-green"
                />

                <IconXboxXFilled v-else class="text-red" />
              </td>

              <td>
                {{ item.read_scope }}
              </td>

              <td>
                {{ item.update_scope }}
              </td>

              <td>
                {{ item.delete_scope }}
              </td>
            </tr>

            <tr v-if="hakAkses.length === 0">
              <td colspan="7" class="text-center">Data tidak ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconCircleCheckFilled, IconXboxXFilled } from "@tabler/icons-vue";

const route = useRoute();

definePageMeta({
  title: "Hak Akses",
});

useSeoMeta({
  title: "Hak Akses",
});

const { data: roleResponse } = await useFetch(
  `/api/user/role/${route.params.id}`,
);

console.log(roleResponse);

const role = computed(() => {
  return roleResponse.value?.data ?? null;
});

const { data: permissionResponse } = await useFetch(
  `/api/user/role-permission/${route.params.id}`,
);

const hakAkses = computed(() => {
  return permissionResponse.value?.data ?? [];
});
</script>
