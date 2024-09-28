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
    Divider
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _qualityList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom } from '../../components/table';
// Utils
import { fPercent } from '../../utils/formatNumber';
// sections
import { QualityViewTableRow1, QualityViewTableRow2, QualityViewTableRow3, QualityViewTotalRow } from 'src/sections/@dashboard/stats/quality/view';

 // ----------------------------------------------------------------------
 
const TABLE_HEAD_1 = [
    { key: 'quality', label: 'Quality', align: 'left', width: '50%' },
    { key: 'chosen', label: 'Chosen', align: 'left', width: '50%' },
];

const TABLE_HEAD_2 = [
    { key: 'connection', label: 'Connection with practice', align: 'left', width: '50%' },
    { key: 'chosen', label: 'Chosen', align: 'left', width: '50%' },
];

const TABLE_HEAD_3 = [
    { key: 'duration', label: 'Course duration', align: 'left', width: '50%' },
    { key: 'number', label: 'Number of', align: 'left', width: '50%' },
];

const TABLE_HEAD_4 = [
    { key: 'report', label: 'Report grade', align: 'left', width: '50%' },
    { key: 'number', label: 'Number of', align: 'left', width: '50%' },
];

const TABLE_TOTAL_LABEL = [
    { key: 'attendees', label: 'Gemiddelde duur (% deelnemers)', align: 'left', width: '50%' },
    { key: 'minutes', label: '% minuten', align: 'left', width: '50%' },
];

const TABLE_HEAD_5 = [
    { key: 'error', label: 'Percentage error reply', align: 'left', width: '10%' },
    { key: 'question', label: 'Question', align: 'left', width: '45%' },
    { key: 'widget', label: 'Widgetcode', align: 'left', width: '45%' },
];

const TABLE_HEAD_6 = [
    { key: 'notes', label: 'Notes', align: 'left', width: '50%' },
    { key: 'report', label: 'Report grade', align: 'left', width: '16,66%' },
    { key: 'user', label: 'User', align: 'left', width: '16,66%' },
    { key: 'date', label: 'Date', align: 'left', width: '16,66%' },
];
 
// ----------------------------------------------------------------------
 
 export default function QualityView() {

    const {
        page,
        rowsPerPage
      } = useTable();

    const { id = '' } = useParams();
    const currentQuality = _qualityList.find((quality) => paramCase(quality.id) === id);
    const { themeStretch } = useSettings();

    const [tableData1, setTableData1] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    const [tableData3, setTableData3] = useState([]);
    const [tableData4, setTableData4] = useState([]);
    const [showAnalysis, setShowAnalysis] = useState(0);
    const [tableData5, setTableData5] = useState([]);
    const [tableData6, setTableData6] = useState([]);

    const handlePDFDownload = () => {
        NProgress.start();
        htmlToPdf();
        NProgress.done();
    };

    const tableRef = useRef(null);

    useEffect(() => {
        if(typeof currentQuality.tableData1 == 'object' && currentQuality.tableData1.length > 0){
            setTableData1(currentQuality.tableData1);
            setShowAnalysis(1);
        }
        if(typeof currentQuality.tableData2 == 'object' && currentQuality.tableData2.length > 0){
            setTableData2(currentQuality.tableData2);
            setShowAnalysis(1);
        }
        if(typeof currentQuality.tableData3 == 'object' && currentQuality.tableData3.length > 0){
            setTableData3(currentQuality.tableData3);
            setShowAnalysis(1);
        }
        if(typeof currentQuality.tableData4 == 'object' && currentQuality.tableData1.length > 0){
            setTableData4(currentQuality.tableData4);
            setShowAnalysis(1);
        }
        if(typeof currentQuality.tableData5 == 'object' && currentQuality.tableData5.length > 0){
            setTableData5(currentQuality.tableData5);
        }
        if(typeof currentQuality.tableData6 == 'object' && currentQuality.tableData6.length > 0){
            setTableData6(currentQuality.tableData6);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuality]);
 
    return (
        <Page title="Stats: Quality">
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
            heading="Quality"
            links={[
                { name: 'Stats', href: PATH_DASHBOARD.root },
                { name: 'Quality', href: PATH_DASHBOARD.stats.quality },
                { name: 'View: ' + capitalCase(currentQuality.course) },
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
                    Export
                    </Button>
                </ButtonGroup>
            }
            />


                <Grid container spacing={3}>

                    <Grid item xs={12} md={3}>
                        <QualityStatCard
                            title="Number of evaluations"
                            total={1800}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <QualityStatCard
                            title="Quality"
                            total={70.1}
                            type="%"
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <QualityStatCard
                            title="Connection with practice"
                            total={70.5}
                            type="%"
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <QualityStatCard
                            title="Report grade"
                            total={8.5}
                        />
                    </Grid>

                </Grid>

                {showAnalysis === 1 && (
                    <Card sx={{
                        padding: '20px',
                        marginTop: '24px'
                    }}>

                        <Typography variant="h4" component="h1" paragraph>
                            Analysis per evaluation question
                        </Typography>

                        {tableData1.length > 0 && (
                            <Scrollbar>
                                <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                                    <Table ref={tableRef}>
                                        <TableHeadCustom headLabel={TABLE_HEAD_1}/>

                                        <TableBody>
                                            {tableData1.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                                <QualityViewTableRow1
                                                    key={row.id}
                                                    row={row}
                                                />
                                            ))}
                                            <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData1.length)} />
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        )}

                        {tableData2.length > 0 && (
                            <>
                                <Divider sx={{ marginTop: '24px', marginBottom: '24px' }}/>
                                <Scrollbar>
                                    <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                                        <Table ref={tableRef}>
                                            <TableHeadCustom headLabel={TABLE_HEAD_2}/>

                                            <TableBody>
                                                {tableData2.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                                    <QualityViewTableRow1
                                                        key={row.id}
                                                        row={row}
                                                    />
                                                ))}
                                                <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData2.length)} />
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Scrollbar>
                            </>
                        )}

                        {tableData3.length > 0 && (
                            <>
                                <Divider sx={{ marginTop: '24px', marginBottom: '24px' }}/>
                                <Scrollbar>
                                    <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                                        <Table ref={tableRef}>
                                            <TableHeadCustom headLabel={TABLE_HEAD_3}/>

                                            <TableBody>
                                                {tableData3.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                                    <QualityViewTableRow1
                                                        key={row.id}
                                                        row={row}
                                                    />
                                                ))}
                                                <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData3.length)} />
                                            </TableBody>

                                            <QualityViewTotalRow  headLabel={TABLE_TOTAL_LABEL} data={tableData3}/>

                                        </Table>
                                    </TableContainer>
                                </Scrollbar>
                            </>
                        )}

                        {tableData4.length > 0 && (
                            <>
                                <Divider sx={{ marginTop: '24px', marginBottom: '24px' }}/>
                                <Scrollbar>
                                    <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                                        <Table ref={tableRef}>
                                            <TableHeadCustom headLabel={TABLE_HEAD_4}/>

                                            <TableBody>
                                                {tableData4.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                                    <QualityViewTableRow1
                                                        key={row.id}
                                                        row={row}
                                                    />
                                                ))}
                                                <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData4.length)} />
                                            </TableBody>

                                        </Table>
                                    </TableContainer>
                                </Scrollbar>
                            </>
                        )}

                    </Card>
                )}

                {tableData5.length > 0 && (
                    <Card sx={{
                        padding: '20px',
                        marginTop: '24px'
                    }}>
                        <Typography variant="h4" component="h1" paragraph>
                            Bad scoring questions
                        </Typography>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                                <Table ref={tableRef}>
                                    <TableHeadCustom headLabel={TABLE_HEAD_5}/>

                                    <TableBody>
                                        {tableData5.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <QualityViewTableRow2
                                                key={row.id}
                                                row={row}
                                            />
                                        ))}
                                        <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData5.length)} />
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Card>  
                )}

                {tableData6.length > 0 && (
                    <Card sx={{
                        padding: '20px',
                        marginTop: '24px'
                    }}>
                        <Typography variant="h4" component="h1" paragraph>
                            Comments
                        </Typography>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                                <Table ref={tableRef}>
                                    <TableHeadCustom headLabel={TABLE_HEAD_6}/>

                                    <TableBody>
                                        {tableData6.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <QualityViewTableRow3
                                                key={row.id}
                                                row={row}
                                            />
                                        ))}
                                        <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData6.length)} />
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Card>  
                )}

        </Container>
        </Page>
    );
}

// ----------------------------------------------------------------------

QualityStatCard.propTypes = {
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    type: PropTypes.string,
    sx: PropTypes.object,
};
  
export function QualityStatCard({ title, total, type, sx, ...other }) {      
    return (
      <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{title}</Typography>
                <Typography variant="h3">
                {type === '%' ? fPercent(total) : total}
            </Typography>
        </Box>
      </Card>
    );
}