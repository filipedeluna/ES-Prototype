<script>
import { Routes } from '../data/appData';

export default {
  props: '',
  data: function() {
    return {
      Routes
    }
  },
  methods: {
    isDisabled(route) {
      return this.$route.path.trim() == `${route}`
    }
  }
}
</script>

<template>
<div class="banner"> 
  <div id="banner-main">
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/">Booking+</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <div id="banner-routes" v-for="route in Routes" v-bind:key="route.id">
          <b-nav-item 
            :href="`#${route.route}`"
            :disabled="isDisabled(route.route)"
          >
          {{ route.name }}
          </b-nav-item>
        </div>
      </b-navbar-nav>       
    </b-collapse>
  </b-navbar>
  </div>
</div>
</template>



