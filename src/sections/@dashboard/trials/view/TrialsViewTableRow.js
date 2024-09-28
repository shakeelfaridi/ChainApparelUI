import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

// @mui
import { Checkbox, TableRow, TableCell, Grid, Link } from '@mui/material';

// Label
import Label from '../../../../components/Label';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

TrialsViewTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func, 
  onSelectRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onDisableRow: PropTypes.func,
};

export default function TrialsViewTableRow({ row, selected, onEditRow, onSelectRow, onDisableRow, onEnableRow }) {

  const theme = useTheme();

  const { id, code, activated, emailVerified, students, company, courses } = row;

  return (
    <TableRow hover selected={selected} id={id}>

      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      
      <TableCell align="left">
        {code}
      </TableCell>

      <TableCell align="center">{activated !== '' ? activated : '-'}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={((emailVerified === '' || emailVerified === 0) && 'warning') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {emailVerified === 1 ? 'Verified' : 'Pending'}
        </Label>
      </TableCell>

      <TableCell align="left">
      {students.length > 0 ? (
          <>
            {students.map((student) => student.id !== '' ? 
              (<Link href={(PATH_DASHBOARD.user.root) + '/' + student.id + '/edit'} underline="always">
                {student.email} [{student.firstname + ' ' + student.lastname}]
              </Link>)
              : (<>{student.email} [{student.firstname + ' ' + student.lastname}]</>)
            )}
          </>
        ): '-'}
      </TableCell>

      <TableCell align="left">{company !== '' ? company : '-'}</TableCell>

      <TableCell align="left">
        {courses.length > 0 ? (
          <>
            {courses.map((course) =>
              <Grid container sx={{
                border: 2,
                padding: 1,
                borderColor: '#f8f8f8'
              }}>
                <Grid item xs={6} md={8}>
                  {course.title}
                </Grid>
                <Grid item xs={6} md={4}
                sx={{
                  textAlign: 'right'
                }}>
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={((course.status === '' || course.status === 'open') && 'warning') || 'success'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {course.status}
                  </Label>
                </Grid>
              </Grid>
            )}
          </>
        ): '-'}

      </TableCell>

    </TableRow>
  );
}
