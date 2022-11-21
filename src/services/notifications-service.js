import axios from 'axios';

export class NotificationsService {
  async fetchAll() {
    return (await axios.get('/notifications')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/notifications/' + id)).data;
  }

  async create(notification) {
    return (await axios.post('/notifications', notification)).data;
  }
  async test(notification) {
    return (await axios.post('/notifications/test', notification)).data;
  }

  async send(notification) {
    return (await axios.post('/notifications/send', notification)).data;
  }

  async delete(notification) {
    return (await axios.delete('/notifications/' + notification.id)).data;
  }

  async update(notification) {
    return (await axios.patch('/notifications', notification)).data;
  }
}
