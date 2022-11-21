<template>
  <div>
    <v-app-bar app dark color="primary" elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"/>

      <v-card-title>Template 1</v-card-title>
      <v-spacer/>

      <profile-popup/>
    </v-app-bar>
    <v-main class="main-bg">
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="drawer" app>
      <img src="../assets/logo.png" alt="logo" class="logo" height="70"/>
      <v-divider/>
      <template v-for="(route, key) in routes">
        <v-list-item
            v-if="route.isVisible"
            :key="key"
            class="route"
            color="#da57a7"
            active-class="route--active"
            exact
            dense
            :to="route.to"
        >
          <v-list-item-icon>
            <v-icon v-text="route.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="route.title"/>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-else-if="route.isDivider" :key="key" style="margin: 10px 20px"/>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import ProfilePopup from "./ProfilePopup";
import {getUser} from "@/utils/local";
import {required} from "@/utils/validators";

export default {
  name: 'Dashboard',
  components: {ProfilePopup},
  data: () => ({
    drawer: true,
    user: {},
    developMode: false,
    developModeDialog: false,
    message: null,
    developModeData: null,
    loading: false,
  }),
  methods: {
    getUser,
    required,
  },
  computed: {
    routes() {
      return [
        {
          to: '/',
          title: 'Dashboard',
          icon: 'mdi-view-dashboard-variant',
          isVisible: true
        },
        {isDivider: true},
        {
          to: '/notifications',
          title: 'Notifications',
          icon: 'mdi-bell',
          isVisible: true
        },
        {isDivider: true},
        {
          to: '/users',
          title: 'Users',
          icon: 'mdi-account-group',
          isVisible: true
        },
      ];
    }
  }
};
</script>

<style lang="sass" scoped>
.logo
  display: block
  margin: 5px auto
  border-radius: 10px

.route
  margin: 5px
  text-align: left
  overflow: hidden
  border-radius: 4px
  font-size: 20px !important
  font-family: "Roboto", sans-serif

  i
    font-size: 20px

  &--active i
    color: inherit

  &--active
    color: #495db7

.main-bg
  background: linear-gradient(to bottom, #1976d2 300px, white 300px)
</style>
