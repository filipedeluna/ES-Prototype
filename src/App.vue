<template>
  <div id="app">
    <Banner />
    <router-view/>
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