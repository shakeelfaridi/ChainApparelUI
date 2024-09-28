import { lazy, Suspense } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
// components
import SignUp from "src/pages/login/SignUp/SignUp";
import LoadingScreen from "../components/LoadingScreen";
import SignIn from "../pages/login/SignIn";
//        - - - - - - - - -           Guard
import SubmitOrder from "src/pages/dashboard/SubmitOrder";
import { getHomeRouteForLoggedInUser } from "src/utils/routingUtils";
// ---------------------------Redux
import { useSelector } from "react-redux";
// ---------------------------Redux
import UserOrderHistory from "src/components/orderList/UserOrderHistory";
import WorkerSignin from "src/pages/login/WorkerSignin";
//guards
import AuthGuard from "src/guards/AuthGuards";
import GuestGuard from "src/guards/GuestGuard";
import RoleBasedGuard from "src/guards/RoleBaseGuard";
import Manufacturer from "src/pages/manufacturer/Manufacturer";
import ProductInformation from "src/pages/productInfo/ProductInformation";
import OrderDetail from "src/pages/orderDetail/OrderDetail";
import Profile from "src/pages/profile/Profile";
import NewProduct from "src/pages/newProduct/NewProduct";
import Vendor from "src/pages/vendorPage/Vendor";
import TrackOnlyOrderProcess from "src/pages/trackOnlyProductProcess/TrackOnlyOrderProcess";
import Vendors from "src/pages/vendors/Vendors";
import UserTable from "src/pages/all-users";

// ----------------------------------------------------------------------
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  return (
    <Suspense
      fallback={<LoadingScreen isDashboard={pathname.includes("/dashboard")} />}
    >
      <Component {...props} />
    </Suspense>
  );
};
export default function Router() {
  const userRole = useSelector((state) => state?.AuthUser?.userRole);

  const getHomeRoute = () => {
    if (userRole) {
      return getHomeRouteForLoggedInUser(userRole.role);
    } else {
      return "auth/login";
    }
  };
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "worker",
          element: (
            <GuestGuard>
              <WorkerSignin />
            </GuestGuard>
          ),
        },
        {
          path: "login",
          element: (
            <GuestGuard>
              <SignIn />
            </GuestGuard>
          ),
        },
        {
          path: "signup",
          element: (
            <GuestGuard>
              <SignUp />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <Navigate to={getHomeRoute()} replace />,
    },

    {
      path: "dashboard",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: "New-Orders",
          element: (
            <RoleBasedGuard accessibleRoles={["manufacturer"]}>
              <Dashboard />
            </RoleBasedGuard>
          ),
        },
        {
          path: "add-user",
          element: (
            <RoleBasedGuard accessibleRoles={["manufacturer"]}>
              <CreateWorkers />
            </RoleBasedGuard>
          ),
        },
        {
          path: "create-new-manufacturer",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              <CreateWorkers />
            </RoleBasedGuard>
          ),
        },
        {
          path: "create-new-vendor",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              <CreateWorkers />
            </RoleBasedGuard>
          ),
        },
        {
          path: ":edit/:company",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              <CreateWorkers />
            </RoleBasedGuard>
          ),
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "order",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              <SubmitOrder />
            </RoleBasedGuard>
          ),
        },
        {
          path: "orderHistory",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              {" "}
              <UserOrderHistory />
            </RoleBasedGuard>
          ),
        },
        {
          path: "order-detail/:id",
          element: <OrderDetail />,
        },
        {
          path: "Processing",
          element: (
            <RoleBasedGuard accessibleRoles={["manufacturer"]}>
              {" "}
              <PoProcesses />
            </RoleBasedGuard>
          ),
        },
        {
          path: "in-progress",
          element: (
            <RoleBasedGuard accessibleRoles={["manufacturer"]}>
              <InProgress />
            </RoleBasedGuard>
          ),
        },
        {
          path: "Vendor-Orders",
          element: (
            <RoleBasedGuard accessibleRoles={["manufacturer"]}>
              <OrderToVendor />
            </RoleBasedGuard>
          ),
        },
        {
          path: "task",
          element: (
            <RoleBasedGuard accessibleRoles={["worker"]}>
              <Worker />
            </RoleBasedGuard>
          ),
        },
        {
          path: "vendor",
          element: <Vendor />,
        },
        // customer side vendor page - customer create new vendor
        {
          path: "Vendors",
          element: <Vendors />,
        },
        {
          path: "tracking",
          element: (
            <RoleBasedGuard accessibleRoles={["manufacturer"]}>
              <Tracking />
            </RoleBasedGuard>
          ),
        },
        {
          path: "track-order-processes",
          element: <TrackOnlyOrderProcess />,
        },
        {
          path: "tracking/:orderId",
          element: (
            <RoleBasedGuard accessibleRoles={["manufacturer"]}>
              <Tracking />
            </RoleBasedGuard>
          ),
        },
        {
          path: "Manufacturers",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              <Manufacturer />
            </RoleBasedGuard>
          ),
        },
        {
          path: "Products",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              <ProductInformation />
            </RoleBasedGuard>
          ),
        },
        {
          path: "add-new-products",
          element: (
            <RoleBasedGuard accessibleRoles={["customer"]}>
              <NewProduct />
            </RoleBasedGuard>
          ),
        },
        {
          path: "all-user-data",
          element: (
            <RoleBasedGuard accessibleRoles={["super-admin"]}>
              <UserTable />
            </RoleBasedGuard>
          ),
        },
        // { path: "Add-New-Material", element: <AddMaterials /> },
      ],
    },
    // {
    //   path: "*",
    //   element: <LogoOnlyLayout />,
    //   children: [
    //     { path: "404", element: <NotFound /> },
    //     { path: "*", element: <Navigate to="/404" replace /> },
    //   ],
    // },
    // { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
// Dashboard
const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const Worker = Loadable(lazy(() => import("src/pages/workers/Worker")));
const Tracking = Loadable(lazy(() => import("src/pages/tracking/Tracking")));
const CreateWorkers = Loadable(
  lazy(() => import("src/pages/createWorkers/CreateWorkers"))
);
const PoProcesses = Loadable(
  lazy(() => import("src/pages/PoProcess/PoProcesses"))
);
const InProgress = Loadable(
  lazy(() => import("src/pages/InProgressOrders/InProgressOrders"))
);
const OrderToVendor = Loadable(
  lazy(() => import("src/pages/vendorsOrder/OrderToVendor"))
);

//---------------------------------------------------------------------------
const NotFound = Loadable(lazy(() => import("../pages/Page404")));
