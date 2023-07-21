<script setup>
import axios from 'axios';
import { useI18n } from 'vue-i18n';

import { computed, ref, watch } from 'vue';
import { useGeolocation } from '../hooks/useGeoLocation';

import Forecast from '../components/forecast.vue';

import Header from '../components/header.vue';
import Chart from '../components/chart.vue';

const data = ref(null);
const day = ref(6);

const { t, locale } = useI18n();

const { kordinat } = useGeolocation();
const posisiUser = computed(() => ({
  lat: kordinat.value.latitude,
  lng: kordinat.value.longitude,
}));

watch([posisiUser, day, locale], (newValue) => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${newValue[0].lat}&lon=${newValue[0].lng}&units=metric&appid=406e0d43f1258f2c143ee80e19276799&cnt=${newValue[1]}&lang=${locale.value}`,
    )
    .then((response) => {
      data.value = response.data;
    });
});
</script>

<template>
  <Header v-bind:name="data?.city.name" />
  <div class="container">
    <div class="link">
      <router-link to="/favorite">{{ t('message.favorite') }}</router-link>
    </div>
  </div>
  <div v-if="!data">
    <div class="container">{{ t('message.loading') }}</div>
  </div>
  <div v-else>
    <Forecast v-model:data="data.list" v-model:day="day" />
    <div class="container">
      <Chart v-model:data="data.list" />
    </div>
  </div>
</template>

<style>
.link {
  padding: 5px;
  margin-bottom: 25px;
}
.link a {
  color: #fff;
}
</style>
