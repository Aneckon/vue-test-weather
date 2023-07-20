<template>
  <canvas id="myChart" />
</template>

<script>
import Chart from 'chart.js/auto';

import { useI18n } from 'vue-i18n';

export default {
  name: 'Chart',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    const ctx = document.getElementById('myChart');

    const { t } = useI18n();

    const temperatureName = t('message.temperature');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels:
          this.data.length > 0
            ? this.data.map((row) => `${new Date(row.dt * 1000).getUTCHours()}:00`)
            : '',
        datasets: [
          {
            label: temperatureName,
            data: this.data.length > 0 ? this.data.map((row) => row.main.temp) : '',
            borderColor: 'rgb(255,255, 255)',
            backgroundColor: 'rgb(255,255, 255)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    myChart;
  },
};
</script>

<style>
#myChart {
  margin-bottom: 50px;
}
</style>
