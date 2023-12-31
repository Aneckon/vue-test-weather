<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';

import Modal from './modal.vue';

const emit = defineEmits(['update:day']);

const props = defineProps({ data: Array, day: Number });

const input = ref('');

const forecastDay = ref(6);
const forecastList = ref([]);
const showModalFavorite = false;
const forecastShow = ref(false);
const dropdownShow = ref(false);
const dropdownId = ref(null);
const showModal = ref(false);

const { t, locale } = useI18n();

const citiesList = ref([]);

const convertLocale = () => locale.value === 'ua' && 'uk';

const dynamicSearch = async () => {
  if (!input.value) return;

  citiesList.value = [];

  try {
    let resp = await fetch(
      `https://autocomplete.travelpayouts.com/places2?term=${
        input.value
      }&locale=${convertLocale()}&types[]=city`,
    );
    let cities = await resp.json();

    if (cities) {
      cities.splice(0, 10).forEach((city) => citiesList.value.push(city.name));
    }
  } catch (error) {
    alert('Network error!');
  }
};

const selectCity = (event) => {
  input.value = event.target.innerText;
  addForecast();
  citiesList.value = [];
};

const hoursName = (date) => {
  const getFullName = moment(date).format('LT');
  return getFullName;
};

const onChange = (event) => {
  event.target.value;
};

const addForecast = () => {
  if (forecastList.value.length !== 5) {
    if (input.length !== 0 || input.indexOf(' ')) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&units=metric&appid=406e0d43f1258f2c143ee80e19276799&cnt=${forecastDay.value}&lang=${locale.value}`,
        )
        .then((response) => {
          forecastList.value.push(response.data);
          forecastShow.value = true;
          input.value = '';
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  } else {
    toast('more than 5 is not possible', {
      autoClose: 2000,
      type: 'error',
      theme: 'dark',
    });
  }
};

const handleDayNum = (dayNum) => {
  emit('update:day', dayNum);
};

const forecastAddFavorite = () => {
  dropdownShow.value = false;
  toast('Done favorite weather', {
    autoClose: 2000,
    type: 'success',
    theme: 'dark',
  });
  localStorage.setItem('favorite', JSON.stringify(forecastList.value));
};

const forecastDelete = (id) => {
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
  <div class="forecast">
    <div class="container">
      <div class="forecast__filter">
        <button v-bind:class="{ active: props.day === 6 }" @click="handleDayNum(6)">
          {{ t('message.today') }}
        </button>
        <button v-bind:class="{ active: props.day === 40 }" @click="handleDayNum(40)">
          {{ t('message.nextDays') }}
        </button>
      </div>
      <ul class="forecast__list">
        <li v-for="(item, index) in props.data">
          <div class="date">
            {{ hoursName(item.dt_txt) }}
          </div>
          <div class="icon">
            <img v-bind:src="'http://openweathermap.org/img/w/' + item.weather[0].icon + '.png'" />
          </div>
          <p class="description">{{ item.weather[0].description }}</p>
          <div class="temp">{{ item.main.temp }}°C</div>
        </li>
      </ul>
      <div v-bind:class="{ show: forecastShow === false }">
        <div v-for="(list, index) in forecastList || []">
          <p class="city">{{ list.city.name }}</p>
          <div class="head">
            <div></div>
            <div class="dropdown">
              <img @click="handledropdownShow(index)" src="../assets/menu.svg" alt="menu" />
              <ul
                class="dropdown__content"
                :class="{ show: dropdownId !== index || dropdownShow === false }"
              >
                <li @click="forecastAddFavorite">{{ t('message.addFavorite') }}</li>
                <li @click="forecastDelete(index)">{{ t('message.removeFavorite') }}</li>
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

      <input
        :class="{ 'autocomplete-input-fix': citiesList.length > 0 && input?.length !== 0 }"
        v-model="input"
        @input="dynamicSearch"
        @change="onChange($event)"
        @keyup.enter="addForecast"
        type="text"
        :placeholder="t('message.search')"
      />
      <ul v-if="input?.length !== 0" class="cities-list">
        <li
          tabindex="0"
          v-for="(city, index) in citiesList"
          :key="index"
          class="cities-list__item"
          @click="selectCity"
          @keyup.enter="selectCity"
        >
          {{ city }}
        </li>
      </ul>

      <button class="forecast__add" @click="addForecast">
        <img src="../assets/plus.svg" /> {{ t('message.addWeather') }}
      </button>
    </div>
  </div>
  <div :class="{ show: showModal === false }">
    <Modal
      v-model:showModal="showModal"
      v-model:forecastList="forecastList"
      v-model:dropdownId="dropdownId"
      v-model:showModalFavorite="showModalFavorite"
      v-model:forecastShow="forecastShow"
      v-model:dropdownShow="dropdownShow"
    />
  </div>
</template>

<style>
.cities-list {
  width: 100%;
  border-radius: 0 0 15px 15px;
  background: #1f1f1f;
}
.cities-list__item {
  padding: 10px 20px;
}
.cities-list__item:last-child {
  border-radius: 0 0 15px 15px;
}
.cities-list__item:hover {
  cursor: pointer;
  background: #333333;
}
.forecast__list {
  display: flex;
  align-items: center;
  justify-content: space-between;

  overflow-x: auto;

  padding: 15px 0;
  margin-bottom: 40px;
}

.description {
  text-transform: capitalize;
  font-size: 12px;
  height: 25px;
  margin-bottom: 10px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.show {
  display: none;
}

.city {
  margin-bottom: 20px;
}

.forecast__add {
  cursor: pointer;

  margin-bottom: 40px;

  display: flex;
  align-items: center;
  margin: 25px auto;

  color: #fff;
}

.forecast__add img {
  margin-right: 10px;
}

.forecast__list::-webkit-scrollbar {
  width: 1px;
  height: 2px;
  border-radius: 2px;
}

.forecast__list::-webkit-scrollbar-thumb {
  background-color: #fff;
  outline: 1px solid slategrey;
}

.forecast__list li {
  text-align: center;

  margin-right: 40px;

  min-width: 130px;
  width: 100%;
  height: 210px;

  padding: 30px;
  background: #1f1f1f;
  border-radius: 10px;
}

.forecast__list li:last-child {
  margin-right: 0px;
}

.forecast__list li img {
  margin: 0 auto;
}

.date {
  padding-bottom: 10px;
  margin-bottom: 10px;

  border-bottom: 1px solid #fdfdfd;
}

.icon {
  margin-bottom: 10px;
}

.forecast__filter button {
  color: #fff;
}

.forecast__filter .active {
  color: grey;
}

.dropdown {
  cursor: pointer;
  position: relative;
}

.dropdown__content {
  position: absolute;

  padding: 20px;
  width: 160px;
  background: #1f1f1f;

  border-radius: 10px;

  top: 100%;
  right: 0;
}

.dropdown__content li {
  margin-bottom: 15px;
}

.dropdown__content li:last-child {
  margin-bottom: 0;
}

input {
  width: 100%;
  height: 50px;

  padding: 10px 20px;

  color: #fff;
  background: #1f1f1f;
  border-radius: 50px;
}

.autocomplete-input-fix {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>
