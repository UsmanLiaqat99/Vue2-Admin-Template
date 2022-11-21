<template>
  <SimpleForm :onSubmit="submit" @done="$router.back()">
    <p class="span-2 form__title">{{ isEdit ? 'Update Notification' : 'Create New Notification' }}</p>

    <div
        style="
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-column-gap: 20px;
      "
        class="span-2"
    >
      <v-text-field
          v-model="notification.title"
          dense
          :rules="[required('A title must be provided')]"
          label="Notification Title"
          outlined
      />
      <v-select
          v-model="notification.channel"
          dense
          outlined
          :rules="[required('A channel must be selected')]"
          label="Select Channel"
          :items="channels"
      />
    </div>
    <v-select
        v-model="notification.target"
        outlined
        dense
        label="Target Page"
        :items="targetPages"
        item-text="label"
        class="span-2"
    >
    </v-select>
    <v-text-field
        v-if="notification.target === 10"
        v-model="notification.link"
        dense
        outlined
        label="Action Link"
        :rules="[required()]"
        class="span-2"
    />
    <v-textarea
        v-model="notification.description"
        label="Description"
        dense
        :rules="[required('A Description must be provided')]"
        outlined
        persistent-hint
        class="span-2"
    />

    <p class="span-2">Select Platforms</p>
    <div class="span-2">
      <v-checkbox
          v-model="notification.isForAndroid"
          dense
          label="For Android"
          hide-details
      />
      <v-checkbox
          v-model="notification.isForIOS"
          dense
          label="For iOS"
          hide-details
      />
    </div>

    <div v-if="notification.schedule && notification.schedule.days && notification.schedule.time" class="span-2">
      <p class="my-3">Notification Schedule</p>
      <p class="text-subtitle-1"><span v-for="(day,i) of notification.schedule.days" :key="i">{{ getDays(day) }} <span
          v-if="i < notification.schedule.days.length - 1">, </span> </span></p>
      <p class="text-subtitle-1">{{ formatTime(notification.schedule.time) }}</p>
    </div>

    <template #actions="{ context }">
      <v-btn class="mr-3" @click="openTestNotificationDialog(context)" text>Test</v-btn>
      <v-btn class="mr-3" @click="openScheduleDialog(context)" elevation="0">Schedule</v-btn>
      <v-btn class="mr-3" @click="sendNotification(context)" outlined>Send Only</v-btn>
      <v-btn
          @click="sendAndSaveNotification(context)"
          outlined
          class="mr-3"
          color="primary"
      >Send And Save
      </v-btn>
    </template>

    <loading-dialog v-model="loading" message="Fetching Notification Data"/>
    <v-dialog persistent width="40%" v-model="openSchedule">
      <v-card class="pa-3">
        <v-form ref="schedule">
          <h2>Test Notification</h2>
          <ul style="color: red" v-for="(error) of errors" :key="error">
            <li>{{ error }}</li>
          </ul>
          <v-card-title>Select Weekdays</v-card-title>
          <v-btn-toggle
              v-model="schedule.days"
              multiple
              mandatory
              class="d-flex justify-center"
          >
            <v-btn>S</v-btn>
            <v-btn>M</v-btn>
            <v-btn>T</v-btn>
            <v-btn>W</v-btn>
            <v-btn>T</v-btn>
            <v-btn>F</v-btn>
            <v-btn>S</v-btn>
          </v-btn-toggle>
          <v-card-title>Select Time</v-card-title>
          <v-time-picker :rules="[required()]" v-model="schedule.time" landscape format="ampm" scrollable elevation="0"
                         ampm-in-title full-width
                         class="rounded-0 text--black"/>
          <div class="text-right pa-3">
            <v-btn @click="cancelSchedule" class="mr-3">Cancel</v-btn>
            <v-btn @click="submitSchedule" color="primary">Submit</v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog width="30%" v-model="openTestDialog" persistent>
      <v-card class="pa-3">
        <v-form ref="testNotification">
          <v-card-title>Test Notification</v-card-title>
          <ul class="mb-3" style="color: red" v-for="(error) of errors" :key="error">
            <li>{{ error }}</li>
          </ul>
          <v-combobox
              v-model="testNotification.emails"
              multiple
              label="Enter User Emails"
              prepend-inner-icon="mdi-mail"
              append-icon=""
              chips
              small-chips
              :rules="[required('A title must be provided')]"
              deletable-chips
              outlined
              dense
              class="tag-input"
              :search-input.sync="searchEmail"
          />
          <div class="text-right pa-3">
            <v-btn @click="cancelTest" class="mr-3">Cancel</v-btn>
            <v-btn @click="submitTest" color="primary">Submit</v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import LoadingDialog from '../../components/LoadingDialog';
import {NotificationsService} from '@/services/notifications-service';
import {required} from '@/utils/validators';
import {getDays} from "@/utils/local";
import moment from "moment"

export default {
  name: 'Form',
  components: {LoadingDialog, SimpleForm},

  data: () => ({
    isEdit: false,
    loading: false,
    service: new NotificationsService(),
    notification: {
      isForIOS: false,
      isForAndroid: false
    },
    channels: ['news', 'premium', 'non-premium'],

    openTestDialog: false,
    searchEmail: '',
    testNotification: {},
    testContext: null,

    openSchedule: false,
    schedule: {
      days: []
    },
    errors: [],

    targetPages: [
      {
        label: 'Friends',
        value: 1
      },
      {
        label: 'Matches',
        value: 2
      },
      {
        label: 'Multiplayer Menu',
        value: 3
      },
      {
        label: 'Single Player Menu',
        value: 4
      },
      {
        label: 'My Stats',
        value: 5
      },
      {
        label: 'Endless Menu',
        value: 6
      },
      {
        label: 'Home Page',
        value: 7
      },
      {
        label: 'Adaptive bank Menu',
        value: 8
      },
      {
        label: 'Review Mode Menu',
        value: 9
      },
      {
        label: 'Open Link',
        value: 10
      }
    ],
  }),

  mounted() {
    this.loadNotification();
  },

  methods: {
    required,
    getDays,
    async loadNotification() {
      if (!this.$route.query.id) return;
      this.isEdit = true;
      this.loading = true;
      this.notification = await this.service.fetchOne(this.$route.query.id);
      this.loading = false;
    },
    preCheck(context, flag = true) {
      if (!context.validate()) return false;
      if (flag) {
        if (!this.notification.isForAndroid && !this.notification.isForIOS) {
          context.reportError({
            title: 'Invalid Notification Data',
            description:
                'Select platform for notification i.e. Android or iOS or both'
          });

          return false;
        }
      }

      return true;
    },
    async submit(context) {
      if (this.preCheck(context)) {
        if (this.isEdit) {
          context.changeLoadingMessage('Updating Notification');
          try {
            await this.service.update(this.notification);
            return true
          } catch (e) {
            context.reportError({
              title: 'Error occurred while updating Notification',
              description: e.toString()
            });
            return false
          }
        } else {
          try {
            context.changeLoadingMessage('Creating A New Notification');
            await this.service.create(this.notification);
            return true
          } catch (e) {
            context.reportError({
              title: 'Error occurred while creating Notification',
              description: e.toString()
            });
            return false
          }
        }
      }
    },
    openScheduleDialog() {
      this.openSchedule = true
      if (this.notification.schedule) {
        this.schedule = {...this.notification.schedule}
      }
    },
    openTestNotificationDialog(context) {
      if (this.preCheck(context, false)) {
        this.openTestDialog = true
        this.testNotification = {}
        this.testContext = context
      }
    },

    async sendNotification(context) {
      if (this.preCheck(context)) {
        context.changeLoadingStatus(true);
        context.changeLoadingMessage('Sending Notification to Devices');
        await this.service.send(this.notification);
        context.changeLoadingStatus(false);
      }
    },
    async sendAndSaveNotification(context) {
      if (this.preCheck(context)) {
        context.changeLoadingStatus(true);
        await this.submit(context);
        await this.sendNotification(context)

        this.$router.back()
      }
    },
    cancelSchedule() {
      this.openSchedule = false
    },
    cancelTest() {
      this.openTestDialog = false
    },
    submitSchedule() {
      this.errors = []
      if (this.schedule.time) {
        this.schedule.days.sort()
        this.notification.schedule = {...this.schedule}
        this.openSchedule = false
      } else {
        this.errors.push("Time is required")
      }
    },
    async submitTest() {
      if (this.preCheck(this.testContext, false)) {
        this.errors = []
        this.testContext.changeLoadingStatus(true);
        this.testContext.changeLoadingMessage('Sending Test Notification');
        if (!this.testNotification.emails) {
          this.errors.push("At least one email is required")
          this.testContext.changeLoadingStatus(false);
          return
        }
        this.testNotification.emails.forEach((email) => {
          if (!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.errors.push(email + " is invalid.")
          }
        })
        if (this.errors.length > 0) {
          this.testContext.changeLoadingStatus(false);
          return
        }

        const data = {...this.notification}

        data.emails = this.testNotification.emails
        console.log(data)
        try {
          await this.service.test(data)
          this.openTestDialog = false
        } catch (e) {
          this.testContext.reportError({
            title: 'Error occurred while sending test Notification',
            description: e?.response?.data?.message.toString() || 'Some Error Occured'
          });
          this.testContext.changeLoadingStatus(false);
        }
        this.testContext.changeLoadingStatus(false);
      }
    },
    formatTime(time) {
      return moment(time, "HH:mm").format("h:mm A")
    }
  }
};
</script>

<style scoped>
p {
  font-weight: bold;
  text-align: left;
}
</style>
