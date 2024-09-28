// REACT CORE
import PropTypes from 'prop-types';

// UTILS
import { fPercent } from '../../../../utils/formatNumber';

// MUI
import {
    Card,
    Typography,
    Link,
    Box,
} from '@mui/material';

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    type: PropTypes.string,
    dense: PropTypes.bool,
    goto: PropTypes.string,
    sx: PropTypes.object,
};
  
export default function StatCard ({ title, total, type, dense, goto, sx, ...other }) {
   
    const densedSx = dense ? {
       title: {
           fontSize: '14px !important'
       },
       subtitle: {
           fontSize: '18px !important'
       },
       box: {
           flexGrow: '1'
       },
       card: {
           display: 'flex', 
           alignItems: 'center', 
           p: 3,
           height: '100%',
           ...sx
       }
    }: {
       box: {
           flexGrow: '1'
       },
       card:{
           display: 'flex', 
           alignItems: 'center', 
           p: 3,
           height: '100%',
           ...sx
       }
    };

    return (
      <Card sx={densedSx.card} {...other}>
        <Box sx={densedSx.box}>
           <Typography variant="subtitle2" sx={densedSx.title}>
               {goto !== undefined && goto.length > 0 ? 
                   <Link href={goto}>{title}</Link>
               : title}
           </Typography>
           <Typography variant="h3" sx={densedSx.subtitle}>
               {type === '%' ? fPercent(total) : total}
           </Typography>
        </Box>
      </Card>
    );
}