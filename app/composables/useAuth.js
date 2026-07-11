export const useAuth = () => {
  const user = useState("auth-user", () => null);

  const token = useCookie("token", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });

  const login = async (username, password) => {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username,
        password,
      },
    });

    if (response.success) {
      token.value = response.token;
      user.value = response.data;
    }

    return response;
  };

  const logout = async () => {
    token.value = null;
    user.value = null;

    await navigateTo("/login");
  };

  const fetchUser = async () => {
    console.log("TOKEN:", token.value);

    if (!token.value) {
      user.value = null;
      return;
    }

    try {
      const response = await $fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (response.success) {
        user.value = response.data;
      }
    } catch (error) {
      console.error(error);

      token.value = null;
      user.value = null;
    }
  };

  return {
    user,
    token,
    login,
    logout,
    fetchUser,
  };
};
