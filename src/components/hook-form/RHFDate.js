import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TextField } from '@mui/material';
// Icon
import Iconify from '../Iconify';
import InputAdornment from "@mui/material/InputAdornment";

// ----------------------------------------------------------------------

RHFDate.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};

export default function RHFDate({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      
      render={({ field, fieldState: { error } }) => (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                label={label}
                {...field} 
                fullWidth 
                error={!!error} 
                helperText={error?.message} 
                {...other}
                renderInput={(params) => 
                  <TextField 
                    name="expiration" 
                    style={{ width: '100%' }}
                    {...params}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Iconify icon={'akar-icons:calendar'} color="#000" width={16} height={16} />
                        </InputAdornment>
                      ),
                    }}
                    />}
                />
            </LocalizationProvider>
        </>
      )}
    />
  );
}
