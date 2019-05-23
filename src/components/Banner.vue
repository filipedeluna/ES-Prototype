<script>
import { Routes } from '../data/appData';

import { ClientInfo } from '../data/clientData';

import 'material-design-icons/iconfont/material-icons.css';

let formData =  {
    loginEmail: '',
    loginPassword: ''
  }

export default {
  data() {
    return {
      Routes,
      ClientInfo,
      formData
    }
  },
  methods: {
    isDisabled(route) {
      return this.$route.path.trim() == `${route}`
    },
    verifyData(ok) {
      let valid = 
        formData.loginEmail == ClientInfo.email &&
        formData.loginPassword == ClientInfo.password

      if (valid) {
        this.$bvToast.toast('You are now logged in.', {
          autoHideDelay: 3000,
          variant: 'success',
          solid: true
        });
        this.$store.commit('login');
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
            <b-nav-item 
              :href="`#${route.route}`"
              :disabled="isDisabled(route.route)"
            >
            {{ route.name }}
            </b-nav-item>
          </div>     
        </b-navbar-nav>     
      </b-collapse>

      <b-button type="submit">Cart</b-button> 
      &nbsp;
      &nbsp;
      &nbsp;
      
      <b-nav-text v-if="this.$store.getters.isLogged">
       {{ `Hello, ${ClientInfo.firstName}` }}
      </b-nav-text> 
      &nbsp;
      &nbsp;
      &nbsp;

      <b-button v-b-modal.login-modal v-if="!this.$store.getters.isLogged">
        Login
      </b-button> 
      
      <b-button v-if="this.$store.getters.isLogged" @click="logout()">
        Logout
      </b-button> 

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

    </b-navbar>
  </div>
</div>
</template>



