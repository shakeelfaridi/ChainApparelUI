import _mock from './_mock';

// ----------------------------------------------------------------------

export const _trialsView = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  code: randomCode(6),
  activated: _mock.trialsActivated(index),
  emailVerified: 1,
  students: _mock.trialsStudents(index),
  company: _mock.company(index),
  courses: _mock.trialsCourses(index)
}));

function randomCode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
   }
   return result;
}