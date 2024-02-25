export const studentsColumns = [
    { id: 'name', label: 'Name', minWidth: 100,align: 'center' },
    { id: 'phone', label: 'Phone', minWidth: 170,align: 'center' },
    {
      id: 'active',
      label: 'Active',
      minWidth: 70,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    }
  ];