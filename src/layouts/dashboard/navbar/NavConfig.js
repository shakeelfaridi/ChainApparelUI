// components
// import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

// const getIcon = (home) => <Iconify icon={home} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      {
        title: "Vendor Orders",
        path: "/dashboard/Vendor-Orders",
        icon: "academicons:open-materials",
      },
      {
        title: "New Orders",
        path: "/dashboard/New-Orders",
        icon: "ant-design:dashboard-filled",
      },
      {
        title: "Processing",
        path: "/dashboard/processing",
        icon: "ant-design:fund-projection-screen-outlined",
      },
      {
        title: "In Progress",
        path: "/dashboard/in-progress",
        icon: "ic:baseline-pending-actions",
      },
      // {
      //   title: "Add New Material Info",
      //   path: "Add-New-Material",
      //   icon: "ant-design:appstore-add-outlined",
      // },
    ],
  },
  {
    subheader: "Management",
    items: [
      {
        title: "Add Worker",
        path: "/dashboard/add-user",
        icon: "mingcute:user-add-fill",
      },
      {
        title: "Tracking",
        path: "/dashboard/tracking",
        icon: "fluent:box-search-24-filled",
      },
    ],
  },
];

export default navConfig;
