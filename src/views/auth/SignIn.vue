<template>
  <div id="background">
    <v-card class="sign-in" elevation="10">
      <img src="../../assets/logo.png" alt="Logo" class="sign-in__logo"/>

      <h1 class="sign-in__title">Authenticate yourself</h1>
      <p class="sign-in__message">
        You need an admin account to access the content ahead, if you do not
        have an account or have forgotten your password then you can contact the
        support regarding your issue
      </p>
      <v-form ref="form">
        <v-text-field
            v-model="username"
            label="Your Email"
            outlined
            :rules="[required(), email()]"
        />
        <v-text-field
            v-model="password"
            :rules="[required('Do not leave this field empty')]"
            @keypress.enter="signIn"
            label="Your Password"
            type="password"
            outlined
        />

        <v-btn
            @click="signIn"
            color="primary"
            dark
            elevation="0"
            width="100%"
            height="45px"
        >
          Authenticate
          <v-icon small style="margin-left: 5px">mdi-arrow-right</v-icon>
        </v-btn>
      </v-form>
    </v-card>
    <loading-dialog v-model="loading" message="You are being authenticated, Please wait..."/>
    <error-dialog v-model="error" :error="errorVal"/>
  </div>
</template>

<script>
import {required, email} from '@/utils/validators';
import LoadingDialog from '../../components/LoadingDialog';
import ErrorDialog from '../../components/ErrorDialog';

export default {
  name: 'SignIn',
  components: {ErrorDialog, LoadingDialog},

  data: () => ({
    error: false,
    errorVal: {},
    loading: false,
    username: '',
    password: ''
  }),

  methods: {
    email,
    required,
    async signIn() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          const token = (
              await this.$axios.post('/auth/login', {
                username: this.username,
                password: this.password
              })
          ).data;
          const user = (await this.$axios.get('/auth/user', {
            headers: {authorization: 'bearer ' + token.token}
          })).data;
          localStorage.setItem('auth_token', token.token)
          localStorage.setItem('auth_user', JSON.stringify(user))
          await this.$router.push('/').then(() => this.$router.go())
        } catch (e) {
          this.error = true;
          this.errorVal = {
            title: 'Error while signing in',
            description: 'Email or Password incorrect!'
          };
          this.loading = false;
        }

        this.loading = false;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.sign-in
  width: 448px
  padding: 20px 40px 40px 40px
  background: white
  text-align: center
  border-radius: 8px

  &__header
    display: grid
    grid-column-gap: 20px
    grid-template-columns: calc(30% - 20px) 70%

  &__logo
    width: 30%
    margin-bottom: 20px

  &__title
    color: black
    font-size: 24px
    margin-bottom: 10px
    font-weight: normal
    font-family: google-sans, sans-serif

  &__message
    font-size: 13px
    margin-bottom: 40px


#background
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background: #00f3ff

</style>

<style>
html {
  overflow-y: auto;
}
</style>
