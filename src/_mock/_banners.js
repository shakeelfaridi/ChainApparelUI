import _mock from './_mock';

// ----------------------------------------------------------------------

export const _bannersList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  bannersTitle: _mock.bannersTitle(index),
  branch: _mock.branch(index),
  targetAudience: _mock.targetAudience(index),
  products: _mock.products(index),
  published: '15/06/2022',
  expiring: 'Thu Jul 30 2022 11:36:58 GMT+0200 ',
  scheduled: 'Thu Jul 28 2022 11:36:58 GMT+0200 ',
  lastModified: '30/06/2023',
  title: 'Test banner title',
  chip: 'New course',
  description: 'This is a test banner description',
  files: [
    {id: 123456, preview: 'https://learn.e-wise.nl/files/lesson/ewise/media/2718/image1.jpeg'}
  ],
  buttonTitle: 'Read more',
  buttonLink: 'https://learn.e-wise.nl/to/course/12345',
  manager: _mock.name.fullName(index),
  status: _mock.bannerStatus(index),
  visibility: _mock.visibility(index),
  customCss: ''
}));