<template>
  <SimpleForm :onSubmit="submit" @done="$router.back()">
    <p class="span-2 form__title">{{ isEdit ? 'Update User' : 'Create New User' }}</p>

    <v-text-field
        v-model="user.displayName"
        label="Display Name"
        :rules="[required('A display name must be provided')]"
        outlined
        class="span-2"
    />
    <v-text-field
        v-model="user.username"
        label="Username or Email"
        dense
        :rules="[required('Username must be provided')]"
        outlined
        persistent-hint
        hint="Must be a unique email or name"
        class="span-2"
    />
    <v-text-field
        v-model="user.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        dense
        outlined
    />
    <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        :rules="[(v) => (v && v === user.password) || 'Passwords does not match']"
        :type="showPassword ? 'text' : 'password'"
        dense
        outlined
    />
    <v-checkbox
        v-model="showPassword"
        label="Show Password"
        style="margin-top: -15px"
    />

    <p class="span-2">Select User Scopes</p>

    <v-treeview
        v-model="user.scopes"
        :items="items"
        selectable
        style="text-align: left"
        class="span-2"
    />

    <loading-dialog v-model="loading" message="Fetching User Data"/>
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import {UsersService} from '@/services/users-service';
import LoadingDialog from '../../components/LoadingDialog';
import {required} from '@/utils/validators';

export default {
  name: 'Form',
  components: {LoadingDialog, SimpleForm},

  data: () => ({
    isEdit: false,
    loading: false,
    showPassword: false,
    service: new UsersService(),
    confirmPassword: '',
    user: {
      scopes: []
    },

    items: [
      {
        id: 'events',
        name: 'Events',
        children: [
          {id: 'events:new', name: 'Create Events'},
          {id: 'events:view', name: 'View Events'},
          {id: 'events:edit', name: 'Edit Events'},
          {id: 'events:delete', name: 'Delete Events'}
        ]
      },
      {
        id: 'notifications',
        name: 'Notifications',
        children: [
          {id: 'notifications:new', name: 'Create Notifications'},
          {id: 'notifications:view', name: 'View Notifications'},
          {id: 'notifications:edit', name: 'Edit Notifications'},
          {id: 'notifications:delete', name: 'Delete Notifications'}
        ]
      },
      {
        id: 'popups',
        name: 'Popups',
        children: [
          {id: 'popups:new', name: 'Create Popups'},
          {id: 'popups:view', name: 'View Popups'},
          {id: 'popups:edit', name: 'Edit Popups'},
          {id: 'popups:delete', name: 'Delete Popups'}
        ]
      },
      {
        id: 'banners',
        name: 'Banners',
        children: [
          {id: 'banners:new', name: 'Create Banners'},
          {id: 'banners:view', name: 'View Banners'},
          {id: 'banners:delete', name: 'Delete Banners'}
        ]
      },
      {
        id: 'iaps',
        name: 'In App Purchases',
        children: [
          {id: 'iaps:view', name: 'View In App Purchases'},
          {id: 'iaps:edit', name: 'Edit In App Purchases'},
          {id: 'iaps-offers:view', name: 'View In App Purchases Offers'},
          {id: 'iaps-offers:new', name: 'Create In App Purchases Offers'},
          {id: 'iaps-offers:edit', name: 'Edit In App Purchases Offers'},
          {id: 'iaps-offers:delete', name: 'Delete In App Purchases Offers'},
        ]
      },
      {
        id: 'institutions',
        name: 'Institutions',
        children: [
          {id: 'institutions:new', name: 'Create Institutions'},
          {id: 'institutions:view', name: 'View Institutions'},
          {id: 'institutions:edit', name: 'Edit Institutions'},
          {id: 'institutions:delete', name: 'Delete Institutions'}
        ]
      },
      {
        id: 'questions',
        name: 'Questions',
        children: [
          {id: 'questions:new', name: 'Create Questions'},
          {id: 'questions:view', name: 'View Questions'},
          {id: 'questions:edit', name: 'Edit Questions'},
          {id: 'questions:delete', name: 'Delete Questions'}
        ]
      },
      {
        id: 'comments',
        name: 'Comments',
        children: [
          {id: 'comments:view', name: 'View Comments'},
          {id: 'comments:edit', name: 'Edit Comments'},
          {id: 'comments:delete', name: 'Delete Comments'}
        ]
      },
      {
        id: 'user-contributions',
        name: 'User Contributions',
        children: [
          {id: 'user-contributions:view', name: 'View User Contributions'},
          {id: 'user-contributions:edit', name: 'Edit, Approve and Reject User Contributions'},
        ]
      },
      {
        id: 'question-media',
        name: 'Question Media',
        children: [
          {id: 'question-media:view', name: 'View Question Media'},
          {id: 'question-media:new', name: 'Create Question Media'},
          {id: 'question-media:edit', name: 'Edit Question Media'},
        ]
      },
      {
        id: 'flagged-questions',
        name: 'Flagged Questions',
        children: [
          {id: 'flagged-questions:view', name: 'View Flagged Questions'},
          {id: 'flagged-questions:edit', name: 'Edit Flagged Questions'},
          {id: 'flagged-questions:delete', name: 'Delete Flagged Questions'}
        ]
      },
      {
        id: 'passage-questions',
        name: 'Passage Questions',
        children: [
          {id: 'passage-questions:view', name: 'View Passage Questions'},
          {id: 'passage-questions:new', name: 'Create Passage Questions'},
          {id: 'passage-questions:edit', name: 'Edit Passage Questions'},
          {id: 'passage-questions:delete', name: 'Delete Passage Questions'}
        ]
      },
      {
        id: 'categories',
        name: 'Categories',
        children: [
          {id: 'categories:new', name: 'Create  Categories'},
          {id: 'categories:view', name: 'View  Categories'},
          {id: 'categories:edit', name: 'Edit  Categories'},
          {id: 'categories:delete', name: 'Delete  Categories'}
        ]
      },
      {
        id: 'sub-categories',
        name: 'Sub-Categories',
        children: [
          {id: 'sub-categories:new', name: 'Create Sub-Categories'},
          {id: 'sub-categories:view', name: 'View Sub-Categories'},
          {id: 'sub-categories:edit', name: 'Edit Sub-Categories'},
          {id: 'sub-categories:delete', name: 'Delete Sub-Categories'}
        ]
      },
      {
        id: 'decks',
        name: 'Decks',
        children: [
          {id: 'decks:new', name: 'Create  Decks'},
          {id: 'decks:view', name: 'View  Decks'},
          {id: 'decks:edit', name: 'Edit  Decks'},
          {id: 'decks:delete', name: 'Delete  Decks'}
        ]
      },
      {
        id: 'flashcards',
        name: 'Flashcards',
        children: [
          {id: 'flashcards:new', name: 'Create Flashcards'},
          {id: 'flashcards:view', name: 'View Flashcards'},
          {id: 'flashcards:edit', name: 'Edit Flashcards'},
          {id: 'flashcards:delete', name: 'Delete Flashcards'}
        ]
      },
      {
        id: 'users',
        name: 'Users',
        children: [
          {id: 'users:new', name: 'Create  Users'},
          {id: 'users:view', name: 'View  Users'},
          {id: 'users:edit', name: 'Edit  Users'},
          {id: 'users:delete', name: 'Delete  Users'}
        ]
      },
      {
        id: 'account-deletion',
        name: 'Account Deletion Requests',
        children: [
          {id: 'account-deletion:view', name: 'View Account Deletion Requests'},
        ]
      },
      {
        id: 'reviews',
        name: 'Reviews',
        children: [
          {id: 'reviews:view', name: 'View  Reviews'},
        ]
      },
      {
        id: 'customers',
        name: 'Customers',
        children: [
          {id: 'customers:view', name: 'View Customers'},
          {id: 'customers:export', name: 'Export Customers'},
        ]
      },
    ]
  }),

  mounted() {
    this.loadUser();
  },

  methods: {
    required,
    async loadUser() {
      if (!this.$route.query.id) return;
      this.isEdit = true;
      this.loading = true;
      this.user = await this.service.fetchOne(this.$route.query.id);
      this.confirmPassword = this.user.password
      this.loading = false;
    },
    async submit(context) {
      if (this.isEdit) {
        context.changeLoadingMessage('Updating User');
        try {
          await this.service.update(this.user);
          return true
        } catch (e) {
          context.reportError({
            'title': 'Error while creating User',
            'description': e.response.data.error
          })

          return false
        }
      } else {
        context.changeLoadingMessage('Creating A New User');
        try {
          await this.service.create(this.user);
          return true
        } catch (e) {
          context.reportError({
            'title': 'Error while creating User',
            'description': e.response.data.error
          })

          return false
        }
      }
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
