import PropTypes from 'prop-types';
import React, { useState } from 'react'

import { TableRow, TableCell, Checkbox, MenuItem } from '@mui/material';
import { TableMoreMenu } from 'src/components/table';
import Iconify from 'src/components/Iconify';

const TableRowCustom = ({ selected, item, checkable, onCheckBoxClicked, actions }) => {

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      {checkable && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onCheckBoxClicked} />
        </TableCell>
      )}
      {Object.values(item).map(value => {
        return (
          <TableCell align="left" key={value}>
            {value || '-'}
          </TableCell>
        )
      })}
      {actions.length > 0 && (
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                {actions.map(({ text, icon, onClick }) => (
                  <MenuItem
                    key={text}
                    onClick={() => {
                      onClick && onClick()
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon={icon} />
                    {text}
                  </MenuItem>
                ))}

              </>
            }
          />
        </TableCell>
      )}
    </TableRow>
  )
}

TableRowCustom.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  checkable: PropTypes.bool,
  onCheckBoxClicked: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.object)
};

export default TableRowCustom
