import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onDisableRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDisableRow, onEnableRow }) {
  const theme = useTheme();

  const { name, avatarUrl, company, email, lastLogin, branch, targetAudience, status, zohoID } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const zohoLink = "https://crm.zoho.eu/crm/org20066982846/tab/CustomModule4/";

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="center">
        {zohoID !== '' ? (
            <a href={zohoLink+zohoID} target="_blank" rel="noreferrer" title="Open ZOHO Subscription">
                <Iconify icon={'bx:link-external'} />
            </a>
        ): '-'}
      </TableCell>
      
      <TableCell align="left">{company !== '' ? company : '-'}</TableCell>

      <TableCell align="left">{email !== '' ? email : '-'}</TableCell>

      <TableCell align="left">{branch !== '' ? branch : '-'}</TableCell>

      <TableCell align="left">{targetAudience !== '' ? targetAudience : '-'}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {lastLogin}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'disabled' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {status === 'active' ?
                (<MenuItem
                  onClick={() => {
                    onDisableRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Disable
                </MenuItem>)
                :
                <MenuItem
                  onClick={() => {
                    onEnableRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'success.main' }}
                >
                  <Iconify icon={'mdi:account-reactivate-outline'} />
                  Activate
                </MenuItem>
              }
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
