import PropTypes from 'prop-types';

// @mui
import { TableRow, TableCell } from '@mui/material';

// ----------------------------------------------------------------------

QualityViewTableRow1.propTypes = {
  row: PropTypes.object,
};

export default function QualityViewTableRow1({ row }) {

  const { id, label, value } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        {label}  
      </TableCell>
      <TableCell align="left">
        {value}
      </TableCell>
    </TableRow>
  );
}
