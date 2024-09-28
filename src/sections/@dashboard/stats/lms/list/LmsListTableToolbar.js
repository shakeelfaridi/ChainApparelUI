import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Divider } from '@mui/material';
import { useState, useEffect } from 'react';

// components
import Iconify from '../../../../../components/Iconify';

// Datepicker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// local storage
import { localStorageHas, localStorageGet, localStorageSave } from '../../../../../helpers/LocalStorage';

// ----------------------------------------------------------------------

LmsListTableToolbar.propTypes = {
  quickSearch: PropTypes.string,
  onQuickSearch: PropTypes.func,
  filterBranch: PropTypes.string,
  onFilterBranch: PropTypes.func,
  optionsBranch: PropTypes.arrayOf(PropTypes.string),
  isTargetAudienceDisabled: PropTypes.bool,
  filterTargetAudience: PropTypes.string,
  onFilterTargetAudience: PropTypes.func,
  optionsTargetAudience: PropTypes.arrayOf(PropTypes.string),
  optionsRange: PropTypes.arrayOf(PropTypes.string),
  filterRange: PropTypes.string,
  onFilterRange: PropTypes.func,
};

export default function LmsListTableToolbar({
  quickSearch, 
  onQuickSearch, 
  filterBranch, 
  onFilterBranch, 
  optionsBranch, 
  isTargetAudienceDisabled, 
  filterTargetAudience, 
  onFilterTargetAudience, 
  optionsTargetAudience,
  filterRange,
  optionsRange,
  onFilterRange
  }) {

  const threeYearsAgo = new Date();
  const today = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() -2);

  const [minDate, setMinDate] = useState(threeYearsAgo);
  const [maxDate, setMaxDate] = useState(today);

  const [fromDate, setFromDate] = useState(defineMinDate());
  const [toDate, setToDate] = useState(defineMaxDate());

  const handleFromChange = (newValue) => {
      setFromDate(newValue);
      setToDate(newValue);
      // Save the date in local storage
      const saveDate = newValue.toISOString().slice(0, 10);
      localStorageSave('[lms]-dateRangeFrom', saveDate);
      localStorageSave('[lms]-dateRangeTo', saveDate);
  };

  const handleToChange = (newValue) => {
      setToDate(newValue);
      // Save the date in local storage
      const saveDate = newValue.toISOString().slice(0, 10);
      localStorageSave('[lms]-dateRangeTo', saveDate);
  };

  const [dateViews, setDateViews] = useState(['day']);
  const [optionsWidth, setOptionsWidth] = useState('33%');

  useEffect(() => {
    setDateViews(
      handleDateViews(filterRange)
    );
    setOptionsWidth(
      filterRange !== 'custom' ? '50%' : '33%'
    );
  }, [filterRange]);

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
          value={quickSearch}
          onChange={(event) => onQuickSearch(event.target.value)}
          placeholder="Search company, location or filter by manager..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />

      </Stack>

      <Divider/>

      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>

        <TextField
          fullWidth
          select
          label="Date range"
          value={filterRange}
          onChange={onFilterRange}
          SelectProps={{
            MenuProps: {
              sx: { '& .MuiPaper-root': { maxHeight: 260 } },
            },
          }}
          sx={{
            maxWidth: optionsWidth,
            textTransform: 'capitalize',
          }}
        >
          {optionsRange.map((option) => (
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

        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="From"
                views={dateViews}
                value={fromDate}
                minDate={minDate}
                maxDate={maxDate}
                onChange={handleFromChange}
                renderInput={(params) => <TextField sx={{ marginRight: '16px', width: optionsWidth }} {...params} />}
            />
            {filterRange === 'custom' && (
              <DatePicker
                  label="To"
                  views={dateViews}
                  minDate={fromDate}
                  maxDate={maxDate}
                  value={toDate}
                  onChange={handleToChange}
                  renderInput={(params) => <TextField {...params} sx={{ width: optionsWidth }} />}
              />
            )}
        </LocalizationProvider>

      </Stack>

    </>
  );
}

function handleDateViews(filterRange){

  let View = [];
  switch(filterRange){
    case 'year':
      View = ['year'];
      break;
    case 'schoolyear':
      View = ['year'];
      break;
    case 'custom':
      View = ['year','month','day'];
      break;
    default:
      View = ['year','month','day'];
  }
  return View;

}

function defineMinDate(){
  let today = new Date();
  if(localStorageHas('[lms]-dateRangeFrom') === true){
    return localStorageGet('[lms]-dateRangeFrom');
  }
  return today;
}

function defineMaxDate(){
  let today = new Date();
  if(localStorageHas('[lms]-dateRangeTo') === true){
    console.log(localStorageGet('[lms]-dateRangeTo'));
    return localStorageGet('[lms]-dateRangeTo');
  }
  return today;
}