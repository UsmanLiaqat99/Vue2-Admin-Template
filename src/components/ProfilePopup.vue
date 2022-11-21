<template>
  <v-menu offset-x>
    <template v-slot:activator="{ on, attrs }">
      <v-card class="profile-view" elevation="5" v-bind="attrs" v-on="on">
        <div class="profile-view__letter">{{ resolveLetter() }}</div>
      </v-card>
    </template>

    <v-card class="profile-view__popup">
      <div class="profile-view__image">
        <div class="profile-view__letter">{{ resolveLetter() }}</div>
      </div>

      <v-spacer/>
      <p id="display-name">{{ this.user.displayName || 'Name' }}</p>
      <p id="username">{{ this.user.username || 'Email' }}</p>

      <v-spacer/>
      <v-divider style="margin: 0"/>

      <div class="profile-view__popup__actions">
        <!--        <v-btn elevation="0" outlined color="primary">Edit</v-btn>-->
        <v-spacer/>
        <v-btn elevation="0" color="black" dark @click="logout">Logout</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'ProfilePopup',

  data: () => ({
    user: {}
  }),

  mounted() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.user = JSON.parse(localStorage.getItem('auth_user'));
    }
  },

  methods: {
    resolveLetter() {
      if (this.user && this.user.displayName) {
        return this.user.displayName[0]
      } else {
        return '_'
      }
    },
    logout() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')

      this.$router.push('/auth/sign-in')
    }
  }
};
</script>

<style lang="sass" scoped>
.profile-view
  width: 45px
  height: 45px
  display: flex
  align-items: center
  background: #f5c187
  justify-content: center

  &__letter
    font-size: 25px
    color: rgba(black, .7)
    font-family: google-sans, sans-serif

  &__image
    width: 80px
    height: 80px
    background: #f5c187
    margin: 0 auto
    border-radius: 40px !important
    display: flex
    justify-content: center
    align-items: center

  &__popup
    width: 290px
    height: 220px
    padding: 15px
    display: flex
    text-align: center
    flex-direction: column

    &__actions
      margin-top: 10px
      display: flex

#display-name
  margin: 0
  font-size: 16px
  font-weight: bold

#username
  margin: 0
</style>
