import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Divider, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import { FormProvider, RHFTextField, RHFSelect, RHFDate, RHFSwitch } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const BRANCH_OPTIONS = [
  'all',
  'E-WISE',
  'PE Academy',
  'PO Online',
  'CME Online',
];

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

TrialsNewEditFormBatch.propTypes = {
  isEdit: PropTypes.bool,
  currentBatch: PropTypes.object,
};

export default function TrialsNewEditFormBatch({ isEdit, isSingle, currentBatch }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  // Set date + 1 year
  var expireDate = new Date();
  var now = new Date();
  expireDate.setYear(now.getFullYear() + 1);

  const [filterBranch, setFilterBranch] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');
  const [audienceData, setAudienceData] = useState(TRIAL_PRODUCTS_EWISE_OPTIONS);
  const [disableProduct, setDisableProduct] = useState('1');
  const [expiringValue, setExpiringValue] = useState(expireDate.toString());
  const [notifyChecked, setNotifyChecked] = useState(false);


  const handleFilterProduct = (event) => {
    setFilterProduct(event.target.value);
    console.log(filterProduct);
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
    console.log(filterBranch);
  };

  const NewTrialScheme = Yup.object().shape({
    name: Yup.string().required('A name for your batch is required'),
    batches: Yup.string().required('The number of batches is required'),
    branch: Yup.string().required('The branch is required'),
    product: Yup.string().required('The product is required'),
    expiring: Yup.string().required('An expiring date is required'),
    firstname: Yup.string().required('Firstname is required'),
    lastname: Yup.string().required('Lastname is required'),
    email: Yup.string().email().required('Email address is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      batches: 2,
      branch: (filterBranch === 'all' ? '' : filterBranch),
      product: (filterProduct === 'all' ? '' : filterProduct),
      expiring: expiringValue || new Date(),
      firstname: '',
      lastname: '',
      email: '',
      notify: notifyChecked
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBatch]
  );

  const methods = useForm({
    resolver: yupResolver(NewTrialScheme),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentBatch) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBatch]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.marketing.trials);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        
        <Grid item xs={12} md={12}>

          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3
              }}
            >
              <RHFTextField name="name" label="Name of your batch" disabled={isEdit ? 1 : 0}/>
            </Box>
          </Card>

          {!isEdit && (   
            <>
            <Card sx={{ p: 3 }} style={{ marginTop: '15px' }}>
              <Typography variant="h4">Select product & expiration</Typography>
              <Divider style={{ marginTop: '15px', marginBottom: '15px' }}></Divider>
                  <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <RHFSelect
                      fullWidth
                      select
                      label="Branch"
                      name="branch"
                      value={filterBranch}
                      onChange={handleFilterBranch}
                      SelectProps={{
                        MenuProps: {
                          sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                        },
                      }}
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {BRANCH_OPTIONS.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            textTransform: 'capitalize',
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Box>
                  <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <RHFSelect
                      fullWidth
                      select
                      disabled={disableProduct}
                      label="Product"
                      name="product"
                      value={filterProduct}
                      onChange={handleFilterProduct}
                      SelectProps={{
                        MenuProps: {
                          sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                        },
                      }}
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {audienceData.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            textTransform: 'capitalize',
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Box>
                  <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <RHFDate name="expiring" label="Expiring on?" defaultValues={expiringValue} onChange={(newExpiringValue) => { setExpiringValue(newExpiringValue); }}></RHFDate>
                  </Box>
                  
              </Card>
            </>
          )}

        </Grid>

        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            
            {isSingle ? (
              <>
                <Typography variant="h4" marginBottom={4}>Customer information</Typography>

                <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 3,
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                    }}
                  >
                  <RHFTextField name="firstname" label="Firstname" type="text" disabled={isEdit ? 1 : 0}/>
                  <RHFTextField name="lastname" label="Lastname" type="text" disabled={isEdit ? 1 : 0}/>
                </Box>

                <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 3,
                      marginTop: '15px',
                    }}
                  >
                  <RHFTextField name="email" label="Email address" type="text" disabled={isEdit ? 1 : 0}/>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    marginTop: '15px',
                    justifyContent: 'flex-start',
                    backgroundColor: '#f7f8f9',
                    padding: '15px',
                  }}
                >
                  <RHFSwitch
                    name="notify"
                    labelPlacement="start"
                    checked={notifyChecked} 
                    onChange={() => {setNotifyChecked(!notifyChecked);}}
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Email verification
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Enabeling will send the user an email to verify an email address.
                        </Typography>
                      </>
                    }
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </Box>
              </>
            ):(
              <>
                <Typography variant="h4" marginBottom={4}>Batch</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3
                  }}
                >
                  <RHFTextField name="batches" label="Number of trial codes" type="number" disabled={isEdit ? 1 : 0}/>
                </Box>
              </>) 
            }

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create batch' : 'Back'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}