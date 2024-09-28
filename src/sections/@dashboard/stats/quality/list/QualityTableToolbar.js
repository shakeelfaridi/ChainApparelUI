import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../../components/Iconify';

// ----------------------------------------------------------------------

QualityTableToolbar.propTypes = {
  quickSearch: PropTypes.string,
  onQuickSearch: PropTypes.func,
  filterBranch: PropTypes.string,
  onFilterBranch: PropTypes.func,
  optionsBranch: PropTypes.arrayOf(PropTypes.string),
  isTargetAudienceDisabled: PropTypes.string,
  filterTargetAudience: PropTypes.string,
  onFilterTargetAudience: PropTypes.func,
  optionsTargetAudience: PropTypes.arrayOf(PropTypes.string),
  filterQuality: PropTypes.string,
  onFilterQuality: PropTypes.func,
  optionsQuality: PropTypes.arrayOf(PropTypes.string),
};

export default function QualityTableToolbar({
  quickSearch, 
  onQuickSearch, 
  filterBranch, 
  onFilterBranch, 
  optionsBranch, 
  isTargetAudienceDisabled, 
  filterTargetAudience, 
  onFilterTargetAudience, 
  optionsTargetAudience,
  filterQuality,
  onFilterQuality,
  optionsQuality
  }) {

  return (
    <>
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
          disabled={isTargetAudienceDisabled}
          label="Target audience"
          value={filterTargetAudience}
          onChange={onFilterTargetAudience}
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
          {optionsTargetAudience.map((option) => (
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
          disabled={isTargetAudienceDisabled}
          label="Quality"
          value={filterQuality}
          onChange={onFilterQuality}
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
          {optionsQuality.map((option) => (
            <MenuItem
              key={option.key}
              value={option.key}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          value={quickSearch}
          onChange={(event) => onQuickSearch(event.target.value)}
          placeholder="Search course..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />

      </Stack>
    </>
  );
}