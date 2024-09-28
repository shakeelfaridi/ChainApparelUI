/**
 * Todo:
 * 1. Make it dynamic
 * 2. Cleanup
 */

import { paramCase } from 'change-case';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import {
   Box,
   Card,
   Table,
   Switch,
   Button,
   TableBody,
   Container,
   TableContainer,
   TablePagination,
   FormControlLabel,
   Dialog, 
   DialogTitle, 
   DialogContent,
   DialogActions,
   DialogContentText,
   Tooltip,
   IconButton
} from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _lmsList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { LmsListTableRow, LmsListTableToolbar } from 'src/sections/@dashboard/stats/lms/list';

// local storage
import { localStorageHas, localStorageGet, localStorageSave } from '../../helpers/LocalStorage';
 
 // ----------------------------------------------------------------------
  
 const BRANCH_OPTIONS = [
   'all',
   'E-WISE',
   'PE Academy',
   'PO Online',
   'CME Online',
 ];
 
 const TARGET_AUDIENCE_EWISE_OPTIONS = [
   'all',
   'Intern begeleider', 
   'Kinderopvang',
   'Schoolleider VO',
   'Leraren oud',
   'MBO', 
   'Schoolleider PO', 
   'Primair onderwijs', 
   'Voortgezet onderwijs'
 ];
 
 const TARGET_AUDIENCE_PE_OPTIONS = [
   'all',
   'Fiscalist'
 ];
 
 const TARGET_AUDIENCE_PO_OPTIONS = [
   'all',
   'Advocatuur',
   'Notariaat',
   'Fiscalist',
   'Accountancy'
 ];
 
 const TARGET_AUDIENCE_CME_OPTIONS = [
   'all',
   'Fysiotherapeut',
   'Tandarts'
 ];
 
 const TARGET_AUDIENCE_DEFAULT = [
   'all',
 ]

 const RANGE_OPTIONS = [
    'year',
    'schoolyear',
    'custom'
 ]
 
 const TABLE_HEAD = [
    { id: 'company', label: 'Company', align: 'left' },
    { id: 'stud', label: 'Students', align: 'center' },
    { id: 'studLoggedIn', label: 'Students logged in', align: 'center' },
    { id: 'activeStud', label: 'Active students', align: 'center' },
    { id: 'activeStudPercentage', label: '% Active', align: 'center' },
    { id: 'totFinished', label: 'Total courses finished', align: 'center' },
    { id: 'avgCourses', label: 'Avg. courses per student', align: 'center'},
    { id: 'avgCoursesActive', label: 'Avg. courses per active student', align: 'center'},
    { id: 'points', label: 'Points', align: 'center'},
    { id: 'avgPoints', label: 'Avg. points per student', align: 'center'},
    { id: 'avgPointsActive', label: 'Avg. points per active student', align: 'center'},
 ];
 
 // ----------------------------------------------------------------------
 
 export default function LmsList() {
   const {
     dense,
     page,
     order,
     orderBy,
     rowsPerPage,
     setPage,
     //
     selected,
     setSelected,
     onSelectRow,
     onSelectAllRows,
     //
     onSort,
     onChangeDense,
     onChangePage,
     onChangeRowsPerPage,
   } = useTable();
 
   const { themeStretch } = useSettings();
   const navigate = useNavigate();

   const [tableData, setTableData] = useState(_lmsList);
   const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');
   const [quickSearch, setQuickSearch] = useState(defineQuickSearch());
   const [filterBranch, setFilterBranch] = useState(defineBranch());
   const [filterRange, setFilterRange] = useState(defineFilterRange());
   const [disableTargetAudience, setDisableTargetAudience] = useState(filterBranch !== 'all' ? false : true);
   const [filterTargetAudience, setFilterTargetAudience] = useState(defineTargetAudience());
   const [audienceData, setAudienceData] = useState(TARGET_AUDIENCE_EWISE_OPTIONS);
   const [open, setOpen] = useState(false);
   const [SelectedId, setSelectedId] = useState([]);
   const [DialogTitle, setDialogTitle] = useState('');
   const [DialogMessage, setDialogMessage] = useState(''); 

   const handleQuickSearch = (quickSearch) => {
    setQuickSearch(quickSearch);
    localStorageSave('[lms]-quicksearch', quickSearch);
    setPage(0);
  };
 
   const handleRemoveRow = (id) => {
     setDialogTitle('Remove banner');
     setDialogMessage('Are you sure you want to remove the banner?');
     setOpen(true); 
     setSelectedId(prevIds => [...prevIds, id]);
   };
 
   const handleTakeOfflineRow = (id) => {
     setDialogTitle('Offline');
     setDialogMessage('Are you sure you want to take this banner offline?');
     setOpen(true); 
     setSelectedId(prevIds => [...prevIds, id]);
   };
 
   const handleClose = () => {
     setOpen(false);
   };
 
   const handleConfirm = () => {
     const disableRows = tableData.filter((row) => SelectedId.includes(row.id));
     for(let i = 0; i<disableRows.length; i++) {
         let disableRow = tableData.filter((row) => row.id === SelectedId[i]);
         console.log(disableRow);
         disableRow[0].status = "disabled";
     }
     setSelectedId([]);
     setSelected([]);
     handleClose();
   };
 
   const handleEnableRow = (id) => {
     const row = tableData.filter((row) => row.id === id);
     row[0].status = "active";
   };
 
   const handleEditRow = (id) => {
     navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
   };

    const handleExportExcel = (selected) => {
        setDialogTitle('Export LMS stats');
        setDialogMessage('Do you want export LMS stats to excel?');
        setOpen(true);
        setSelectedId(selected);
    };

    const handleExportPDF = (selected) => {
        setDialogTitle('Export LMS stats');
        setDialogMessage('Do you want to create a LMS stats report?');
        setOpen(true);
        setSelectedId(selected);
    };

    const handleFilterBranch = (event) => {
        setFilterBranch(event.target.value);
        localStorageSave('[lms]-branch', event.target.value);
        if(event.target.value !== 'all'){
            setDisableTargetAudience(false);
            //@todo should be better then this coded
            if(event.target.value === "E-WISE"){
                setAudienceData(TARGET_AUDIENCE_EWISE_OPTIONS);
            }else if(event.target.value === "PE Academy"){
                setAudienceData(TARGET_AUDIENCE_PE_OPTIONS);
            }else if(event.target.value === "PO Online"){
                setAudienceData(TARGET_AUDIENCE_PO_OPTIONS);
            }else if(event.target.value === "CME Online"){
                setAudienceData(TARGET_AUDIENCE_CME_OPTIONS);
            }else{
                setAudienceData(TARGET_AUDIENCE_DEFAULT);
            }
            setFilterTargetAudience('all');
            localStorageSave('[lms]-targetaudience', 'all');
        }else{
            setAudienceData(TARGET_AUDIENCE_DEFAULT);
            setFilterTargetAudience('all');
            setDisableTargetAudience(true);
            localStorageSave('[lms]-targetaudience', 'all');
        }
    };

    const handleFilterRange = (event) => {
      setFilterRange(event.target.value);
      localStorageSave('[lms]-dateRangeType', event.target.value);
    };

    const handleFilterTargetAudience = (event) => {
        setFilterTargetAudience(event.target.value);
        localStorageSave('[lms]-targetaudience', event.target.value);
    };
 
   const dataFiltered = applySortFilter({
     tableData,
     comparator: getComparator(order, orderBy),
     quickSearch,
     filterStatus,
     filterBranch,
     filterTargetAudience,
   });
 
   const denseHeight = dense ? 52 : 72;
 
   const isNotFound =
     (!dataFiltered.length && !!quickSearch) ||
     (!dataFiltered.length && !!filterStatus) ||
     (!dataFiltered.length && !!filterBranch) ||
     (!dataFiltered.length && !!filterTargetAudience)
     ;
 
   return (
     <Page title="Stats: LMS overview">
       <Container maxWidth={themeStretch ? false : 'lg'}>
         <HeaderBreadcrumbs
           heading="LMS Overview"
           links={[
             { name: 'Stats', href: PATH_DASHBOARD.root },
             { name: 'LMS Overview' },
           ]}
         />
 

        <Card>

            <LmsListTableToolbar
                quickSearch={quickSearch}
                onQuickSearch={handleQuickSearch}
                filterBranch={filterBranch}
                onFilterBranch={handleFilterBranch}
                optionsBranch={BRANCH_OPTIONS}
                isTargetAudienceDisabled={disableTargetAudience}
                filterTargetAudience={filterTargetAudience}
                onFilterTargetAudience={handleFilterTargetAudience}
                optionsTargetAudience={audienceData}
                optionsRange={RANGE_OPTIONS}
                filterRange={filterRange}
                onFilterRange={handleFilterRange}
            />

            <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                    onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                    )
                    }
                    actions={
                        <>
                            <Tooltip title="Export to Excel">
                                <IconButton color="primary" onClick={() => handleExportExcel(selected)}>
                                <Iconify sx={{ color: '#000' }} icon={'ant-design:file-excel-filled'} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export to PDF">
                                <IconButton color="primary" onClick={() => handleExportPDF(selected)}>
                                <Iconify sx={{ color: '#000' }} icon={'ant-design:file-pdf-filled'} />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                />
                )}

                <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                    onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                    )
                    }
                />

                <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <LmsListTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onEnableRow={() => handleEnableRow(row.id)}
                        onTakeOfflineRow={() => handleTakeOfflineRow(row.id)}
                        onRemoveRow={() => handleRemoveRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                    />
                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                    <TableNoData isNotFound={isNotFound} />
                </TableBody>
                </Table>
            </TableContainer>
            </Scrollbar>

            <Box sx={{ position: 'relative' }}>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
            </Box>
        </Card>

       </Container>
       <ConfirmDialog 
         open={open} 
         onClose={handleClose} 
         onConfirm={handleConfirm} 
         title={DialogTitle}
         message={DialogMessage}/>
     </Page>
   );
 }
 
 
 // Dialog ----------------------------------------------------------------------
 
 ConfirmDialog.propTypes = {
   open: PropTypes.bool,
   onClose: PropTypes.func,
   onConfirm: PropTypes.func,
   title: PropTypes.string,
   message: PropTypes.string
 };
 
 function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
   return (
     <div>
       <Dialog
         open={open}
         onClose={onClose}
         fullWidth 
         maxWidth="xs"
       >
         <DialogTitle id="alert-dialog-title">
           {title}
         </DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description">
             {message}
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={onClose}>
             Cancel
           </Button>
           <Button variant="contained" onClick={onConfirm} autoFocus>
             Confirm
           </Button>
         </DialogActions>
       </Dialog>
     </div>
   );
 }
 
 // ----------------------------------------------------------------------
 
 function applySortFilter({ tableData, comparator, quickSearch, filterBranch, filterTargetAudience }) {
    const stabilizedThis = tableData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    tableData = stabilizedThis.map((el) => el[0]);
 
    if (quickSearch !== '') {
        tableData = tableData.filter((item) => 
            //item.name.toLowerCase().indexOf(quickSearch.toLowerCase()) !== -1
            searchCompanies(item, quickSearch.toLowerCase()) > 0
            || searchManagers(item, quickSearch.toLowerCase()) > 0
            || searchLocations(item, quickSearch.toLowerCase()) > 0
        );
    }

    if (filterBranch !== 'all') {
        tableData = tableData.filter((item) => item.branch === filterBranch);
    }

    if (filterTargetAudience !== 'all') {
        tableData = tableData.filter((item) => 
            searchProducts(item, filterTargetAudience.toLowerCase()) > 0
        );
    }

    return tableData;
}

function searchCompanies(item, search){
    let castCompanyArray = Array.isArray(item.lmsLocations) ? item.lmsLocations : Array.from(item.lmsLocations);
    let filteredArray = castCompanyArray.filter((company)=>{
        return company.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 }
    );
    return filteredArray.length;
}

function searchLocations(item, search){
    let castLocationsArray = item.lmsLocations;
    let filteredArray = 0;
    castLocationsArray.forEach((location, index) => {
        let castlocationsArray = (location.locations instanceof Array) ? location.locations : [location.locations];
        if(castlocationsArray.length > 0){
            filteredArray = castlocationsArray.filter((company)=>{
                    return company.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 
                }
            );
        }
    });
    return filteredArray.length;
}


function searchManagers(item, search){
    let castManagerArray = Array.isArray(item.managers) ? item.managers : Array.from(item.managers);
    let filteredArray = castManagerArray.filter((manager)=>{
        return manager.email.toLowerCase().indexOf(search.toLowerCase()) !== -1 
                || manager.firstname.toLowerCase().indexOf(search.toLowerCase()) !== -1
                || manager.lastname.toLowerCase().indexOf(search.toLowerCase()) !== -1  
                }
    );
    return filteredArray.length;
}

function searchProducts(item, search){
    let castLocationsArray = item.lmsLocations;
    let filteredArray = 0;
    castLocationsArray.forEach((location, index) => {
        let castlocationsArray = (location.locations instanceof Array) ? location.locations : [location.locations];
        castlocationsArray.forEach((locdata, index) => {
            let castProducts = Array.isArray(locdata.products) ? locdata.products : Array.from(locdata.products);
            if(castProducts.length > 0){
                filteredArray = castProducts.filter((product)=>{
                    return product.title.toLowerCase().indexOf(search.toLowerCase()) !== -1 
                });
            }

        });
    });
    return filteredArray.length;
}

function defineFilterRange(){
  if(localStorageGet('[lms]-dateRangeType') !== undefined && 
    localStorageHas('[lms]-dateRangeType') === true){
    return localStorageGet('[lms]-dateRangeType');
  }
  return 'year';
}

function defineQuickSearch(){
  if(localStorageGet('[lms]-quicksearch') !== undefined && 
    localStorageHas('[lms]-quicksearch') === true ){
    return localStorageGet('[lms]-quicksearch');
  }
  return '';
}

function defineTargetAudience(){
  if(localStorageGet('[lms]-targetaudience') !== undefined && 
    localStorageHas('[lms]-targetaudience') === true ){
    return localStorageGet('[lms]-targetaudience');
  }
  return 'all';
}

function defineBranch(){
  if(localStorageGet('[lms]-branch') !== undefined && 
    localStorageHas('[lms]-branch') === true ){
    return localStorageGet('[lms]-branch');
  }
  return 'all';
}