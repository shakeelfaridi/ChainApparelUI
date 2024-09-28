import _mock from './_mock';

export const _mediaList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  filename: 'Batch ' + (index + 1),
  location: 'Alliance healthcare',
}));