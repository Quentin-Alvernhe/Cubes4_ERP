export default defineNuxtRouteMiddleware((to) => {
  const openPaths = ["/"];
  const { isAuthenticated } = storeToRefs(useAuthStore());

  if (!openPaths.includes(to.path) && !isAuthenticated.value) {
    return navigateTo("/");
  }
});
