<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  showModal: Boolean,
  forecastList: Array,
  forecastShow: Boolean,
  dropdownShow: Boolean,
  dropdownId: Number,
  showModalFavorite: Boolean,
});
const emit = defineEmits([
  'update:showModal',
  'update:forecastList',
  'update:forecastShow',
  'update:dropdownShow',
]);

const close = (value) => {
  emit('update:showModal', value);
  emit('update:dropdownShow', value);
};

const done = (value) => {
  emit('update:showModal', value);
  emit('update:dropdownShow', value);
  if (props.showModalFavorite === false) {
    emit(
      'update:forecastList',
      props.forecastList.filter((_, index) => index !== props.dropdownId),
    );
  }

  if (props.showModalFavorite === true) {
    localStorage.setItem(
      'favorite',
      JSON.stringify(props.forecastList.filter((_, index) => index !== props.dropdownId)),
    );
    emit(
      'update:forecastList',
      props.forecastList.filter((_, index) => index !== props.dropdownId),
    );
  }

  if (props.forecastList.length === 1) {
    // emit('update:forecastShow', value);
  }

  toast('Done remove favorite weather', {
    autoClose: 2000,
    type: 'success',
    theme: 'dark',
  });
};
</script>

<template id="modal-template" name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header"
            ><h3>{{ t('message.descriptionModal') }}</h3>
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="close(false)">
              {{ t('message.no') }}
            </button>
            <button class="modal-default-button" @click="done(false)">
              {{ t('message.yes') }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  height: 200px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header {
  margin-bottom: 40px;
}
.modal-header h3 {
  margin-top: 0;
  color: #1f1f1f;
}

.modal-default-button {
  padding: 10px 25px;
  margin: 0 10px;
  border-radius: 5px;
  background: #1f1f1f;
  color: #fff;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
