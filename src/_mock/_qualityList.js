import { randomNumber } from './funcs';
import _mock from './_mock';

// ----------------------------------------------------------------------

export const _qualityList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  course: _mock.course(index),
  branch: _mock.branch(index),
  targetAudience: _mock.targetAudience(index),
  startDate: '15/06/2022',
  endDate: '15/06/2023',
  completed: randomNumber(10),
  completedpm: randomNumber(10),
  quality: _mock.quality(index),
  status: _mock.linkStatus(index),
  tableData1:[
    {id: 1, label: 'uitstekend', value: 3},
    {id: 2, label: 'goed', value: 21},
    {id: 3, label: 'voldoende', value: 6},
  ],
  tableData2:[
    {id: 1, label: 'uitstekend', value: 3},
    {id: 2, label: 'goed', value: 21},
    {id: 3, label: 'voldoende', value: 6},
  ],
  tableData3:[
    {id: 1, label: '8 uur of meer', value: 1},
    {id: 2, label: '3,5 uur', value: 6},
    {id: 3, label: '3 uur', value: 3},
    {id: 4, label: '2,5 uur', value: 3},
    {id: 5, label: '2 uur', value: 2},
  ],
  tableData4:[
    {id: 1, label: 10, value: 2},
    {id: 2, label: 9, value: 6},
    {id: 3, label: 8, value: 12},
    {id: 4, label: 7, value: 2},
    {id: 5, label: 6, value: 1},
  ],
  tableData5:[
    {id: 1, percentage: 60, question: 'Vraag 7 (scoringsvraag)', widget: 'eindtoets_07'},
    {id: 1, percentage: 57, question: 'Vraag 6 (scoringsvraag)', widget: 'eindtoets_06'},
    {id: 1, percentage: 40, question: 'Vraag 5 (scoringsvraag)', widget: 'eindtoets_05'},
  ],
  tableData6:[
    {id: 1, notes: 'Meer tips over aanpak praktijksituaties zijn zeker welkom.', grade: 7, user: [{id: 'amiah-pruitt', email: 'olen_legros@gmail.com', firstname: 'Olen', lastname: 'Legros'}], date: '01-03-2022'},
  ]
}));