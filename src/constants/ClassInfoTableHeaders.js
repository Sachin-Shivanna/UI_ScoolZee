export const columns = [
  { id: 'section', label: 'Section', minWidth: 100, align: 'center', style: { fontSize: 'xxx-large', fontWeight: 'lighter' } },
  { id: 'leadInstructor', label: 'Lead Instructor', minWidth: 170, align: 'center' },
  {
    id: 'subject',
    label: 'Subject',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
    style: { lineHeight: 4 }
  },
  {
    id: 'instructor',
    label: 'Instructor',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'sessionsPerWeek',
    label: 'Sessions/week',
    maxWidth: 70,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  {
    id: 'totalStudents',
    label: 'Total Students',
    maxWidth: 70,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  }
];

export const classAudienceHeader = [
  { id: 'class', label: 'Class', minWidth: 170, align: 'center' },
  { id: 'section', label: 'Section', minWidth: 100, align: 'center', style: { fontSize: 'xxx-large', fontWeight: 'lighter' } },
  {
    id: 'leadInstructor',
    label: 'Lead Instructor',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'totalStudents',
    label: 'Total Students',
    maxWidth: 70,
    align: 'center',
    format: (value) => value.toLocaleString('en-US')
  },
  { id: 'includeCaregiver', label: 'Include Caregiver', type: 'boolean', minWidth: 170, align: 'center' },
  { id: 'select', label: 'Select', minWidth: 170,type: 'boolean', align: 'center' },
]