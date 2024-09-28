import _mock from './_mock';

// ----------------------------------------------------------------------

export const _linkChecker = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  branch: _mock.branch(index),
  targetAudience: _mock.targetAudience(index),
  code: '302',
  error: 'Not Found',
  url: 'https://landviz.nl/status?code=404',
  lesson: 'LC Aan de slag met alimentatierekenen',
  lessonId: 79,
  lastCheck: '15-06-2022',
  status: _mock.linkStatus(index)
}));