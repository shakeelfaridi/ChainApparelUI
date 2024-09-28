// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  register: path(ROOTS_AUTH, "/register"),
  loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
  registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
  verify: path(ROOTS_AUTH, "/verify"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  newPassword: path(ROOTS_AUTH, "/new-password"),
};

export const PATH_PAGE = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  faqs: "/faqs",
  page403: "/403",
  page404: "/404",
  page500: "/500",
  components: "/components",
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    order: path(ROOTS_DASHBOARD, "/order"),
    orderhistory: path(ROOTS_DASHBOARD, "/order-history"),
    processing: path(ROOTS_DASHBOARD, "/processing"),
    inProgress: path(ROOTS_DASHBOARD, "/in-progress"),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, "/mail"),
    all: path(ROOTS_DASHBOARD, "/mail/all"),
  },
  permissionDenied: path(ROOTS_DASHBOARD, "/permission-denied"),
  user: {
    root: path(ROOTS_DASHBOARD, "/user"),
    list: path(ROOTS_DASHBOARD, "/user/list"),
    profile: path(ROOTS_DASHBOARD, "/user/profile"),
    account: path(ROOTS_DASHBOARD, "/user/account"),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    new: path(ROOTS_DASHBOARD, "/user/add"),
    //demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  marketing: {
    trials: path(ROOTS_DASHBOARD, "/marketing/trials"),
    trialsNew: path(ROOTS_DASHBOARD, "/marketing/trials/add"),
    trialsView: (id) => path(ROOTS_DASHBOARD, `/marketing/trials/${id}/view`),
    banners: path(ROOTS_DASHBOARD, "/marketing/banners"),
    bannersNew: path(ROOTS_DASHBOARD, "/marketing/banners/add"),
    bannersView: (id) => path(ROOTS_DASHBOARD, `/marketing/banners/${id}/edit`),
  },
  stats: {
    quality: path(ROOTS_DASHBOARD, "/stats/quality"),
    qualityView: (id) => path(ROOTS_DASHBOARD, `/stats/quality/${id}/view`),
    lms: path(ROOTS_DASHBOARD, "/stats/lms"),
    lmsView: (id) => path(ROOTS_DASHBOARD, `/stats/lms/${id}/view`),
    lmsViewLoc: (id, locid) =>
      path(ROOTS_DASHBOARD, `/stats/lms/${id}/${locid}/view`),
    lmsViewLocAud: (id, locid, targetid) =>
      path(ROOTS_DASHBOARD, `/stats/lms/${id}/${locid}/${targetid}/view`),
    lmsViewLocProd: (id, locid, targetid, prodid) =>
      path(
        ROOTS_DASHBOARD,
        `/stats/lms/${id}/${locid}/${targetid}/${prodid}/view`
      ),
  },
  management: {
    products: path(ROOTS_DASHBOARD, "/management/products"),
    linkchecker: path(ROOTS_DASHBOARD, "/management/link-checker"),
    notifications: path(ROOTS_DASHBOARD, "/management/notifications"),
  },
};

export const PATH_DOCS = "https://docs-minimals.vercel.app/introduction";
