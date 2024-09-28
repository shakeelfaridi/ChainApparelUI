import _mock from './_mock';

// ----------------------------------------------------------------------

export const _trialsList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  name: 'Batch ' + (index + 1),
  branch: _mock.branch(index),
  product: 'Alliance healthcare',
  variant: 'ABCDEF',
  total: 10,
  used: 5,
  unused: 5,
  created: '15-06-2022',
  expiration: '15-06-2023',
  manager: _mock.name.fullName(index),
  type: _mock.trialTypes(index)
}));