import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

BannersTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterBranch: PropTypes.string,
  onFilterBranch: PropTypes.func,
  optionsBranch: PropTypes.arrayOf(PropTypes.string),
  isProductDisabled: PropTypes.string,
  filterProduct: PropTypes.string,
  onFilterProduct: PropTypes.func,
  optionsProduct: PropTypes.arrayOf(PropTypes.string),
};

export default function BannersTableToolbar({ filterName, 
                                              onFilterName,
                                              filterBranch,
                                              onFilterBranch,
                                              optionsBranch,
                                              isProductDisabled,
                                              filterProduct,
                                              onFilterProduct,
                                              optionsProduct
                                        }){
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>

<TextField
        fullWidth
        select
        label="Branch"
        value={filterBranch}
        onChange={onFilterBranch}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsBranch.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        disabled={isProductDisabled}
        label="Product"
        value={filterProduct}
        onChange={onFilterProduct}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsProduct.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
      
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search by campaign title and/or manager..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />

    </Stack>
  );
}
