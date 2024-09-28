/**
 * Todo:
 * 1. Make it dynamic
 * 2. Export function, Excel/PDF
 * 3. Cleanup
 */

import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { capitalCase } from 'change-case';
import { htmlToPdf } from 'src/state/api/htmltoPdf';
import NProgress from 'nprogress';
import { useMediaQuery } from 'react-responsive';

 
 // @mui
 import {
     Box,
     Card,
     Button,
     ButtonGroup,
     Container,
     Grid,
     Typography,
     TableContainer,
     Table,
     TableBody,
     Divider,
     Link,
     Collapse,
     CardActions,
     CardContent,
     Stack,
     Switch,
     FormControlLabel,
     FormControl,
     FormGroup,
     TextField,
     MenuItem
 } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _lmsList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// local storage
import { localStorageHas, localStorageGet, localStorageSave } from '../../helpers/LocalStorage';

// Custom components
import { DataCard } from './lms';
  
// ----------------------------------------------------------------------
  
export default function LmsView() {
 
    const { id, locid, targetid, prodid } = useParams();
    const { themeStretch } = useSettings();

    // Conditionals
    const isLocation = (locid !== undefined && parseInt(locid) > 0) ? true : false;
    const isTargetGroup = (targetid !== undefined && parseInt(targetid) > 0) ? true : false;
    const isProduct = (prodid !== undefined && parseInt(prodid) > 0) ? true : false;
    const isCompany = !isLocation && !isTargetGroup && !isProduct ? true : false;

    // Get data from record
    const currentRecord = _lmsList.find((record) => paramCase(record.id) === id);

    // Organisation
    const organisationName = currentRecord.lmsLocations[0].name;

    // Location
    const currentLocation = currentRecord ? findLocation(currentRecord, locid)[0] : [];
    const currentLocationName = currentLocation ? currentLocation.name : 'NaN';

    // Target Group
    const currentTargetGroup = currentRecord ? findTargetGroup(currentRecord, targetid)[0] : [];
    const currentTargetGroupName = currentTargetGroup ? currentTargetGroup.title : 'NaN';

    // Product
    const currentProduct = currentRecord ? findProduct(currentRecord, prodid)[0] : [];
    const currentProductName = currentProduct ? currentProduct.title : 'NaN';

    // Filters
    const RANGE_OPTIONS = [
        'year',
        'schoolyear',
        'custom'
    ]

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const [dense, setDense] = useState(isBigScreen ? true : false);
    const [showProducts, setShowProducts] = useState(true);
    const [dateViews, setDateViews] = useState(['day']);

    // Filters - Date
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() -2);
    const [filterRange, setFilterRange] = useState(defineFilterRange());
    const today = new Date();
    const [minDate, setMinDate] = useState(threeYearsAgo);
    const [maxDate, setMaxDate] = useState(today);
    const [fromDate, setFromDate] = useState(defineMinDate());
    const [toDate, setToDate] = useState(defineMaxDate());
    const [showTotals, setShowTotals] = useState(true);

    // Functions

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

    const handleFilterRange = (event) => {
        setFilterRange(event.target.value);
        localStorageSave('[lms]-dateRangeType', event.target.value);
    };  
   
    const handlePDFDownload = () => {
        NProgress.start();
        htmlToPdf();
        NProgress.done();
    };

    const handleToggleDense = () => {
        setDense((prev) => !prev);
    };

    const handleToggleShowProducts = () => {
        setShowProducts((prev) => !prev);
    };

    useEffect(() => {
        console.log(currentRecord);
        setDateViews(handleDateViews(filterRange));
    }, [filterRange, currentRecord]);
  
     return (
         <Page title={getPageTitle(id, locid, targetid, prodid)}>
         <Container maxWidth={themeStretch ? false : 'lg'}>
             <HeaderBreadcrumbs
             heading="LMS"
             links={[
                 { name: 'Stats', href: PATH_DASHBOARD.root },
                 { name: 'LMS Overview', href: PATH_DASHBOARD.stats.lms },
                 ( locid ? { name: currentLocationName, 
                             href: PATH_DASHBOARD.stats.lmsViewLoc(id, locid) } : { name: '' } 
                 ),
                 ( targetid ? { name: currentTargetGroupName, 
                                href: PATH_DASHBOARD.stats.lmsViewLocAud(id, locid, targetid) } 
                                    : { name: '' }
                 ),
                 ( prodid ? { name: currentProductName } : { name: '' }),
             ]}
             action={
                 <ButtonGroup variant="contained" aria-label="outlined primary button group">
                     <Button
                         variant="contained"
                         startIcon={<Iconify icon={'ant-design:file-excel-filled'} 
                         />}
                     >
                        Excel
                     </Button>
                     <Button
                     onClick={handlePDFDownload}
                     variant="contained"
                     startIcon={<Iconify icon={'ant-design:file-pdf-filled'} 
                     />}
                 >
                     PDF
                     </Button>
                 </ButtonGroup>
             }
             />

                <Divider sx={{
                    marginTop: '24px',
                    marginBottom: '24px'
                }}/>

                <Grid container 
                    spacing={3}
                    justifyContent="center"
                    alignItems="center">
                    <Grid item xs={12} md={12} sx={{
                            textAlign: 'center'
                        }}>
                            <FormControlLabel
                            control={
                                <Switch checked={dense} onChange={handleToggleDense} name="dense" />
                            }
                            label="Dense"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={showProducts} onChange={handleToggleShowProducts} name="products" />
                            }
                            label="Show products"
                            />
                        </Grid>
                </Grid>

                <Divider sx={{
                    marginTop: '24px',
                    marginBottom: '24px'
                }}/>

                <FormControl component="fieldset" variant="standard" sx={{
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <FormGroup>
                        <Grid container 
                            spacing={3}
                            justifyContent="center"
                            alignItems="center">
                            
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Date range"
                                    value={filterRange}
                                    onChange={handleFilterRange}
                                    SelectProps={{
                                        MenuProps: {
                                        sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                                        },
                                    }}
                                    sx={{
                                        textTransform: 'capitalize',
                                        maxWidth: '32%',
                                        marginRight: '1%',
                                        textAlign: 'left'
                                    }}
                                    >
                                    {RANGE_OPTIONS.map((option) => (
                                        <MenuItem
                                        key={option}
                                        value={option}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            textAlign: 'left'
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
                                        renderInput={(params) => <TextField sx={{ marginRight: '1%', maxWidth: '32%' }} {...params} />}
                                    />
                                    {filterRange === 'custom' && (
                                        <DatePicker
                                            label="To"
                                            views={dateViews}
                                            minDate={fromDate}
                                            maxDate={maxDate}
                                            value={toDate}
                                            onChange={handleToChange}
                                            renderInput={(params) => <TextField sx={{maxWidth: '33%'}} {...params} />}
                                        />
                                    )}
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </FormGroup>
                </FormControl>

                <Divider sx={{
                    marginTop: '24px',
                    marginBottom: '24px'
                }}/>

                <Grid container spacing={1} sx={{
                        padding: '20px',
                        marginBottom: '24px',
                        backgroundColor: '#f8f8f8',
                        borderRadius: '16px',
                    }}>
 
                     <Grid item xs={12} md={6}>
                        <strong>Organisation:</strong>
                     </Grid>

                     <Grid item xs={12} md={6}>
                        {organisationName}
                     </Grid>
 
                     {isLocation && (
                        <>
                            <Grid item xs={12} md={6}>
                                <strong>Location:</strong>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {currentLocationName}
                            </Grid>
                        </>
                      )}

                    {isTargetGroup && (
                        <>
                            <Grid item xs={12} md={6}>
                                <strong>Target Group:</strong>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {currentTargetGroupName}
                            </Grid>
                        </>
                    )}

                    {isProduct && (
                        <>
                            <Grid item xs={12} md={6}>
                                <strong>Product:</strong>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {currentProductName}
                            </Grid>
                        </>
                    )}
 
                </Grid>

                {showTotals && isCompany && (
                    <>
                        <DataCard 
                            data={getLocations(currentRecord)}
                            dense={dense} 
                            isTotals={true} />
                    </>
                )}

                {isCompany && (
                    getLocations(currentRecord).map((location) => (
                        <>
                            <DataCard 
                                recordid={id} 
                                data={location} 
                                dense={dense} 
                                showProducts={showProducts} />
                        </>
                    ))
                )}

                {isLocation && !isProduct && (
                    <>
                        Location
                    </>
                )}

                {isProduct && (
                    <>
                        Product
                    </>
                )}
 
         </Container>
         </Page>
     );
 }

export function findLocation(currentRecord, locid){
    let castLocationsArray = currentRecord.lmsLocations;
    let filteredArray = [];
    castLocationsArray.forEach((location, index) => {
        let castlocationsArray = (location.locations instanceof Array) ? location.locations : [location.locations];
        castlocationsArray.forEach((locdata, index) => {
            if(parseInt(locdata.id) === parseInt(locid)){
                filteredArray.push(locdata);
            }
        });
    });
    return filteredArray;
}

export function findTargetGroup(currentRecord, targetid){
    return [];
}

export function findProduct(currentRecord, prodid){
    let castLocationsArray = currentRecord.lmsLocations;
    let filteredArray = [];
    castLocationsArray.forEach((location, index) => {
        let castlocationsArray = (location.locations instanceof Array) ? location.locations : [location.locations];
        castlocationsArray.forEach((locdata, index) => {
            let castProducts = Array.isArray(locdata.products) ? locdata.products : Array.from(locdata.products);
            castProducts.forEach((proddata, index) => {
                if(parseInt(proddata.id) === parseInt(prodid)){
                    filteredArray.push(proddata);
                }
            });
        });
    });
    return filteredArray;
}

export function getPageTitle(id, locid, targetid, prodid){
    let title = '';
    if(id && locid && targetid && prodid){
        title = 'Reports per product'
    }else if(id && locid && targetid){
        title = 'Reports per target group';
    }else if(id && locid){
        title = 'Reports per location';
    }else{
        title = 'Reports per organisation';
    }
    return title;
}

export function getTitle(id, locid, targetid, prodid){
    let title = '';
    if(id && locid && targetid && prodid){
        title = 'Reports per product'
    }else if(id && locid && targetid){
        title = 'Reports per target group';
    }else if(id && locid){
        title = 'Reports per location';
    }else{
        title = 'Reports per organisation';
    }
    return title;
}

export function handleDateViews(filterRange){
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

function defineFilterRange(){
    if(localStorageHas('[lms]-dateRangeType') === true){
      return localStorageGet('[lms]-dateRangeType');
    }
    return 'year';
}

function defineMinDate(){
    let threeYearsAgo = new Date();
    if(localStorageHas('[lms]-dateRangeFrom') === true){
      return localStorageGet('[lms]-dateRangeFrom');
    }
    return threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() -2);
}
  
function defineMaxDate(){
    let today = new Date();
    if(localStorageHas('[lms]-dateRangeTo') === true){
        console.log(localStorageGet('[lms]-dateRangeTo'));
        return localStorageGet('[lms]-dateRangeTo');
    }
    return today;
}

function getLocations(currentRecord){
    let castLocationsArray = currentRecord.lmsLocations[0].locations;
    castLocationsArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
    return castLocationsArray;
}