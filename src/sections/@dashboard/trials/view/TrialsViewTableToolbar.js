import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

TrialsViewTableToolbar.propTypes = {
  quickSearch: PropTypes.string,
  onQuickSearch: PropTypes.func,
};

export default function TrialsViewTableToolbar({  quickSearch, 
                                            onQuickSearch,
                                        }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={quickSearch}
        onChange={(event) => onQuickSearch(event.target.value)}
        placeholder="Search trial codes, students, companies or courses..."
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
