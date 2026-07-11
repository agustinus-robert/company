export default defineEventHandler((event) => {
  deleteCookie(event, "token");

  return {
    success: true,
    message: "Logout berhasil",
  };
});
