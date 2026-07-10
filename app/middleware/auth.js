export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/login") {
    return
  }

  const token = useCookie("token")

  if (!token.value) {
    return navigateTo("/login")
  }
})