<template>
  <NuxtLayout name="default">
    <template #actions>
      <NuxtLink to="/pegawai/form" class="btn btn-primary">
        <IconPlus stroke="{3}" size="20" />

        Tambah
      </NuxtLink>
    </template>

    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto">
          <!-- Masa Kerja -->

          <div class="d-flex align-items-center gap-1">
            <span class="text-nowrap"> Masa Kerja </span>

            <input type="number" class="form-control" style="width: 60px" />

            -

            <input type="number" class="form-control" style="width: 60px" />
          </div>

          <!-- Jabatan -->

          <select class="form-select" style="width: 180px">
            <option value="">Semua Jabatan</option>

            <option
              v-for="position in [
                ...new Set(employees.map((e) => e.position?.name)),
              ]"
              :key="position"
            >
              {{ position }}
            </option>
          </select>

          <!-- Status -->

          <select class="form-select" style="width: 180px">
            <option value="">Status Kontrak</option>

            <option value="pkwtt">PKWTT</option>

            <option value="pkwt">PKWT</option>
          </select>

          <!-- Search -->

          <div class="input-group" style="width: 200px">
            <input
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

              <th width="15" class="text-center">Aksi</th>

              <th>NIP</th>

              <th>Nama</th>

              <th>Jabatan</th>

              <th>Tanggal Masuk</th>

              <th>Masa Kerja</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in employees" :key="item.id">
              <td class="text-center">
                {{ index + 1 }}
              </td>

              <td class="text-nowrap">
                <div class="d-flex">
                  <!-- Edit -->

                  <NuxtLink :to="`/pegawai/form/${item.id}`" class="text-dark">
                    <span data-bs-toggle="tooltip" title="Edit">
                      <IconPencil stroke="{1}" size="20" />
                    </span>
                  </NuxtLink>

                  <!-- Detail -->

                  <NuxtLink :to="`/pegawai/${item.nip}`" class="text-dark">
                    <span data-bs-toggle="tooltip" title="Detail">
                      <IconFileDescription stroke="{1}" size="20" />
                    </span>
                  </NuxtLink>

                  <!-- Download -->

                  <a
                    href="#"
                    class="text-dark"
                    @click.prevent="downloadPdf(item.id)"
                  >
                    <span data-bs-toggle="tooltip" title="Download PDF">
                      <IconCloudDownload stroke="{1}" size="20" />
                    </span>
                  </a>

                  <!-- Hapus -->

                  <a
                    href="#"
                    class="text-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-hapus"
                    @click="selectedEmployee = item"
                  >
                    <span data-bs-toggle="tooltip" title="Hapus">
                      <IconTrash stroke="{1}" size="20" />
                    </span>
                  </a>
                </div>
              </td>

              <td>
                {{ item.nip }}
              </td>

              <td>
                {{ item.name }}
              </td>

              <td>
                {{ item.position?.name }}
              </td>

              <td>
                {{ formatDateID(item.joined_at) }}
              </td>

              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer d-flex align-items-center">
        <ul class="pagination ms-auto m-0">
          <li class="page-item active">
            <a class="page-link" href="#"> 1 </a>
          </li>
        </ul>
      </div>

      <!-- Modal Hapus -->

      <div class="modal modal-blur fade" id="modal-hapus">
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>

            <div class="modal-status bg-danger"></div>

            <div class="modal-body text-center py-4">
              <h3 class="mb-1">Hapus Data</h3>

              <div class="text-secondary">
                Apakah kamu ingin menghapus data ini ?
              </div>
            </div>

            <div class="modal-footer">
              <div class="w-100">
                <div class="row">
                  <div class="col">
                    <button class="btn btn-3 w-100" data-bs-dismiss="modal">
                      Batal
                    </button>
                  </div>

                  <div class="col">
                    <button
                      class="btn btn-danger btn-4 w-100"
                      data-bs-dismiss="modal"
                      @click="deleteEmployee"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  title: "Data Pegawai",
  middleware: "auth",
  layout: false,
});

useSeoMeta({
  title: "Data Pegawai",
});

import {
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconFileDescription,
  IconCloudDownload,
} from "@tabler/icons-vue";

import { formatDateID } from "~/utils/formatDate.js";

const employees = ref([]);
const loading = ref(false);
const selectedEmployee = ref(null);

const getEmployees = async () => {
  try {
    loading.value = true;

    const response = await $fetch("/api/employees");

    employees.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const downloadPdf = (id) => {
  window.open(`/api/employees/doc/pdf/${id}`, "_blank");
};

const deleteEmployee = async () => {
  if (!selectedEmployee.value) {
    return;
  }

  try {
    await $fetch(`/api/employees/${selectedEmployee.value.id}`, {
      method: "DELETE",
    });

    await getEmployees();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getEmployees();
});
</script>
