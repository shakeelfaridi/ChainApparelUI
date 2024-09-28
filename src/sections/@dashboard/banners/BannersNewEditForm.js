import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Divider, MenuItem, FormControlLabel, Switch, Container, Button, Chip } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import 'react-quill/dist/quill.snow.css';
// components
import { FormProvider, RHFTextField, RHFSelect, RHFDate, RHFUploadSingleFile } from '../../../components/hook-form';
// Codeeditor
import CodeEditor from '@uiw/react-textarea-code-editor';

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
  'Advocaat',
  'Advocaat proefcursus'
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

BannersNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBanner: PropTypes.object,
};

export default function BannersNewEditForm({ isEdit, currentBanner }) {
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterProduct, setFilterProduct] = useState(['all']);
  const [audienceData, setAudienceData] = useState(TRIAL_PRODUCTS_EWISE_OPTIONS);
  const [disableProduct, setDisableProduct] = useState('1');
  
  const [expiringDate, setExpiringDate] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);

  const showButton = isEdit && (currentBanner?.buttonTitle !== '' ? true : false);
  const [ShowButtonFields, setShowButtonFields] = useState(showButton);

  const showCss = isEdit && (currentBanner?.customCss !== '' ? true : false);
  const [ShowCustomStyling, setShowCustomStyling] = useState(showCss);

  const getCss = (isEdit && currentBanner?.customCss !== '') ? currentBanner.customCss : '.bannerContainer{\n}\n.bannerContainer .inner{\n}\n.bannerContainer .inner .bannerChip{\nbackground-color: red;\n}\n.bannerContainer .inner .bannerTitle{\ncolor: #fff;\n}\n.bannerContainer .inner .bannerDescription{\ncolor: #fff;\n}\n.bannerContainer .inner .bannerButton{\ncolor: #2B3674;\n}\n';
  const [customCss, setCustomCss] = useState(getCss);

  const [dynBannerTitle, setDynBannerTitle] = useState('Your banner title here');
  const [dynBannerChip, setDynBannerChip] = useState('');
  const [dynBannerDescr, setDynBannerDescr] = useState('Your small description here');
  const [dynButtonTitle, setDynButtonTitle] = useState('Read more');
  const [dynButtonLink, setDynButtonLink] = useState('#');

  const [files, setFiles] = useState([]);

  const switchHandler = (event) => {
    setShowButtonFields(event.target.checked);
  };

  const switchStyling = (event) => {
    setShowCustomStyling(event.target.checked);
  }

  // Set date + 1 year
  var minDate = new Date();
  var now = new Date();
  minDate.setHours(now.getHours() + 24);


  const handleFilterProduct = (event) => {

    const {
        target: { value },
    } = event;

    // Add item
    setFilterProduct(
        typeof value === 'string' ? 
            value.split(',')
        : value,
    );

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
      setFilterProduct(['all']);
    }else{
      setAudienceData(TRIAL_PRODUCTS_DEFAULT);
      setFilterProduct(['all']);
      setDisableProduct('1');
    }
  };

  const NewBannerScheme = Yup.object().shape({
    name: Yup.string().required('The name of your campaign is required'),
    branch: Yup.string().required('The branch is required'),
    product: Yup.array().required('The product is required'),
    title: Yup.string().max(50).required('Banner title is required'),
    description: Yup.string().min(20).max(100).required('A small description for the banner is required'),
    buttonTitle: (ShowButtonFields === true ? Yup.string().max(30).required('The button title is required') : Yup.string().optional()),
    buttonLink: (ShowButtonFields === true ? Yup.string().url().required('The button link is required') : Yup.string().optional()),
  });

  const defaultValues = useMemo(
    () => ({
        name: currentBanner?.bannersTitle || '',
        branch: (filterBranch === 'all' ? '' : filterBranch),
        product: (filterProduct === 'all' ? '' : filterProduct),
        title: currentBanner?.title || '',
        description: currentBanner?.description || '',
        buttonTitle: currentBanner?.buttonTitle || '',
        buttonLink: currentBanner?.buttonLink || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBanner]
  );

  const methods = useForm({
    resolver: yupResolver(NewBannerScheme),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentBanner) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    if(isEdit && currentBanner?.scheduled !== ''){
      setScheduleDate(currentBanner.scheduled);
    }
    if(isEdit && currentBanner?.expiring !== ''){
      setExpiringDate(currentBanner.expiring);
    }
    if(isEdit && currentBanner?.files.length > 0){
      setFiles(currentBanner.files);
    }
    if(isEdit){
      setFilterBranch(currentBanner.branch);
      if(currentBanner.branch === "E-WISE"){
          setAudienceData(TRIAL_PRODUCTS_EWISE_OPTIONS);
      }else if(currentBanner.branch === "PE Academy"){
          setAudienceData(TRIAL_PRODUCTS_PE_OPTIONS);
      }else if(currentBanner.branch === "PO Online"){
          setAudienceData(TRIAL_PRODUCTS_PO_OPTIONS);
      }else if(currentBanner.branch === "CME Online"){
          setAudienceData(TRIAL_PRODUCTS_CME_OPTIONS);
      }else{
          setAudienceData(TRIAL_PRODUCTS_DEFAULT);
      }
      setFilterProduct(setProductsArray(currentBanner));
      setDisableProduct('');

      // Set the preview banners values
      setDynBannerTitle(currentBanner.title);
      setDynBannerDescr(currentBanner.description);
      setDynBannerChip(currentBanner.chip);

      if(currentBanner.buttonTitle !== ''){
        setDynButtonTitle(currentBanner.buttonTitle);
        setDynButtonLink(currentBanner.buttonLink);
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBanner]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.marketing.banners);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBannerTitle = (event) => {
    if(event.target.value !== ''){
      setDynBannerTitle(event.target.value);
    }else{
      setDynBannerTitle('Your banner title here');
    }
  };

  const handleBannerChip = (event) => {
    if(event.target.value !== ''){
      setDynBannerChip(event.target.value);
    }else{
      setDynBannerChip('');
    }
  };

  const handleBannerDescr = (event) => {
    if(event.target.value !== ''){
      setDynBannerDescr(event.target.value);
    }else{
      setDynBannerDescr('Your small description here');
    }
  };

  const handleButtonTitle = (event) => {
    if(event.target.value !== ''){
      setDynButtonTitle(event.target.value)
    }else{
      setDynButtonTitle('Read more');
    }
  };

  const handleButtonLink = (event) => {
    if(event.target.value !== ''){
      setDynButtonLink(event.target.value)
    }else{
      setDynButtonLink('#');
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles(newFiles);
    },
    []
  );

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
              <RHFTextField name="name" label="Name of your campaign"/>
            </Box>
            <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                <RHFDate name="scheduled" label="Schedule banner?" value={scheduleDate} minDate={minDate} 
                onChange={(newScheduleDate) => { setScheduleDate(newScheduleDate); }}></RHFDate>
                <Typography variant="caption" display="block">
                    Add any date to schedule the banner in the future.
                </Typography>
            </Box>
            <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                <RHFDate name="expiring" label="Expiring on?" value={expiringDate} minDate={minDate} 
                onChange={(newExpiringDate) => { setExpiringDate(newExpiringDate); }}></RHFDate>
                <Typography variant="caption" display="block">
                    Leave blank to show the banner forever.
                </Typography>
            </Box>
          </Card>

          <Card sx={{ p: 3 }} style={{ marginTop: '15px' }}>
            <Typography variant="h4">Select product</Typography>
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
                      multiple: true,
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
            </Card>

        </Grid>

        <Grid item xs={12} md={12}>

          <Card sx={{ p: 3 }}>
            
            <Typography variant="h4" marginBottom={4}>Banner</Typography>

            <Box
                sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3
                }}
            >

                <RHFUploadSingleFile name="banner" label="Upload banner" accept="image/*" maxSize={3145728} onDrop={handleDrop}/>

                {files.length > 0 && (
                  <>
                    <Box
                        className='bannerContainer'
                        sx={{
                        display: 'grid',
                        columnGap: 2,
                        rowGap: 3,
                        maxWidth: '1090px',
                        height: '350px',
                        width: '100%',
                        backgroundImage: 'url("' + files[0].preview  +'")',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        borderRadius: '20px',
                        marginBottom: '24px',
                        }}
                    >
                        <Container 
                          className='inner'
                          sx={{
                            padding: '3em',
                            width: '100%',
                            marginLeft: '50px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                          <Container>

                            {dynBannerChip !== '' && (
                              <Chip label={dynBannerChip} color="primary" className='bannerChip' sx={{
                                marginBottom: '10px'
                              }} />
                            )}

                            <Typography variant="h1" component="h2"
                              className='bannerTitle'
                              sx={{ color: '#fff', 
                                    fontSize: '34px !important',
                                    fontFamily: '"Roboto", serif',
                                    maxWidth: '50%',
                                    fontWeight: '600' }}>
                              {dynBannerTitle}
                            </Typography>
                            <Typography variant="body1" 
                              className='bannerDescription'
                              sx={{ color: '#fff', 
                                    fontFamily: '"Roboto", serif',
                                    maxWidth: '50%',
                                    paddingTop: '10px',
                                  }}>
                              {dynBannerDescr}
                            </Typography>
                            {ShowButtonFields === true && (
                              <Button variant="contained" href={dynButtonLink} 
                                className='bannerButton'
                                target="_blank"
                                sx={
                                [{
                                  marginTop: '20px',
                                  color: '#2B3674',
                                  backgroundColor: '#fff',  
                                },
                                (theme) => ({
                                  '&:hover': {
                                    color: '#fff',
                                    backgroundColor: '#2B3674',
                                  },
                                })
                                ]}>
                                {dynButtonTitle}
                              </Button>
                            )}
                          </Container>
                        </Container>
                    </Box>
                  </>
                )}

                {customCss && ShowCustomStyling && (
                  <style>
                    {customCss}
                  </style>
                )}

                <RHFTextField name="title" label="Title"
                  onKeyUp={(event) => { handleBannerTitle(event); }}/>

                <RHFTextField name="chip" label="Chip"
                  onKeyUp={(event) => { handleBannerChip(event); }}/>

                <RHFTextField name="description" label="Small description"
                  onKeyUp={(event) => { handleBannerDescr(event); }}
                />

                <FormControlLabel
                        labelPlacement="start"
                        control={
                        <Controller
                            name="addButton"
                            control={control}
                            render={({ field }) => (
                            <Switch
                                {...field}
                                checked={ShowButtonFields}
                                onChange={switchHandler}
                            />
                            )}
                        />
                        }
                        label={
                        <>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Add button?
                            </Typography>
                        </>
                        }
                        sx={{ mx: 0, mb: 1, width: 1, justifyContent: 'space-between' }}
                />

                {ShowButtonFields === true && (
                    <>
                        <RHFTextField name="buttonTitle" label="Button title" 
                          onKeyUp={(event) => { handleButtonTitle(event); }}
                        />
                        <RHFTextField name="buttonLink" label="Link" 
                        onKeyUp={(event) => { handleButtonLink(event); }}/>
                    </>
                )}

                <FormControlLabel
                        labelPlacement="start"
                        control={
                        <Controller
                            name="addCustomStyling"
                            control={control}
                            render={({ field }) => (
                            <Switch
                                {...field}
                                checked={ShowCustomStyling}
                                onChange={switchStyling}
                            />
                            )}
                        />
                        }
                        label={
                        <>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Add custom css?
                            </Typography>
                        </>
                        }
                        sx={{ mx: 0, mb: 1, width: 1, justifyContent: 'space-between' }}
                />

                {ShowCustomStyling === true && (
                  <>
                    <CodeEditor
                      value={customCss}
                      language="css"
                      placeholder="Please enter Css code."
                      onChange={(evn) => setCustomCss(evn.target.value)}
                      padding={15}
                      minHeight={250}
                      style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      }}
                    />
                  </>
                )}

            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Add banner' : 'Update'}
                </LoadingButton>
            </Stack>

        </Grid>

      </Grid>
    </FormProvider>
  );
}

export function setProductsArray(currentBanner){
  let Products = [];
  currentBanner.products.map((product, index) =>
    Products.push(product.title)
  );
  console.log(Products);
  return Products;
}