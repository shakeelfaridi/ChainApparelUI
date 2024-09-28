import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

// @mui
import { Checkbox, TableRow, TableCell, MenuItem, Link, TextField } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// Label
import Label from '../../../../components/Label';

// ----------------------------------------------------------------------

BannersTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func, 
  onSelectRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onTakeOfflineRow: PropTypes.func,
  onRemoveRow: PropTypes.func,
  onChangeWeight: PropTypes.func,
};

export default function BannersTableRow({ row, 
  selected, 
  onEditRow, 
  onSelectRow, 
  onTakeOfflineRow, 
  onRemoveRow, 
  onEnableRow,
  onChangeWeight }) {

  const theme = useTheme();

  const { id, bannersTitle, targetAudience, products, published, expiring, lastModified, manager, status, weight } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const [weightBanner, setWeightBanner] = useState((weight ? weight : 1));

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleWeightBanner = (event) => {
    setWeightBanner(event.target.value);
    onChangeWeight();
  }

  return (
    <TableRow hover selected={selected}>

      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      
      <TableCell align="left">
        <Link href={(PATH_DASHBOARD.marketing.banners + '/' + id + '/edit')} underline="always">
          {bannersTitle !== '' ? bannersTitle : '-'}
        </Link>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'scheduled' && 'warning') || ((status === 'expired' || status === '') && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status !== '' ? status : 'Disabled'}
        </Label>
      </TableCell>

      <TableCell align="left">
        {products.length > 0 ? (
          <>
            {products.map((product, index) =>
              <Link href={(PATH_DASHBOARD.management.products) + '/' + product.id} underline="always">
                {product.title}{index !== 1 && (index+1) !== products.length ? ', ' : ''}
              </Link>
            )}
          </>
        ): '-'}
      </TableCell>

      <TableCell align="left">{targetAudience !== '' ? targetAudience : '-'}</TableCell>

      <TableCell align="center">{published !== '' ? published : '-'}</TableCell>

      <TableCell align="center">{expiring !== '' ? expiring : '-'}</TableCell>

      <TableCell align="center">{lastModified !== '' ? lastModified : '-'}</TableCell>

      <TableCell align="center">{manager !== '' ? manager : '-'}</TableCell>

      <TableCell align="center">
        <TextField 
          name="weight" 
          type="number"
          inputProps={{min: 1, style: { textAlign: 'center' }}}
          value={weightBanner} 
          onChange={handleWeightBanner}/>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onTakeOfflineRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'carbon:cloud-offline'} />
                Take offline?
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onRemoveRow();
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
