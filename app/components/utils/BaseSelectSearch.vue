<template>
  <div class="position-relative">
    <input
      v-model="keyword"
      type="text"
      class="form-control"
      :placeholder="placeholder"
      @input="onSearch"
      @focus="show = true"
      @blur="hideDropdown"
    />

    <div
      v-if="show && items.length"
      class="dropdown-menu d-block w-100 shadow"
      style="max-height: 250px; overflow: auto"
    >
      <button
        v-for="item in items"
        :key="item[valueKey]"
        type="button"
        class="dropdown-item"
        @mousedown.prevent="select(item)"
      >
        {{ item[labelKey] }}
      </button>
    </div>

    <div
      v-if="show && keyword.length >= minLength && !loading && !items.length"
      class="dropdown-menu d-block w-100"
    >
      <span class="dropdown-item text-muted"> Data tidak ditemukan </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [Number, String],
  url: {
    type: String,
    required: true,
  },
  param: {
    type: String,
    default: "search",
  },
  labelKey: {
    type: String,
    default: "name",
  },
  valueKey: {
    type: String,
    default: "id",
  },
  placeholder: {
    type: String,
    default: "Cari...",
  },
  minLength: {
    type: Number,
    default: 3,
  },
});

const emit = defineEmits(["update:modelValue", "selected"]);

const keyword = ref("");
const items = ref([]);
const loading = ref(false);
const show = ref(false);

let timer = null;

const onSearch = () => {
  clearTimeout(timer);

  if (!keyword.value || keyword.value.length < props.minLength) {
    items.value = [];
    return;
  }

  timer = setTimeout(fetchData, 300);
};

const fetchData = async () => {
  loading.value = true;

  try {
    const result = await $fetch(props.url, {
      query: {
        [props.param]: keyword.value,
      },
    });

    items.value = result.data ?? result;
  } catch (e) {
    console.error(e);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

const select = (item) => {
  keyword.value = item[props.labelKey];

  emit("update:modelValue", item[props.valueKey]);
  emit("selected", item);

  show.value = false;
};

const hideDropdown = () => {
  setTimeout(() => {
    show.value = false;
  }, 150);
};

watch(
  () => props.modelValue,
  async (value) => {
    if (!value) {
      keyword.value = "";
      return;
    }

    if (keyword.value.length > 0) return;

    try {
      const result = await $fetch(props.url, {
        query: {
          id: value,
        },
      });

      const data = result.data ?? result;

      const item = Array.isArray(data) ? data[0] : data;

      if (item) {
        keyword.value = item[props.labelKey];
      }
    } catch (e) {
      console.error(e);
    }
  },
  {
    immediate: true,
  },
);
</script>
