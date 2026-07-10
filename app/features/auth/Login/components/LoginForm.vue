<template>
  <form @submit.prevent="login">
    <!-- Username -->
    <div class="mb-2">
      <input
        v-model="form.username"
        type="text"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Username"
        name="username"
        required
      />
    </div>

    <!-- Password -->
    <div class="mb-2">
      <input
        v-model="form.password"
        type="password"
        class="form-control py-3 border-0 bg-light text-dark"
        name="password"
        placeholder="Password"
        required
      />
    </div>

    <div class="mb-2">
      <label class="form-check">
        <input type="checkbox" v-model="form.remember" class="form-check-input" />
        <span class="form-check-label">Remember Me</span>
      </label>
    </div>

    <div class="mb-2">
      <div
        class="g-recaptcha"
        data-sitekey="6LeNRUwtAAAAAJ-_IichrjKO9h3GN0kUd1gjCQ2z"
      ></div>
    </div>

    <!-- Submit -->
    <div class="d-grid mt-4">
      <button class="btn btn-primary text-uppercase shadow py-3" 
      :disabled="loading"
      type="submit">
        {{ loading ? 'Loading...' : 'Log In' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { toast } from "vue-sonner";

const config = useRuntimeConfig();
const siteKey = config.public.recaptchaSiteKey;
const router = useRouter();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
  remember: false,
});

const login = async () => {
  try {
    loading.value = true;

    const loginResponse = await $fetch("/api/auth/login", {
      method: "POST",
      body: form,
    });

    if(loginResponse.success == true){
      const token = useCookie("token", {
        maxAge: form.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
        httpOnly: false,
      });

      token.value = loginResponse.token;
      toast.success("Login berhasil, anda akan dialihkan");
      await router.push("/");
    }
  } catch (error) {
    toast.error(
      error?.data?.message || "Username atau password salah"
    );
  } finally {
    loading.value = false;
  }
};
</script>