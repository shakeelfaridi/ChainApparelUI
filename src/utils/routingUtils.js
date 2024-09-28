export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "manufacturer") return "dashboard/New-Orders";
  if (userRole === "customer") return "dashboard/orderHistory";
  if (userRole === "worker") return "dashboard/task";
  if (userRole === "vendor") return "dashboard/vendor";
  if (userRole === "super-admin") return "dashboard/all-user-data";
  return "auth/login";
};
