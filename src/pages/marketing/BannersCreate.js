/**
 * Todo:
 * 1. Make it dynamic
 * 2. Define Max lenghts for input fields
 * 3. Fix: Select branch/Product with Yup
 * 4. Cleanup
 */

import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _bannersList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import BannersNewEditForm from 'src/sections/@dashboard/banners/BannersNewEditForm';

// ----------------------------------------------------------------------

export default function BannersCreate() {

  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const currentBanner = _bannersList.find((banner) => paramCase(banner.id) === id);

  return (
    <Page title={!isEdit ? 'Create a new banner' : 'Edit banner: ' + capitalCase(currentBanner.bannersTitle)}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new banner' : 'Edit banner'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Banners', href: PATH_DASHBOARD.marketing.banners },
            { name: !isEdit ? 'New banner' : 'Edit: ' + capitalCase(currentBanner.bannersTitle) },
          ]}
        />
        <BannersNewEditForm isEdit={isEdit} currentBanner={currentBanner} />
      </Container>
    </Page>
  );
}