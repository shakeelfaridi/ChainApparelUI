import PropTypes from "prop-types";
import { Card, CardHeader } from "@mui/material";

// ----------------------------------------------------------------------

// AppBranchFilter.propTypes = {
//   title: PropTypes.string,
//   subheader: PropTypes.string,
//   tableData: PropTypes.array.isRequired,
//   tableLabels: PropTypes.array.isRequired,
// };

export default function AppBranchFilter({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
    </Card>
  );
}
