import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  TableContainer,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableHeadCustom } from '../../../../components/table';

// ----------------------------------------------------------------------

AppQuality.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  tableData: PropTypes.array.isRequired,
  tableLabels: PropTypes.array.isRequired,
};

export default function AppQuality({ title, subheader, tableData, tableLabels, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <AppQualityRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

AppQualityRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
    branch: PropTypes.number,
    targetGroup: PropTypes.string,
    quality: PropTypes.string,
  }),
};

function AppQualityRow({ row }) {

  return (
    <TableRow>

        <TableCell>
            <div style={{ color: '#fff', backgroundColor: 'green', fontWeight: 'bold', textAlign: 'center', padding: '5px' }}>
                100% <br/> K:100.0%, A:100.0%
            </div>
        </TableCell>

        <TableCell>{row.branch}</TableCell>

        <TableCell>{row.targetGroup}</TableCell>

    </TableRow>
  );
}
