/**
 * Todo:
 * 1. Make it dynamic
 * 2. Save position + button when position is changed
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
  DialogContentText
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _bannersList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { BannersTableToolbar, BannersTableRow } from '../../sections/@dashboard/banners/list';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'scheduled', 'expired'];

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
  { id: 'bannersTitle', label: 'Campaign title', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'products', label: 'Product', align: 'left' },
  { id: 'targetAudience', label: 'Target audience', align: 'left' },
  { id: 'created', label: 'Published', align: 'center' },
  { id: 'expiring', label: 'Expiring', align: 'center' },
  { id: 'lastModified', label: 'Last modified', align: 'center' },
  { id: 'manager', label: 'Created by', align: 'center' },
  { id: 'weight', label: 'Position', align: 'center'},
  { id: '' },
];

// ----------------------------------------------------------------------

export default function BannersList() {
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

  const [tableData, setTableData] = useState(_bannersList);

  const [filterName, setFilterName] = useState('');

  const [filterBranch, setFilterBranch] = useState('all');

  const [disableProduct, setDisableProduct] = useState('1');

  const [audienceData, setAudienceData] = useState(TARGET_AUDIENCE_EWISE_OPTIONS);

  const [filterProduct, setFilterProduct] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('active');

  const [open, setOpen] = useState(false);

  const [SelectedId, setSelectedId] = useState([]);
  const [DialogTitle, setDialogTitle] = useState('');
  const [DialogMessage, setDialogMessage] = useState('');
  const [ShowWeightActions, setShowWeightActions] = useState(false);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
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

  const handleChangeWeight = (id) => {
    onSelectRow(id);
    setShowWeightActions(true);
  }

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

  const handleRemoveRows = (selected) => {
    setDialogTitle('Remove banners');
    setDialogMessage('Are you sure you want to remove ' + selected.length + ' banners?');
    setOpen(true);
    setSelectedId(selected);
  };

  const handleTakeOfflineRows = (selected) => {
    setDialogTitle('Offline?');
    setDialogMessage('Are you sure you want to take ' + selected.length + ' banners offline?');
    setOpen(true);
    setSelectedId(selected);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleFilterProduct = (event) => {
    setFilterProduct(event.target.value);
  };

  const handleSaveWeights = (selected) => {
    setDialogTitle('Change position?');
    setDialogMessage('Are you sure you want to change the positions of selected banners?');
    setOpen(true);
    setSelectedId(selected);
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterBranch,
    filterProduct,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterBranch) ||
    (!dataFiltered.length && !!filterProduct) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="Marketing: Banners list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Banners"
          links={[
            { name: 'Marketing', href: PATH_DASHBOARD.root },
            { name: 'Banners' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.marketing.bannersNew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Add banner
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

          <BannersTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              filterBranch={filterBranch}
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
                    <>
                    {!ShowWeightActions ? <><Tooltip title="Take offline?">
                        <IconButton color="primary" onClick={() => handleTakeOfflineRows(selected)}>
                          <Iconify icon={'carbon:cloud-offline'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton color="primary" onClick={() => handleRemoveRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip></>
                    : <><Tooltip title="Save">
                      <IconButton color="primary" onClick={() => handleSaveWeights(selected)}>
                        <Iconify icon={'bx:save'} />
                      </IconButton>
                    </Tooltip></>
                    }
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
                    <BannersTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEnableRow={() => handleEnableRow(row.id)}
                      onTakeOfflineRow={() => handleTakeOfflineRow(row.id)}
                      onRemoveRow={() => handleRemoveRow(row.id)}
                      onEditRow={() => handleEditRow(row.name)}
                      onChangeWeight={() => handleChangeWeight(row.id)}
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

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterBranch, filterProduct }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => 
        item.bannersTitle.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        || item.manager.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterBranch !== 'all') {
    tableData = tableData.filter((item) => item.branch === filterBranch);
  }

  if (filterProduct !== 'all') {
    tableData = tableData.filter((item) => (item.products.filter(product => product.title.toLowerCase() === filterProduct.toLowerCase()).length) > 0 );
  }

  return tableData;
}