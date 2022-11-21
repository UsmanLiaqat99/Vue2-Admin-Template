import axios from 'axios';

export class UsersService {
    async fetchAll() {
        return (await axios.get('/users')).data;
    }

    async fetchOne(id) {
        return (await axios.get('/users/' + id)).data;
    }

    async update(user) {
        return (await axios.patch('/users', user)).data;
    }

    async create(user) {
        return (await axios.post('/users', user)).data;
    }

    async delete(user) {
        return (await axios.delete('/users/' + user.id)).data;
    }
}
