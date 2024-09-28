import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { 
  Checkbox, 
  TableRow, 
  TableCell, 
  Link, 
  IconButton,
  Typography,
  Divider,
  } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// ROUTES
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// HELPERS
import { LmsSingletotals, LmsSumLocationTotals } from '../../../../../helpers';

// ----------------------------------------------------------------------

LmsListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func, 
  onSelectRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onDisableRow: PropTypes.func,
};

export default function LmsListTableRow({ row, selected, onEditRow, onSelectRow, onDisableRow, onEnableRow }) {

  const [open, setOpen] = useState(false);

  const { 
    id,
    managers,
    lmsLocations } = row;
    

  return (

    <>

      <TableRow hover selected={selected}>

        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>


        {lmsLocations.map((location) => (
         
          <>
            <TableCell align="left" width="50%">
                {location.locations.length > 0 && (
                    <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                )}
                <Link
                  href={(PATH_DASHBOARD.stats.lmsView(id))} 
                  sx={{
                    '&:hover':{
                    cursor: 'pointer'
                    }
                }}>
                  {location.name !== '' ? location.name : '-'}
                </Link>
            </TableCell>
            
            <TableCell align="center">
              {location.locations.length > 0 ? 
                LmsSumLocationTotals(location.locations, 'stud', 'totals', 'round'):
                0}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? 
                LmsSumLocationTotals(location.locations, 'studLoggedIn', 'totals', 'round')
              : 0}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? 
                LmsSumLocationTotals(location.locations, 'activeStud', 'totals', 'round')
              : 0}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? 
                LmsSingletotals
                (
                  LmsSumLocationTotals(location.locations, 'stud', 'totals', 'round'), 
                  LmsSumLocationTotals(location.locations, 'activeStud', 'totals', 'round'),
                  'totals', 
                  'round',
                  '',
                  '%'
                )
                : '0%'}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? 
                LmsSumLocationTotals(location.locations, 'totFinished', 'totals', 'round')
              : 0}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? LmsSingletotals
                  (
                    LmsSumLocationTotals(location.locations, 'totFinished', 'totals', 'round'), 
                    LmsSumLocationTotals(location.locations, 'stud', 'totals', 'round'),
                    'average', 
                    'decimals'
                  )
                : 0}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? LmsSingletotals
                    (
                      LmsSumLocationTotals(location.locations, 'totFinished', 'totals', 'round'), 
                      LmsSumLocationTotals(location.locations, 'stud', 'totals', 'round'),
                      'average', 
                      'decimals'
                    )
                  : 0}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? 
                LmsSumLocationTotals(location.locations, 'points', 'totals', 'round')
              : 0}
            </TableCell>

            <TableCell align="center">
              {location.locations.length > 0 ? LmsSingletotals
                        (
                          LmsSumLocationTotals(location.locations, 'points', 'totals', 'round'), 
                          LmsSumLocationTotals(location.locations, 'stud', 'totals', 'round'),
                          'average', 
                          'decimals'
                        )
                      : 0}
            </TableCell>
            <TableCell align="center">
              {location.locations.length > 0 ? LmsSingletotals
                        (
                          LmsSumLocationTotals(location.locations, 'points', 'totals', 'round'), 
                          LmsSumLocationTotals(location.locations, 'activeStud', 'totals', 'round'),
                          'average', 
                          'decimals'
                        )
                      : 0}
            </TableCell>

          </>

        ))}
        
      </TableRow>

      {open && lmsLocations.map((location) => ( 
        <>
            {location.locations.map((loc) => (

              <>

              <TableRow key={loc.id} sx={{
                backgroundColor: '#f6f6f6'
              }}>

                <TableCell align="center">
                </TableCell>

                <TableCell align="left">
                  <Link href={(PATH_DASHBOARD.stats.lmsViewLoc(id, loc.id))} sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <ArrowForwardIosIcon sx={{
                      width: '16px',
                      height: '16px',
                      marginRight: '10px',
                      marginLeft: '30px',
                    }}/> {loc.name}
                  </Link>
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? 
                    LmsSumLocationTotals(loc, 'stud', 'totals', 'round'):
                    0}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? 
                    LmsSumLocationTotals(loc, 'studLoggedIn', 'totals', 'round')
                  : 0}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? 
                    LmsSumLocationTotals(loc, 'activeStud', 'totals', 'round')
                  : 0}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? 
                    LmsSingletotals
                    (
                      LmsSumLocationTotals(loc, 'stud', 'totals', 'round'), 
                      LmsSumLocationTotals(loc, 'activeStud', 'totals', 'round'),
                      'totals', 
                      'round',
                      '',
                      '%'
                    )
                    : '0%'}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? 
                    LmsSumLocationTotals(loc, 'totFinished', 'totals', 'round')
                  : 0}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? LmsSingletotals
                      (
                        LmsSumLocationTotals(loc, 'totFinished', 'totals', 'round'), 
                        LmsSumLocationTotals(loc, 'stud', 'totals', 'round'),
                        'average', 
                        'decimals'
                      )
                    : 0}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? LmsSingletotals
                        (
                          LmsSumLocationTotals(loc, 'totFinished', 'totals', 'round'), 
                          LmsSumLocationTotals(loc, 'stud', 'totals', 'round'),
                          'average', 
                          'decimals'
                        )
                      : 0}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? 
                    LmsSumLocationTotals(loc, 'points', 'totals', 'round')
                  : 0}
                </TableCell>

                <TableCell align="center">
                  {loc.products.length > 0 ? LmsSingletotals
                            (
                              LmsSumLocationTotals(loc, 'points', 'totals', 'round'), 
                              LmsSumLocationTotals(loc, 'stud', 'totals', 'round'),
                              'average', 
                              'decimals'
                            )
                          : 0}
                </TableCell>
                <TableCell align="center">
                  {loc.products.length > 0 ? LmsSingletotals
                            (
                              LmsSumLocationTotals(loc, 'points', 'totals', 'round'), 
                              LmsSumLocationTotals(loc, 'activeStud', 'totals', 'round'),
                              'average', 
                              'decimals'
                            )
                          : 0}
                </TableCell>

              </TableRow>

                {loc.products.length > 0 && loc.products.map((product) => (

                  <TableRow key={product.id} sx={{
                    backgroundColor: '#f6f6f6'
                  }}>
                    
                    <TableCell align="center">
                    </TableCell>

                    <TableCell align="left">
                      <Link href={(PATH_DASHBOARD.stats.lmsViewLocProd(id, loc.id, product.targetGroup, product.id))} sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <ArrowForwardIosIcon sx={{
                          width: '16px',
                          height: '16px',
                          marginRight: '10px',
                          marginLeft: '60px',
                        }}/> {product.title}
                      </Link>
                    </TableCell>

                    <TableCell align="center">
                      {product.stud ? product.stud : 0}
                    </TableCell>

                    <TableCell align="center">
                      {product.studLoggedIn ? product.studLoggedIn : 0}
                    </TableCell>

                    <TableCell align="center">
                      {product.activeStud ? product.activeStud : 0}
                    </TableCell>

                    <TableCell align="center">
                      {LmsSingletotals(
                        product.stud, 
                        product.activeStud, 
                        'totals', 
                        'round',
                        '',
                        '%'
                        )}
                    </TableCell>

                    <TableCell align="center">
                      {product.totFinished ? product.totFinished : 0}
                    </TableCell>

                    <TableCell align="center">
                      {LmsSingletotals(product.totFinished, product.stud, 'average', 'decimals')}
                    </TableCell>

                    <TableCell align="center">
                      {LmsSingletotals(product.totFinished, product.activeStud, 'average', 'decimals')}
                    </TableCell>

                    <TableCell align="center">
                      {product.points ? product.points : 0}
                    </TableCell>

                    <TableCell align="center">
                      {LmsSingletotals(product.points, product.stud, 'average', 'decimals')}
                    </TableCell>

                    <TableCell align="center">
                      {LmsSingletotals(product.points, product.activeStud, 'average', 'decimals')}
                    </TableCell>

                  </TableRow>

                ))}

              </>

            ))}
        </>
      ))}

      {open && managers && (
            <TableRow>
              <TableCell colSpan={12}>
                <Typography sx={{
                  fontWeight: 'bold'
                }}>Managers: </Typography>
                {managers.map((manager, index) => (
                  (index ? ', ' : '') + manager.firstname + ' ' + manager.lastname
                ))}
              </TableCell>
            </TableRow>
        )}

      {open && (
        <TableRow>
          <TableCell colSpan={12}>
            <Divider/>
          </TableCell>
        </TableRow>
      )}

    </>

  );

}