import UserForm from './UserForm';
import UsersView from './UsersView';

export const usersRoutes = [
    {
        name: 'Users',
        path: '/users',
        component: UsersView
    },
    {
        name: 'NewUser',
        path: '/user',
        component: UserForm
    },
];

export const usersRouter = usersRoutes.filter(function (x) {
    return x !== null;
})

