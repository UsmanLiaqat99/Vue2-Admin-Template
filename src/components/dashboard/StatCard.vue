<template>
  <v-card :class="loading ? 'pa-5 text-center white--text  white' : 'pa-5 text-center white--text  ' + color"
          style="position:relative;">
    <div v-if="filter && !loading"
         style="position: absolute; right: 10px; top:10px">
      <v-menu offset-x offset-y left close-on-click :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" color="white">
            mdi-filter
          </v-icon>
        </template>

        <v-card class="pa-3">
          <v-form ref="filterTotalForm">
            <v-select
                v-model="selectedFilter"
                dense
                outlined
                label="Filter"
                :items="filters"
                hide-details
                class="mb-2"
            />
            <v-text-field v-model="startDate" v-if="selectedFilter === 5" label="Start Date" type="date" outlined dense
                          :rules="[required()]"></v-text-field>
            <v-text-field v-model="endDate" v-if="selectedFilter === 5" label="End Date" type="date" outlined dense
                          :rules="[required()]"></v-text-field>
            <v-btn style="width: 100%;" elevation="0" color="primary" @click="applyFilter">Apply</v-btn>
          </v-form>
        </v-card>
      </v-menu>
    </div>
    <v-skeleton-loader
        :loading="loading"
        type="card-heading"
    >
      <h1>{{ value || 0 }}</h1>
      <p>{{ title }}</p>
    </v-skeleton-loader>
  </v-card>
</template>

<script>

import moment from 'moment'
import {required} from "@/utils/validators";

export default {
  name: "StatCard",
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    color: {
      type: String,
      default: 'black'
    },
    loading: {
      type: Boolean
    },
    filter: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      selectedFilter: 0,
      startDate: null,
      endDate: null,
      filters: [
        {
          text: 'All Time',
          value: 0
        },
        {
          text: 'Today',
          value: 1
        },
        {
          text: 'Yesterday',
          value: 2
        },
        {
          text: 'Last 7 Days',
          value: 3
        },
        {
          text: 'Last 28 Days',
          value: 4
        },
        {
          text: 'Custom',
          value: 5
        },
      ]
    }
  },
  methods: {
    required,
    applyFilter() {
      let startDate, endDate, validated = true
      switch (this.selectedFilter) {
        case 1:
          endDate = startDate = moment().format('YYYY-MM-DD');
          break;
        case 2:
          endDate = startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
          break
        case 3:
          endDate = moment().format('YYYY-MM-DD');
          startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
          break
        case 4:
          endDate = moment().format('YYYY-MM-DD');
          startDate = moment().subtract(28, 'days').format('YYYY-MM-DD');
          break
        case 5 :
          if (this.$refs.filterTotalForm.validate()) {
            startDate = this.startDate
            endDate = this.endDate
          } else {
            validated = false
          }
      }
      if (startDate && endDate) {
        const data = {
          from: startDate,
          to: endDate
        }
        this.$emit('applyFilter', data)
      } else if (validated) {
        this.$emit('applyFilter', null)
      }
    },
  }
}
</script>

<style scoped>

</style>
