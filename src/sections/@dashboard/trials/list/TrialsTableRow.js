import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, TableRow, TableCell, MenuItem, Link } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

TrialsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func, 
  onSelectRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onDisableRow: PropTypes.func,
};

export default function TrialsTableRow({ row, selected, onEditRow, onSelectRow, onDisableRow, onEnableRow }) {

  const { id, name, branch, product, variant, total, used, unused, created, expiration, manager, type } = row;

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
      
      <TableCell align="left">
        <Link href={(PATH_DASHBOARD.marketing.trials + '/' + id + '/view')} underline="always">
          {name !== '' ? name : '-'}
        </Link>
      </TableCell>

      <TableCell align="left">{branch !== '' ? branch : '-'}</TableCell>

      <TableCell align="left">{product !== '' ? product : '-'}</TableCell>

      <TableCell align="left">{variant !== '' ? variant : '-'}</TableCell>

      <TableCell align="center">{total !== '' ? total : '-'}</TableCell>

      <TableCell align="center">{used !== '' ? used : '-'}</TableCell>

      <TableCell align="center">{unused !== '' ? unused : '-'}</TableCell>

      <TableCell align="center">{created !== '' ? created : '-'}</TableCell>

      <TableCell align="center">{expiration !== '' ? expiration : '-'}</TableCell>

      <TableCell align="center">{manager !== '' ? manager : '-'}</TableCell>

      <TableCell align="center">{type !== '' ? type : '-'}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'ant-design:file-excel-outlined'} />
                Export
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDisableRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Remove
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
