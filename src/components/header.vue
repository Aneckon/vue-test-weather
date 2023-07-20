<script setup>
import { useI18n } from 'vue-i18n';
import { i18n } from '../i18n';

const props = defineProps({ name: String });

const { t } = useI18n();

const changeLocale = (locale) => {
  i18n.global.locale.value = locale;
};
</script>

<template>
  <header>
    <div class="container">
      <div class="header__content">
        <router-link to="/">
          <img src="../assets/logo.svg" alt="logo" />
        </router-link>
        <div class="header__local">
          <img src="../assets/point.svg" alt="point" />
          <p>{{ props.name }}</p>
        </div>
        <div class="header__language">
          <button @click="changeLocale('en')">{{ t('message.eng') }}</button>
          <button @click="changeLocale('ua')">{{ t('message.ukr') }}</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
header {
  padding: 50px 0px;
}
.header__content {
  display: flex;
  align-items: center;
}
.header__local {
  display: flex;
  align-items: center;
}

.header__content img {
  margin-right: 50px;
}
.header__local img {
  margin-right: 15px;
}
.header__language {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.header__language button {
  color: grey;
}
.header__language button {
  color: #fff;
}
.header__language a:first-child {
  margin-right: 10px;
}
</style>
