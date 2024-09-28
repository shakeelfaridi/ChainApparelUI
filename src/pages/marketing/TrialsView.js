/**
 * Todo:
 * 1. Make it dynamic
 * 2. Export function
 * 3. Cleanup
 */

import { paramCase } from 'change-case';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  ButtonGroup,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _trialsView } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { TrialsViewTableToolbar, TrialsViewTableRow } from '../../sections/@dashboard/trials/view';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'activated'];

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'activated', label: 'Activated', align: 'center' },
  { id: 'email_verified', label: 'Email verified', align: 'center' },
  { id: 'students', label: 'Student', align: 'left' },
  { id: 'company', label: 'Company', align: 'left' },
  { id: 'courses', label: 'Courses', align: 'left' },
];

// ----------------------------------------------------------------------

export default function TrialsView() {
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

  const [tableData, setTableData] = useState(_trialsView);

  const [quickSearch, setQuickSearch] = useState('');

  const { currentTab: filterType, onChangeTab: onChangeFilterType } = useTabs('all');

  const [open, setOpen] = useState(false);

  const [SelectedId, setSelectedId] = useState([]);
  const [DialogTitle, setDialogTitle] = useState('');
  const [DialogMessage, setDialogMessage] = useState('');

  const handleQuickSearch = (quickSearch) => {
    setQuickSearch(quickSearch);
    setPage(0);
  };

  const handleDisableRow = (id) => {
    setDialogTitle('Remove trial codes');
    setDialogMessage('Deleting ensures that sent trial codes can no longer be activated. Are you sure you want to remove?');
    setOpen(true); 
    setSelectedId(prevIds => [...prevIds, id]);
  };

  const handleExportExcel = (selected) => {
    setDialogTitle('Export trial codes');
    setDialogMessage('Do you want to export ' + selected.length + ' trial codes to excel?');
    setOpen(true);
    setSelectedId(selected);
  };

  const handleExportPDF = (selected) => {
    setDialogTitle('Export trial codes');
    setDialogMessage('Do you want to export ' + selected.length + ' trial codes to PDF?');
    setOpen(true);
    setSelectedId(selected);
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

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    quickSearch,
    filterType,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!quickSearch) ||
    (!dataFiltered.length && !!filterType);

  return (
    <Page title="Marketing: Trials">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Trials"
          links={[
            { name: 'Marketing', href: PATH_DASHBOARD.root },
            { name: 'Trials', href: PATH_DASHBOARD.marketing.trials },
            { name: 'View' },
            { name: 'Batch 1' },
          ]}
          action={
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button
                variant="contained"
                startIcon={<Iconify icon={'ant-design:file-excel-filled'} />}
              >
                Export
              </Button>
              <Button
              variant="contained"
              startIcon={<Iconify icon={'ant-design:file-pdf-filled'} />}
            >
              Export
            </Button>
          </ButtonGroup>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterType}
            onChange={onChangeFilterType}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <TrialsViewTableToolbar
            quickSearch={quickSearch}
            onQuickSearch={handleQuickSearch}
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
                    <TrialsViewTableRow
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEnableRow={() => handleEnableRow(row.id)}
                      onDisableRow={() => handleDisableRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
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

function applySortFilter({ tableData, comparator, quickSearch, filterType, }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (quickSearch) {
      tableData = tableData.filter((item) => 
        item.code.toLowerCase().indexOf(quickSearch.toLowerCase()) !== -1
        || item.company.toLowerCase().indexOf(quickSearch.toLowerCase()) !== -1
        || searchStudents(item, quickSearch) > 0
        || searchCourse(item, quickSearch) > 0
      );
  }

  if (filterType !== 'all') {
    tableData = tableData.filter((item) => 
        item.activated.toLowerCase() !== ''
    );
  }

  return tableData;
}

function searchCourse(item, search){
  let castCourseArray = Array.isArray(item.courses) ? item.courses : Array.from(item.courses);
  let filteredArray = castCourseArray.filter((course)=>{
    return course.title.toLowerCase().indexOf(search.toLowerCase()) !== -1 }
  );
  return filteredArray.length;
}

function searchStudents(item, search){
  let castCourseArray = Array.isArray(item.students) ? item.students : Array.from(item.students);
  let filteredArray = castCourseArray.filter((student)=>{
    return student.email.toLowerCase().indexOf(search.toLowerCase()) !== -1 
           || student.firstname.toLowerCase().indexOf(search.toLowerCase()) !== -1
           || student.lastname.toLowerCase().indexOf(search.toLowerCase()) !== -1  
          }
  );
  return filteredArray.length;
}
