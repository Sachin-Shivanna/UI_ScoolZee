export const AccessDefinition = [
    {
        route: '/home',
        routAccess: ['Faculty'],
        createAccess: [],
        editAccess: [],
        deleteAccess: []
    },
    {
        route: '/dashboard',
        routAccess: ['Admin'],
        createAccess: [],
        editAccess: [],
        deleteAccess: []
    },
    {
        route: '/accounts',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/assessments',
        routAccess: ['Admin','Faculty'],
        createAccess: ['Admin','Faculty'],
        editAccess: ['Admin','Faculty'],
        deleteAccess: ['Admin','Faculty']
    },
    {
        route: '/assessments/add-assessment',
        routAccess: ['Admin','Faculty'],
        createAccess: ['Admin','Faculty'],
        editAccess: ['Admin','Faculty'],
        deleteAccess: ['Admin','Faculty']
    },
    {
        route: '/events',
        routAccess: ['Admin','Faculty'],
        createAccess: ['Admin','Faculty'],
        editAccess: ['Admin','Faculty'],
        deleteAccess: ['Admin','Faculty']
    },
    {
        route: '/events/event-detail/:id',
        routAccess: ['Admin','Faculty'],
        createAccess: ['Admin','Faculty'],
        editAccess: ['Admin','Faculty'],
        deleteAccess: ['Admin','Faculty']
    },
    {
        route: '/events/add-event',
        routAccess: ['Admin','Faculty'],
        createAccess: ['Admin','Faculty'],
        editAccess: ['Admin','Faculty'],
        deleteAccess: ['Admin','Faculty']
    },
    {
        route: '/setup',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/setup/billing-details',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/users',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/users/user-details/:id',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/users/add-user',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/setup/add-class',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/setup/add-fee',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/setup/fee-details',
        routAccess: ['Admin'],
        createAccess: ['Admin'],
        editAccess: ['Admin'],
        deleteAccess: ['Admin']
    },
    {
        route: '/section/search',
        routAccess: ['Admin','Faculty'],
        createAccess: [],
        editAccess: [],
        deleteAccess: []
    },
    {
        route: '/classes',
        routAccess: ['Faculty'],
        createAccess: [],
        editAccess: [],
        deleteAccess: []
    },

]