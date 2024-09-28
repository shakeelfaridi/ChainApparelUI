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
  DialogContentText
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'disabled'];

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
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'zohoID', label: 'Zoho', align: 'center' },
  { id: 'company', label: 'Company', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'branch', label: 'Branch', align: 'left' },
  { id: 'targetAudience', label: 'Target audience', align: 'left' },
  { id: 'lastLogin', label: 'Last login', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
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

  const [tableData, setTableData] = useState(_userList);

  const [filterName, setFilterName] = useState('');

  const [filterBranch, setFilterBranch] = useState('all');

  const [filterTargetAudience, setFilterTargetAudience] = useState('all');

  const [disableTargetAudience, setDisableTargetAudience] = useState('1');

  const [audienceData, setAudienceData] = useState(TARGET_AUDIENCE_EWISE_OPTIONS);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const [open, setOpen] = useState(false);

  const [SelectedId, setSelectedId] = useState([]);
  const [DialogTitle, setDialogTitle] = useState('');
  const [DialogMessage, setDialogMessage] = useState('');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

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
    setDialogTitle('Disable user');
    setDialogMessage('Disabeling will prevent access to our platform. Are you sure you want to disable this user?');
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
    setDialogTitle('Disable users');
    setDialogMessage('Disabeling will prevent access to our platform. Are you sure you want to disable ' + selected.length + ' users?');
    setOpen(true);
    setSelectedId(selected);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterBranch,
    filterTargetAudience,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterBranch) ||
    (!dataFiltered.length && !!filterTargetAudience) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New User
            </Button>
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
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterbranch={filterBranch}
            onFilterName={handleFilterName}
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
                    <Tooltip title="Disable">
                      <IconButton color="primary" onClick={() => handleDisableRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
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
                    <UserTableRow
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

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterBranch, filterTargetAudience }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => 
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        || item.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        || item.company.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterBranch !== 'all') {
    tableData = tableData.filter((item) => item.branch === filterBranch);
  }

  if (filterTargetAudience !== 'all') {
    tableData = tableData.filter((item) => item.targetAudience === filterTargetAudience);
  }

  return tableData;
}
