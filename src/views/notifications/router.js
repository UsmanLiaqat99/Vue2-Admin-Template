import NotificationsView from './NotificationsView';
import NotificationForm from './NotificationForm';

const notificationsRoutes = [
  {
    name: 'Notifications',
    path: '/notifications',
    component: NotificationsView
  },
  {
    name: 'NewNotification',
    path: '/notification',
    component: NotificationForm
  }
];

export const notificationsRouter = notificationsRoutes.filter(function(x) {
  return x !== null;
})
