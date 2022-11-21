<template>
  <div>
    <data-table
      :loader="loadData"
      :headers="headers"
      title="Notifications"
      :allow-add="getUser() ? getUser().scopes.includes('notifications:new') : false"
      @add-new="addNew"
      @done="$router.back()"
      :delete-handler="getUser() ? getUser().scopes.includes('notifications:delete') ? service.delete : null : null"
      :edit-handler="getUser() ? getUser().scopes.includes('notifications:edit') ? edit : null : null"
    >
      <template #extra-actions="{ item }">
        <v-icon small color="primary" @click="sendNotification(item)">mdi-send</v-icon>
      </template>
      <template #channel="{ item }">
        <span class="chip">{{ item.channel }}</span>
      </template>
      <template #isForIOS="{ item }">
        <v-checkbox hide-details dense v-model="item.isForIOS" readonly/>
      </template>
      <template #isForAndroid="{ item }">
        <v-checkbox hide-details dense v-model="item.isForAndroid" readonly/>
      </template>
    </data-table>

    <loading-dialog v-model="loadingDialog" message="Sending Notification"/>
  </div>
</template>

<script>
import DataTable from '../../components/DataTable';
import {NotificationsService} from '@/services/notifications-service';
import LoadingDialog from "../../components/LoadingDialog";
import { getUser } from '@/utils/local';


export default {
  components: {LoadingDialog, DataTable},

  data: () => ({
    loading: false,
    loadingDialog: false,
    service: new NotificationsService(),

    headers: [
      {
        text: 'Notification Title',
        value: 'title',
        sortable: false
      },
      {
        text: 'Description',
        value: 'description',
        sortable: false
      },
      {
        text: 'Channel',
        value: 'channel'
      },
      {
        width: 100,
        text: 'For iOS',
        value: 'isForIOS'
      },
      {
        width: 120,
        text: 'For Android',
        value: 'isForAndroid'
      }
    ]
  }),

  methods: {
    getUser,
    edit(item) {
      this.$router.push(`/notification?id=${item.id}`);
    },
    addNew() {
      this.$router.push('/notification');
    },
    loadData() {
      return this.service.fetchAll();
    },
    async sendNotification(item) {
      this.loadingDialog = true
      await this.service.send(item);
      this.loadingDialog = false
    }
  }
};
</script>

<style lang="sass" scoped>
.chip
  font-weight: 500
  padding: 5px 10px
  border-radius: 50px
  background: lightgray
</style>
