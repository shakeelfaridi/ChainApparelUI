// components
// import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

// const getIcon = (home) => <Iconify icon={home} sx={{ width: 1, height: 1 }} />;

const customer = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "Order",
    items: [
      {
        title: "New Order",
        path: "/dashboard/order",
        icon: "ant-design:dashboard-filled",
      },
      {
        title: "Order History",
        path: "/dashboard/orderHistory",
        icon: "ant-design:shopping-cart-outlined",
      },
    ],
  },
  {
    subheader: "Manufacturers",
    items: [
      {
        title: "Manufacturers",
        path: "/dashboard/Manufacturers",
        icon: "mdi:company",
      },
    ],
  },
  {
    subheader: "Supplier",
    items: [
      {
        title: "Supplier",
        path: "/dashboard/Suppliers",
        icon: "mdi:hand-truck",
      },
    ],
  },
  {
    subheader: "Products",
    items: [
      {
        title: "Products",
        path: "/dashboard/Products",
        icon: "dashicons:products",
      },
    ],
  },
];

export default customer;
