// components
//import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from "../../../components/Iconify";
// ----------------------------------------------------------------------
//const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
//const getIcon = (name) => <Iconify icon={name} sx={{ width: 1, height: 1 }} />;
const workerNav = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "Task",
    items: [
      {
        title: "Task",
        path: "/dashboard/task",
        icon: "ant-design:dashboard-filled",
      },
    ],
  },
];
export default workerNav;
