export const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'profile', label: 'Profile', minWidth: 100 },
    {
      id: 'email',
      label: 'Email',
      minWidth: 170,
      align: 'center',
      format: (value) => value?.toLocaleString('en-US'),
    },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 170,
      align: 'center',
      format: (value) => value?.toLocaleString('en-US'),
    },
    {
      id: 'status',
      label: 'Active',
      minWidth: 170,
      align: 'center',
      format: (value) => value?.toFixed(2),
    },
    {
      id: 'reset',
      label: 'Reset Password',
      minWidth: 170,
      align: 'center',
      format: (value) => value?.toFixed(2),
    },
  ];