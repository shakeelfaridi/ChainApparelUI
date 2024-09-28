import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, TableRow, TableCell, MenuItem, Link } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

LinkCheckerTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func, 
  onSelectRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onDisableRow: PropTypes.func,
};

export default function LinkCheckerTableRow({ row, selected, onEditRow, onSelectRow, onDisableRow, onEnableRow }) {

  const { id, targetAudience, code, error, url, lesson, lessonId, lastCheck } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };


  return (
    <TableRow hover selected={selected}>

      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      
      <TableCell align="left">{targetAudience !== '' ? targetAudience : '-'}</TableCell>

      <TableCell align="left">{code !== '' ? code : '-'}</TableCell>

      <TableCell align="left">{error !== '' ? error : '-'}</TableCell>

      <TableCell align="left">
        {url !== '' ? <Link href={url} target="_blank">{url}</Link>  : '-'}
      </TableCell>

      <TableCell align="left">{lesson !== '' ? lesson : '-'}</TableCell>

      <TableCell align="left">{lastCheck !== '' ? lastCheck : '-'}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDisableRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'octicon:diff-ignored-16'} />
                Ignore
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
