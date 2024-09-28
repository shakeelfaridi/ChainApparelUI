import PropTypes from 'prop-types';

// @mui
import { TableRow, TableCell, Link } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

QualityViewTableRow3.propTypes = {
  row: PropTypes.object,
};

export default function QualityViewTableRow3({ row }) {

  const { id, notes, grade, user, date } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        {notes}
      </TableCell>
      <TableCell align="left">
        {grade}
      </TableCell>
      <TableCell align="left">
        {user.length > 0 ? (
            <>
              {user.map((student) => student.id !== '' ? 
                (<Link href={(PATH_DASHBOARD.user.root) + '/' + student.id + '/edit'} underline="always">
                  {student.email} [{student.firstname + ' ' + student.lastname}]
                </Link>)
                : (<>{student.email} [{student.firstname + ' ' + student.lastname}]</>)
              )}
            </>
          ): '-'}
      </TableCell>
      <TableCell align="left">
        {date}
      </TableCell>
    </TableRow>
  );
}
