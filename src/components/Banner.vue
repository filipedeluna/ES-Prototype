<script>
import { Routes } from '../data/appData';

import 'material-design-icons/iconfont/material-icons.css';

let formData =  {
    loginEmail: '',
    loginPassword: ''
  }

export default {
  data() {
    return {
      Routes,
      formData
    }
  },
  methods: {
    isDisabled(route) {
      return this.$route.path.trim() == `${route}`
    },
    verifyData(ok) {
      let valid = this.$store.getters.credentialsValid({ 
        email: formData.loginEmail, 
        password: formData.loginPassword 
        });

      if (valid) {
        this.$bvToast.toast('You are now logged in.', {
          autoHideDelay: 3000,
          variant: 'success',
          solid: true
        });
        this.$store.commit('login', { email: formData.loginEmail });
        ok();
      } else {
        this.$bvToast.toast('Invalid credentials.', {
            autoHideDelay: 3000,
            variant: 'danger',
            solid: true
          });
      }
    },
    logout() {
      this.$store.commit('logout');
      this.$bvToast.toast('You are now logged out.', {
          autoHideDelay: 3000,
          variant: 'success',
          solid: true
        });
    }
  }
}

</script>

<template>
<div class="banner"> 
  <div id="banner-main">
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="/">Booking+</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <div id="banner-routes" v-for="route in Routes" v-bind:key="route.id">
            <router-link 
              :to="{ path: route.path }" 
              v-if="route.name != 'Cart'" 
              tag="b-nav-item"
              :disabled="isDisabled(route.path)"
            >
              {{ route.name }}
            </router-link>
          </div>     
        </b-navbar-nav>     
      </b-collapse>

      <router-link 
        to="/cart" 
        v-if="this.$store.getters.isLogged" 
        tag="b-button" 
        type="submit"
      >
        Cart 
      </router-link>

      &nbsp;
      &nbsp;
      &nbsp;
      
      <b-nav-text v-if="this.$store.getters.isLogged">
       {{ `Hello, ${this.$store.getters.loggedClient.firstName}` }}
      </b-nav-text> 

      &nbsp;
      &nbsp;
      &nbsp;

      <b-button v-b-modal.login-modal v-if="!this.$store.getters.isLogged">
        Login
      </b-button> 
      
      &nbsp;
      &nbsp;
      &nbsp;

      <router-link 
        to="/" 
        v-if="!this.$store.getters.isLogged" 
        tag="b-button"
        @click.native="logout()"
      >
        Register
      </router-link>

      <router-link 
        to="/" 
        v-if="this.$store.getters.isLogged" 
        tag="b-button"
        @click.native="logout()"
      >
        Logout
      </router-link>


      <!-- LOGIN MODAL -->
      <b-modal id="login-modal" title="Login">
        <b-form-input v-model="formData.loginEmail" type="email" placeholder="Email"></b-form-input>
        <br>
        <b-form-input v-model="formData.loginPassword" type="password" placeholder="Password"></b-form-input>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button @click="verifyData(ok)">
            Login
          </b-button>
        </template>
      </b-modal>

      <!-- REGISTER MODAL -->
    </b-navbar>
  </div>
</div>
</template>



