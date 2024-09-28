import React, { useEffect, useState } from "react";
// @mui
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Card,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  FormControlLabel,
  TextField,
  InputAdornment,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// components
import BoxComp from "../../components/Box";
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import useSettings from "../../hooks/useSettings";
import Iconify from "../../components/Iconify";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from "../../components/table";
import TableRowCustom from "src/components/table/TableRowCustom";
import Scrollbar from "../../components/Scrollbar";
// _mock
import { _mediaList } from "../../_mock";
// hooks
import useTable, { emptyRows } from "../../hooks/useTable";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";

const TABLE_HEAD = [
  { id: "id", label: "ID", align: "left" },
  { id: "filename", label: "Filename", align: "left" },
  { id: "location", label: "Location", align: "left" },
  { id: "", label: "Actions", align: "right" },
];

const Media = () => {
  const { themeStretch } = useSettings();
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = useTable();

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(_mediaList);
  const [edit, setEdit] = useState(false);
  const [row, setRow] = useState({});

  useEffect(() => {
    if (searchText !== "") {
      const filteredRecords = _mediaList.filter(
        (item) =>
          item.filename
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          item.location
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase())
      );

      setFilteredData(filteredRecords);
    } else {
      setFilteredData(_mediaList);
    }
  }, [searchText]);

  const denseHeight = dense ? 52 : 72;

  const editRow = (row, index) => {
    setRow({ row: row, index: index });
    setEdit(true);
  };

  const delrOW=(ind)=>{
    let filtered_data = filteredData.filter(
      (a, index) => index !== ind
    )
    setFilteredData(filtered_data)
  }

  return (
    <>
      {edit && <BoxComp edit={edit} setEdit={setEdit} row={row} filteredData={filteredData}/>}
      <Page title="Editorial: Media">
        <Container maxWidth={themeStretch ? false : "lg"}>
          <HeaderBreadcrumbs
            heading="Media"
            links={[
              { name: "Editorial", href: PATH_DASHBOARD.root },
              { name: "Media" },
            ]}
            action={
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.marketing.trialsNew + "/batch"}
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                >
                  Upload
                </Button>
              </ButtonGroup>
            }
          />

          <Card>
            <Stack
              spacing={2}
              direction={{ xs: "column", sm: "row" }}
              sx={{ py: 2.5, px: 3 }}
            >
              <TextField
                fullWidth
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by filename or location"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon={"eva:search-fill"}
                        sx={{ color: "text.disabled", width: 20, height: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: "relative" }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={filteredData.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        filteredData.map((row) => row.id)
                      )
                    }
                    actions={
                      <Tooltip title="Disable">
                        <IconButton color="primary" onClick={() => {}}>
                          <Iconify icon={"eva:trash-2-outline"} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                )}
                <Table size={dense ? "small" : "medium"}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={filteredData.length}
                    numSelected={0}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        filteredData.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {filteredData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRowCustom
                          key={row.id}
                          item={row}
                          selected={selected.includes(row.id)}
                          checkable={true}
                          onCheckBoxClicked={() => onSelectRow(row.id)}
                          actions={[
                            {
                              text: "Edit",
                              icon: "ant-design:edit-outlined",
                              onClick: () => {
                                editRow(row, index);
                              },
                            },
                            {
                              text: "Delete",
                              icon: "ant-design:delete-outlined",
                              onClick: () => {
                                delrOW(index)
                              },
                            },
                          ]}
                        />
                      ))}
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        filteredData.length
                      )}
                    />

                    <TableNoData isNotFound={filteredData.length < 1} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: "relative" }}>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />

              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: "absolute" } }}
              />
            </Box>
          </Card>
        </Container>
      </Page>
    </>
  );
};

export default Media;
