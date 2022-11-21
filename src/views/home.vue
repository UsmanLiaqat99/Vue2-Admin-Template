<template>
  <div>
    <div class="dashboard-cards">
      <stat-card
        title="Card 1"
        :value="games"
        color="secondary"
        :loading="gamesLoading"
        filter
      />
      <stat-card title="Card 2" :value="0" color="purple" :loading="loading" />
      <stat-card title="Card 3" :value="0" color="green" :loading="loading" />
      <stat-card title="Card 4" :value="0" color="pink" :loading="loading" />
    </div>
  </div>
</template>

<script>
import StatCard from '@/components/dashboard/StatCard';
import { DashboardService } from '@/services/dashboard-service';

export default {
  name: 'Home',
  components: { StatCard },
  data: () => ({
    loading: false,
    gamesLoading: false,
    loadingDialog: false,
    dashboardCards: {},
    service: new DashboardService()
  })
};
</script>

<style scoped>
.dashboard-cards {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  margin-bottom: 30px;
}

.dashboard-graphs {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  margin-bottom: 30px;
}

.dashboard-graphs-one {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  margin-bottom: 30px;
}

@media screen and (min-width: 580px) {
  .dashboard-cards {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-graphs {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-graphs-one {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (min-width: 1000px) {
  .dashboard-cards {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .dashboard-graphs {
    grid-template-columns: 1fr 2fr;
  }

  /*.dashboard-graphs-one {*/
  /*  grid-template-columns: 2fr 1fr;*/
  /*}*/
}
</style>
