<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Users"
    :allow-add="getUser() ? getUser().scopes.includes('users:new') : false"
    @add-new="addNew"
    @done="$router.back()"
    :delete-handler="getUser() ? getUser().scopes.includes('users:delete') ?  service.delete : null : null"
    :edit-handler="getUser() ? getUser().scopes.includes('users:edit') ? edit : null : null"
  >
    <template #createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>

    <template #scopes="{ item }">
      {{ item.scopes.join(', ').substr(0, 80) + '...' }}
    </template>
  </data-table>
</template>

<script>
import dayjs from 'dayjs';
import { UsersService } from '@/services/users-service';
import DataTable from '../../components/DataTable';
import {getUser} from '@/utils/local';


export default {
  components: { DataTable },

  mounted() {},

  data: () => ({
    items: [],
    loading: false,
    service: new UsersService(),

    headers: [
      {
        text: 'Display Name',
        value: 'displayName',
        sortable: false,
        width: 150
      },
      {
        text: 'Email',
        value: 'username',
        sortable: false,
        width: 200
      },
      {
        text: 'Scopes',
        value: 'scopes',
        sortable: false
      },
      {
        width: 180,
        text: 'Created At',
        value: 'createdAt'
      }
    ]
  }),

  methods: {
    getUser,
    formatDate(date) {
      return dayjs(date).format('D MMM YYYY - hh:mm a');
    },

    addNew() {
      this.$router.push('/user');
    },
    edit(item) {
      this.$router.push(`/user?id=${item.id}`);
    },
    loadData() {
      return this.service.fetchAll();
    }
  }
};
</script>

<style scoped></style>
