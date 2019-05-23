<template>
  <div id="app">
    <Banner />
    <br>
    <router-view/>
    {{ this.$store.getters.isLogged }}
  </div>
</template>

<script>
import Banner from './components/Banner.vue';
import './assets/style.css';


export default {
  name: 'app',
  components: {
    Banner
  },
};
</script>