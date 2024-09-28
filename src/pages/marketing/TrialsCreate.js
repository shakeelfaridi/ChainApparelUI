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
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import TrialsNewEditFormBatch from '../../sections/@dashboard/trials/TrialsNewEditFormBatch';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const isSingle = pathname.includes('single');

  const currentUser = _userList.find((user) => paramCase(user.name) === name);


  return (
    <Page title={!isEdit ? 'Create a new ' + (isSingle ? 'single trial code' : 'batch') : 'Edit ' + (isSingle ? 'single trial code' : 'batch') +': ' + capitalCase(name)}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new ' + (isSingle ? 'single trial code' : 'batch') : 'Edit ' + (isSingle ? 'single trial code' : 'batch')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'All trials', href: PATH_DASHBOARD.marketing.trials },
            { name: !isEdit ? 'Add ' + (isSingle ? 'single trial code' : 'batch') : 'Edit ' + (isSingle ? 'single trial code' : 'batch') + ': ' + capitalCase(name) },
          ]}
        />
        <TrialsNewEditFormBatch isEdit={isEdit} isSingle={isSingle} currentUser={currentUser} />
      </Container>
    </Page>
  );
}