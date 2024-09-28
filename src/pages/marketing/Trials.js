/**
 * Todo:
 * 1. Make it dynamic
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
import { _trialsList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { TrialsTableToolbar, TrialsTableRow } from '../../sections/@dashboard/trials/list';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'batch', 'single'];

const BRANCH_OPTIONS = [
  'all',
  'E-WISE',
  'PE Academy',
  'PO Online',
  'CME Online',
];

const TRIAL_PRODUCTS_EWISE_OPTIONS = [
  'all',
];

const TRIAL_PRODUCTS_PE_OPTIONS = [
  'all',
];

const TRIAL_PRODUCTS_PO_OPTIONS = [
  'all',
];

const TRIAL_PRODUCTS_CME_OPTIONS = [
  'all',
  'Alliance healthcare',
  'Apotheekhoudend huisarts proefcursus variant',
  'Apotheker proefcursus (KNMP)',
  'Apotheker proefcursus (Lareb)'
];

const TRIAL_PRODUCTS_DEFAULT = [
  'all',
]

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'branch', label: 'Branch', align: 'left' },
  { id: 'product', label: 'Product', align: 'left' },
  { id: 'productvariant', label: 'Variant', align: 'left' },
  { id: 'total', label: 'Total', align: 'center' },
  { id: 'used', label: 'Used', align: 'center' },
  { id: 'unused', label: 'Unused', align: 'center' },
  { id: 'created', label: 'Created', align: 'center' },
  { id: 'expiration', label: 'Expiration Date', align: 'center' },
  { id: 'manager', label: 'Sales manager', align: 'center' },
  { id: 'type', label: 'Type', align: 'center' },
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

  const [tableData, setTableData] = useState(_trialsList);

  const [filterManager, setFilterManager] = useState('');

  const [filterBranch, setFilterBranch] = useState('all');

  const [filterProduct, setFilterProduct] = useState('all');

  const [disableProduct, setDisableProduct] = useState('1');

  const [audienceData, setAudienceData] = useState(TRIAL_PRODUCTS_EWISE_OPTIONS);

  const { currentTab: filterType, onChangeTab: onChangeFilterType } = useTabs('all');

  const [open, setOpen] = useState(false);

  const [SelectedId, setSelectedId] = useState([]);
  const [DialogTitle, setDialogTitle] = useState('');
  const [DialogMessage, setDialogMessage] = useState('');

  const handleFilterManager = (filterManager) => {
    setFilterManager(filterManager);
    setPage(0);
  };

  const handleFilterBranch = (event) => {
    setFilterBranch(event.target.value);
    if(event.target.value !== 'all'){
      setDisableProduct('');
      //@todo should be better then this coded
      if(event.target.value === "E-WISE"){
          setAudienceData(TRIAL_PRODUCTS_EWISE_OPTIONS);
      }else if(event.target.value === "PE Academy"){
          setAudienceData(TRIAL_PRODUCTS_PE_OPTIONS);
      }else if(event.target.value === "PO Online"){
          setAudienceData(TRIAL_PRODUCTS_PO_OPTIONS);
      }else if(event.target.value === "CME Online"){
          setAudienceData(TRIAL_PRODUCTS_CME_OPTIONS);
      }else{
          setAudienceData(TRIAL_PRODUCTS_DEFAULT);
      }
      setFilterProduct('all');
    }else{
      setAudienceData(TRIAL_PRODUCTS_DEFAULT);
      setFilterProduct('all');
      setDisableProduct('1');
    }
  };

  const handleFilterProduct = (event) => {
    setFilterProduct(event.target.value);
  };

  const handleDisableRow = (id) => {
    setDialogTitle('Remove trial codes');
    setDialogMessage('Deleting ensures that sent trial codes can no longer be activated. Are you sure you want to remove?');
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
    setDialogTitle('Remove trial codes');
    setDialogMessage('Deleting ensures that sent trial codes can no longer be activated. Are you sure you want to remove ' + selected.length + ' trial batches?');
    setOpen(true);
    setSelectedId(selected);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterManager,
    filterBranch,
    filterProduct,
    filterType,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterManager) ||
    (!dataFiltered.length && !!filterBranch) ||
    (!dataFiltered.length && !!filterProduct) ||
    (!dataFiltered.length && !!filterType);

  return (
    <Page title="Marketing: Trials">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Trials"
          links={[
            { name: 'Marketing', href: PATH_DASHBOARD.root },
            { name: 'Trials' },
          ]}
          action={
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.marketing.trialsNew + '/batch'}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Batch
              </Button>
              <Button
              variant="contained"
              component={RouterLink}
              to={(PATH_DASHBOARD.marketing.trialsNew + '/single')}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Single
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

          <TrialsTableToolbar
            filterManager={filterManager}
            filterbranch={filterBranch}
            onFilterManager={handleFilterManager}
            onFilterBranch={handleFilterBranch}
            optionsBranch={BRANCH_OPTIONS}
            isProductDisabled={disableProduct}
            filterProduct={filterProduct}
            onFilterProduct={handleFilterProduct}
            optionsProduct={audienceData}
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
                    <TrialsTableRow
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

function applySortFilter({ tableData, comparator, filterManager, filterType, filterBranch, filterProduct }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterManager) {
    tableData = tableData.filter((item) => 
        item.manager.toLowerCase().indexOf(filterManager.toLowerCase()) !== -1
        );
  }

  if (filterType !== 'all') {
    tableData = tableData.filter((item) => 
        item.type.toLowerCase().indexOf(filterType.toLowerCase()) !== -1
    );
  }

  if (filterBranch !== 'all') {
    tableData = tableData.filter((item) => item.branch === filterBranch);
  }

  if (filterProduct !== 'all') {
    tableData = tableData.filter((item) => item.product === filterProduct);
  }

  return tableData;
}
