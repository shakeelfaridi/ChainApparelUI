import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, TableRow, TableCell, Link } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

QualityTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func, 
  onSelectRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onDisableRow: PropTypes.func,
};

export default function QualityTableRow({ row, selected, onEditRow, onSelectRow, onDisableRow, onEnableRow }) {

  const { id, course, branch, targetAudience, startDate, endDate, completed, completedpm, quality  } = row;

  const green = {
    backgroundColor: 'green',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  };

  const orange = {
    backgroundColor: 'darkorange',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  };

  const red = {
    backgroundColor: 'red',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  };

  return (
    <TableRow hover selected={selected}>

      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{course !== '' ? <Link href={(PATH_DASHBOARD.stats.quality + '/' + id + '/view')}>{course}</Link> : '-'}</TableCell>
      
      <TableCell align="left">{targetAudience !== '' ? targetAudience : '-'}</TableCell>

      <TableCell align="center">{startDate !== '' ? startDate : '-'}</TableCell>

      <TableCell align="center">{endDate !== '' ? endDate : '-'}</TableCell>

      <TableCell align="center">{completed !== '' ? completed : '-'}</TableCell>

      <TableCell align="center">{completedpm !== '' ? completedpm : '-'}</TableCell>

      <TableCell align="center">
        {quality === 'green' && (
          <div class="traffic-green" style={green}>77.4%<br/>K:78.1%, A:76.7%</div>
        )}
        {quality === 'orange' && (
          <div class="traffic-orange" style={orange}>59.6%<br/>K:61.3%, A:57.9%</div>
        )}
        {quality === 'red' && (
          <div class="traffic-red" style={red}>60.7%<br/>K:71.4%, A:50.0%</div>
        )}
      </TableCell>
      
    </TableRow>
  );
}
