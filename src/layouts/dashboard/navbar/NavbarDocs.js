// @mui
import { Stack, Button, Typography, Link } from '@mui/material';
// assets
import { DocIllustration } from '../../../assets';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  return (
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
      <DocIllustration sx={{ width: 1 }} />

      <div>
        <Typography gutterBottom variant="subtitle1">
          Hi, Stephan Csorba
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Need help?
          <br /> Please add your ticket
        </Typography>
      </div>

      <Button variant="contained" >
        <Link href="https://ewise.zohodesk.eu/portal/nl/myarea" target="_blank" sx={{ color: '#fff' }}>here!</Link>
      </Button>
    </Stack>
  );
}
