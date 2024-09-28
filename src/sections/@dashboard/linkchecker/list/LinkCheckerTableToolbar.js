import PropTypes from 'prop-types';
import { Stack, TextField, MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

LinkCheckerTableToolbar.propTypes = {
  filterBranch: PropTypes.string,
  onFilterBranch: PropTypes.func,
  optionsBranch: PropTypes.arrayOf(PropTypes.string),
  isTargetAudienceDisabled: PropTypes.string,
  filterTargetAudience: PropTypes.string,
  onFilterTargetAudience: PropTypes.func,
  optionsTargetAudience: PropTypes.arrayOf(PropTypes.string),
};

export default function LinkCheckerTableToolbar({
                                            filterBranch,  
                                            onFilterBranch, 
                                            optionsBranch,
                                            filterTargetAudience,  
                                            onFilterTargetAudience, 
                                            optionsTargetAudience,
                                            isTargetAudienceDisabled
                                        }) {
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

    </Stack>
  );
}
