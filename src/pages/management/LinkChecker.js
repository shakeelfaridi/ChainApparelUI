/**
 * Todo:
 * 1. Make it dynamic
 * 2. Add link to course/lesson (link/to) to real path
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
  DialogContentText,
  ButtonGroup
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _linkChecker } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { LinkCheckerTableToolbar, LinkCheckerTableRow } from '../../sections/@dashboard/linkchecker/list';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'New', 'Ignored'];

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

const TABLE_HEAD = [
  { key: 'targetAudience', label: 'Target Audience', align: 'left' },
  { key: 'code', label: 'Code', align: 'left' },
  { key: 'error', label: 'Error', align: 'left' },
  { key: 'url', label: 'Url', align: 'left' },
  { key: 'lesson', label: 'Lesson', align: 'left' },
  { key: 'lastCheck', label: 'Last check', align: 'left' },
  { key: '' },
];

// ----------------------------------------------------------------------

export default function LinkChecker() {
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

  const [tableData, setTableData] = useState(_linkChecker);
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterTargetAudience, setFilterTargetAudience] = useState('all');
  const [disableTargetAudience, setDisableTargetAudience] = useState('1');
  const [audienceData, setAudienceData] = useState(TARGET_AUDIENCE_EWISE_OPTIONS);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs(1);

  const [open, setOpen] = useState(false);

  const [SelectedId, setSelectedId] = useState([]);
  const [DialogTitle, setDialogTitle] = useState('');
  const [DialogMessage, setDialogMessage] = useState('');

  const handleFilterBranch = (event) => {
    setFilterBranch(event.target.value);
    if(event.target.value !== 'all'){
        setDisableTargetAudience('');
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
    }else{
        setAudienceData(TARGET_AUDIENCE_DEFAULT);
        setFilterTargetAudience('all');
        setDisableTargetAudience('1');
    }
  };

  const handleFilterTargetAudience = (event) => {
    setFilterTargetAudience(event.target.value);
  };

  const handleDisableRow = (id) => {
    setDialogTitle('Ignore broken link');
    setDialogMessage('Are you sure you want to ignore this broken link?');
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

  const handleDisableRows = (selected) => {
    setDialogTitle('Ignore broken links');
    setDialogMessage('Are you sure you want to ignore ' + selected.length + ' broken links?');
    setOpen(true);
    setSelectedId(selected);
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

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterBranch,
    filterTargetAudience,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterTargetAudience) ||
    (!dataFiltered.length && !!filterBranch) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="Management: Link checker">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Link Checker"
          links={[
            { name: 'Management' },
            { name: 'Link checker' },
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
            </ButtonGroup>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab, index) => (
              <Tab disableRipple key={index} label={tab} value={index} />
            ))}
          </Tabs>

          <Divider />

          <LinkCheckerTableToolbar
            filterbranch={filterBranch}
            onFilterBranch={handleFilterBranch}
            optionsBranch={BRANCH_OPTIONS}
            isTargetAudienceDisabled={disableTargetAudience}
            filterTargetAudience={filterTargetAudience}
            onFilterTargetAudience={handleFilterTargetAudience}
            optionsTargetAudience={audienceData}
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
                      <Tooltip title="Ignore">
                        <IconButton color="primary" onClick={() => handleDisableRows(selected)}>
                          <Iconify icon={'octicon:diff-ignored-16'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export to Excel">
                          <IconButton color="primary" onClick={() => handleExportExcel(selected)}>
                          <Iconify sx={{ color: '#000' }} icon={'ant-design:file-excel-filled'} />
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
                    <LinkCheckerTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEnableRow={() => handleEnableRow(row.id)}
                      onDisableRow={() => handleDisableRow(row.id)}
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

function applySortFilter({ tableData, filterTargetAudience, filterBranch, filterStatus }) {

  if (filterBranch !== 'all') {
    tableData = tableData.filter((item) => item.branch === filterBranch);
  }

  if (filterTargetAudience !== 'all') {
    tableData = tableData.filter((item) => item.targetAudience === filterTargetAudience);
  }

  if (filterStatus !== 0) {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  return tableData;
}
