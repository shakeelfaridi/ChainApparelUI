import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, TableFooter } from '@mui/material';

// ----------------------------------------------------------------------

QualityViewTotalRow.propTypes = {
  headLabel: PropTypes.array,
  sx: PropTypes.object,
  data: PropTypes.array,
};

export default function QualityViewTotalRow({
  headLabel,
  sx,
  data,
}) {

  let total1 = calcTotals(data, 0, '');
  let total2 = calcTotals(data, 1, 'm');

  return (
    <TableFooter sx={sx}>
      <TableRow>
        {headLabel.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell.label.replace('%', (index === 0 ? total1 : total2))}
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );

}

function calcTotals(data, type, output){

  const obj = data;
  let counter = 0;
  let attendees = 0
  for(var i = 0; i < obj.length; i++){
    if(type === 0 && obj[i].value !== ''){
      counter = counter + parseFloat(obj[i].value.toString().replaceAll(',','.'));
    }
    if(type === 1 && obj[i].label !== ''){
      attendees = attendees + parseFloat(obj[i].value);
      counter = counter + (parseFloat(obj[i].label.toString().replaceAll(',','.')) 
                          * parseFloat(obj[i].value.toString().replaceAll(',','.')))
    }
  }

  // Do some more calc when type = minutes
  if(type === 1 && output === 'm'){
    counter = (counter * 60) / attendees;
  }

  return counter;
}