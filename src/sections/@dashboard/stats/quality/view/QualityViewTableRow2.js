import PropTypes from 'prop-types';

// @mui
import { TableRow, TableCell } from '@mui/material';

// ----------------------------------------------------------------------

QualityViewTableRow2.propTypes = {
  row: PropTypes.object,
};

export default function QualityViewTableRow2({ row }) {

  const { id, percentage, question, widget } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        {percentage} % 
      </TableCell>
      <TableCell align="left">
        {question}
      </TableCell>
      <TableCell align="left">
        {widget}
      </TableCell>
    </TableRow>
  );
}
