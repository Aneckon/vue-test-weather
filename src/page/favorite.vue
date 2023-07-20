<script setup>
import axios from 'axios';
import moment from 'moment';
import { useI18n } from 'vue-i18n';

const hoursName = (date) => {
  const getFullName = moment(date).format('LT');
  return getFullName;
};

import { computed, ref, watch } from 'vue';
import { useGeolocation } from '../hooks/useGeoLocation';

import Header from '../components/header.vue';
import Modal from '../components/modal.vue';

const data = ref(null);
const dropdownShow = ref(false);
const dropdownId = ref(null);
const showModal = ref(false);
const showModalFavorite = true;
const favoriteList = JSON.parse(localStorage.getItem('favorite'));

const { t, locale } = useI18n();

const { kordinat } = useGeolocation();
const posisiUser = computed(() => ({
  lat: kordinat.value.latitude,
  lng: kordinat.value.longitude,
}));

watch([posisiUser, locale], (newValue) => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${newValue[0].lat}&lon=${newValue[0].lng}&units=metric&appid=406e0d43f1258f2c143ee80e19276799&lang=${locale.value}`,
    )
    .then((response) => {
      data.value = response.data;
    });
});

const forecastRemoveFavorite = () => {
  dropdownShow.value = false;
  showModal.value = true;
};
const handledropdownShow = (id) => {
  dropdownId.value = id;
  if (dropdownId.value === id && dropdownShow.value === false) {
    dropdownShow.value = true;
  } else {
    dropdownShow.value = false;
  }
};
</script>

<template>
  <Header v-bind:name="data?.city.name" />
  <div class="container">
    <div class="link">
      <router-link to="/">{{ t('message.home') }}</router-link>
    </div>
    <div v-bind:class="{ show: favoriteList.length === 0 }">
      <div v-for="(list, index) in favoriteList || []">
        <p class="city">{{ favoriteList?.city?.name }}</p>
        <div class="head">
          <div></div>
          <div class="dropdown favorive__dropdown">
            <img @click="handledropdownShow(index)" src="../assets/menu.svg" alt="menu" />
            <ul
              class="dropdown__content"
              :class="{ show: dropdownId !== index || dropdownShow === false }"
            >
              <li @click="forecastRemoveFavorite">{{ t('message.removeFavorite') }}</li>
            </ul>
          </div>
        </div>
        <ul class="forecast__list">
          <li v-if="list" v-for="item in list.list">
            <div class="date">
              {{ hoursName(item.dt_txt) }}
            </div>
            <div class="icon">
              <img
                v-bind:src="'http://openweathermap.org/img/w/' + item.weather[0].icon + '.png'"
              />
            </div>
            <p class="description">{{ item.weather[0].description }}</p>
            <div class="temp">{{ item.main.temp }}°C</div>
          </li>
        </ul>
      </div>
    </div>
    <div v-bind:class="{ show: favoriteList !== null }">
      <p class="descriptions">{{ t('message.noFavorite') }}</p>
    </div>
  </div>
  <div :class="{ show: showModal === false }">
    <Modal
      v-model:showModal="showModal"
      v-model:showModalFavorite="showModalFavorite"
      v-model:dropdownId="dropdownId"
      v-model:dropdownShow="dropdownShow"
      v-model:forecastList="favoriteList"
    />
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
.descriptions {
  text-align: center;
  font-size: 48px;
  margin-top: 50px;
}
</style>
