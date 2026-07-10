<template>
  <NuxtLayout name="default">
    <template #actions>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modal-add"
      >
        <IconPlus stroke="{3}" size="20" />Tambah
      </button>
    </template>
    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto">
          <!-- Filter Role -->
          <select name="" id="" class="form-select">
            <template v-for="(item, index) in roleOptions" :key="index">
              <option :value="item.value">{{ item.label }}</option>
            </template>
          </select>

          <!-- Search -->
          <div class="input-group">
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
              <th width="15">Action</th>
              <th>Nama Pengguna</th>
              <th>Username</th>
              <th>Jabatan</th>
              <th>Departemen</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredUsers">
              <td class="text-center">
                {{ index + 1 }}
              </td>

              <td class="text-nowrap">
                <div class="d-flex">
                  <!-- Edit -->
                  <a
                    href="#"
                    class="text-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-add"
                    @click="editUser(item)"
                  >
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Edit"
                    >
                      <IconPencil stroke="1" size="20" />
                    </span>
                  </a>

                  <!-- Hapus -->
                  <a
                    href="#"
                    class="text-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-hapus"
                    @click="prepareDelete(item)"
                  >
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Hapus"
                    >
                      <IconTrash stroke="1" size="20" />
                    </span>
                  </a>
                </div>
              </td>

              <td>
                {{ item.name }}
              </td>

              <td>
                {{ item.username }}
              </td>

              <td>
                {{ item.employee?.position?.name ?? "-" }}
              </td>

              <td>
                {{ item.employee?.department?.name ?? "-" }}
              </td>

              <td>
                {{ item.role?.name ?? "-" }}
              </td>

              <td>
                <span
                  class="badge"
                  :class="item.status === 'active' ? 'bg-green' : 'bg-red'"
                >
                  {{ item.status === "active" ? "Aktif" : "Tidak Aktif" }}
                </span>
              </td>
            </tr>

            <tr v-if="users.length === 0">
              <td colspan="8" class="text-center">Data tidak ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex align-items-center">
        <ul class="pagination ms-auto m-0">
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item active">
            <a class="page-link" href="#">2</a>
          </li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">4</a></li>
          <li class="page-item"><a class="page-link" href="#">5</a></li>
          <li class="page-item">
            <a class="page-link" href="#">
              next
              <!-- Download SVG icon from http://tabler-icons.io/i/chevron-right -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div class="modal modal-blur fade" id="modal-add">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Form Manajemen User</h5>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label"> Nama Lengkap </label>

                <input v-model="form.name" type="text" class="form-control" />
              </div>

              <div class="mb-3">
                <label class="form-label"> Username </label>

                <input
                  v-model="form.username"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="mb-3">
                <label class="form-label"> Email </label>

                <input v-model="form.email" type="email" class="form-control" />
              </div>

              <div class="mb-3">
                <label class="form-label"> Nomor HP </label>

                <input
                  v-model="form.cellphone"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="mb-3">
                <label class="form-label"> Role </label>

                <select v-model="form.role_id" class="form-select">
                  <option value="" disabled>Pilih Role</option>

                  <option
                    v-for="item in roleOptions.slice(1)"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label"> Password </label>

                <input
                  v-model="form.password"
                  type="password"
                  class="form-control mb-1"
                />

                <button
                  type="button"
                  class="btn btn-primary"
                  @click="generatePassword"
                >
                  Generate Password
                </button>
              </div>

              <div>
                <label class="form-label"> Status </label>

                <label class="form-check">
                  <input
                    v-model="form.status"
                    class="form-check-input"
                    type="checkbox"
                    true-value="active"
                    false-value="inactive"
                  />

                  <span class="form-check-label"> Aktif </span>
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <div class="d-flex gap-2 ms-auto">
                <button type="button" class="btn" data-bs-dismiss="modal">
                  Kembali
                </button>

                <button type="button" class="btn btn-primary" @click="saveUser">
                  <i class="ti ti-check me-1"></i>
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Hapus -->
      <div class="modal modal-blur fade" id="modal-hapus">
        <div
          class="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div class="modal-status bg-danger"></div>
            <div class="modal-body text-center py-4">
              <!-- Download SVG icon from http://tabler.io/icons/icon/alert-triangle -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon mb-2 text-danger icon-lg"
              >
                <path d="M12 9v4"></path>
                <path
                  d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"
                ></path>
                <path d="M12 16h.01"></path>
              </svg>
              <h3 class="mb-1">Hapus Data</h3>
              <div class="text-secondary">
                Apakah kamu ingin menghapus data ini ?
              </div>
            </div>
            <div class="modal-footer">
              <div class="w-100">
                <div class="row">
                  <div class="col">
                    <a href="#" class="btn btn-3 w-100" data-bs-dismiss="modal">
                      Batal
                    </a>
                  </div>
                  <div class="col">
                    <a
                      href="#"
                      class="btn btn-danger btn-4 w-100"
                      data-bs-dismiss="modal"
                      @click="deleteUser"
                    >
                      Hapus
                    </a>
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
import { IconPencil, IconPlus, IconSearch, IconTrash } from "@tabler/icons-vue";
import { toast } from "vue-sonner";

definePageMeta({
  title: "Manajemen User",
  layout: false,
});

useSeoMeta({
  title: "Manajemen User",
});

const users = ref([]);

const roleOptions = ref([
  {
    label: "Semua Role",
    value: "",
  },
]);

const selectedRole = ref("");

const search = ref("");

const selectedUser = ref(null);

const getUsers = async () => {
  try {
    const response = await $fetch("/api/user/manage");

    users.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const getRoles = async () => {
  try {
    const response = await $fetch("/api/user/role");

    roleOptions.value.push(
      ...response.data.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    );
  } catch (error) {
    console.error(error);
  }
};

await Promise.all([getUsers(), getRoles()]);

const filteredUsers = computed(() => {
  return users.value.filter((item) => {
    const keyword = search.value.toLowerCase();

    const matchSearch =
      item.name?.toLowerCase().includes(keyword) ||
      item.username?.toLowerCase().includes(keyword);

    const matchRole = !selectedRole.value || item.role_id == selectedRole.value;

    return matchSearch && matchRole;
  });
});

const form = reactive({
  id: null,
  name: "",
  username: "",
  email: "",
  cellphone: "",
  role_id: "",
  password: "",
  status: "active",
});

const resetForm = () => {
  form.id = null;
  form.name = "";
  form.username = "";
  form.email = "";
  form.cellphone = "";
  form.role_id = "";
  form.password = "";
  form.status = "active";
};

const editUser = (item) => {
  form.id = item.id;
  form.name = item.name;
  form.username = item.username;
  form.email = item.email ?? "";
  form.cellphone = item.cellphone ?? "";
  form.role_id = item.role_id;
  form.password = "";
  form.status = item.status;
};

const generatePassword = () => {
  form.password = Math.random().toString(36).slice(-10);
};

const saveUser = async () => {
  try {
    const url = form.id ? `/api/user/manage/${form.id}` : "/api/user/manage";

    const method = form.id ? "PUT" : "POST";

    const response = await $fetch(url, {
      method,

      body: {
        name: form.name,

        username: form.username,

        email: form.email || null,

        cellphone: form.cellphone || null,

        role_id: Number(form.role_id),

        password: form.password || null,

        status: form.status,
      },
    });

    if (response.success) {
      await getUsers();

      toast.success(
        form.id ? "User berhasil diperbarui" : "User berhasil ditambahkan",
      );

      resetForm();
    } else {
      toast.error("Proses gagal");
    }
  } catch (error) {
    toast.error(error?.data?.statusMessage || "Terjadi kesalahan");

    console.error(error);
  }
};

/**
 * SET USER YANG AKAN DIHAPUS
 */
const prepareDelete = (item) => {
  selectedUser.value = item;
};

/**
 * DELETE USER
 */
const deleteUser = async () => {
  if (!selectedUser.value) {
    return;
  }

  try {
    const response = await $fetch(`/api/user/manage/${selectedUser.value.id}`, {
      method: "DELETE",
    });

    if (response.success) {
      await getUsers();

      toast.success("User berhasil dihapus");

      selectedUser.value = null;
    } else {
      toast.error("Gagal menghapus user");
    }
  } catch (error) {
    toast.error(error?.data?.statusMessage || "Terjadi kesalahan");

    console.error(error);
  }
};
</script>
