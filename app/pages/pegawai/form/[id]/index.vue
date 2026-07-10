<template>
  <PegawaiForm />
</template>

<script setup>
definePageMeta({
  title: "Edit Pegawai",
  middleware: "auth"
});

useSeoMeta({
  title: "Edit Pegawai",
});

import PegawaiForm from "~/features/DataPegawai/components/PegawaiForm.vue";
</script>
