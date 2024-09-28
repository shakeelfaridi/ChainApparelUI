import _mock from './_mock';

// ----------------------------------------------------------------------

export const _lmsList = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  branch: _mock.lmsBranch(index),
  targetAudience: _mock.targetAudience(index),
  managers: _mock.lmsManagers(index),
  lmsLocations: _mock.lmsLocations(index),
}));