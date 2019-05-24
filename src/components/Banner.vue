<script>
import { Routes } from '../data/appData';

import 'material-design-icons/iconfont/material-icons.css';

let loginForm =  {
    email: '',
    password: ''
  }

let registerForm =  {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: ''
  }

export default {
  data() {
    return {
      Routes,
      loginForm,
      registerForm
    }
  },
  methods: {
    isDisabled(route) {
      return this.$route.path.trim() == `${route}`
    },
    verifyLogin(ok) {
      let userExists = this.$store.getters.userExists({ 
        email: loginForm.email, 
        });

      let valid = this.$store.getters.credentialsValid({ 
        email: loginForm.email, 
        password: loginForm.password 
        });

      if (valid) {
        this.$bvToast.toast('You are now logged in.', {
          autoHideDelay: 3000,
          variant: 'success',
          solid: true
        });
        this.$store.commit('login', { email: loginForm.email });
        ok();
      } else {
        if (!userExists)
          this.$bvToast.toast('Email is not registered.', {
              autoHideDelay: 3000,
              variant: 'danger',
              solid: true
            });
        else 
          this.$bvToast.toast('Invalid password.', {
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

      <b-button v-b-modal.login-modal v-if="!this.$store.getters.isLogged">
        Login
      </b-button> 
      
      &nbsp;
      &nbsp;
      &nbsp;

      <b-button v-b-modal.register-modal v-if="!this.$store.getters.isLogged">
        Register
      </b-button> 

      <b-nav-text v-if="this.$store.getters.isLogged">
       {{ `Hello, ${this.$store.getters.loggedClient.firstName}` }}
      </b-nav-text> 

      &nbsp;
      &nbsp;
      &nbsp;

      <router-link 
        to="/" 
        v-if="this.$store.getters.isLogged" 
        tag="b-button"
        @click.native="logout()"
      >
        Logout
      </router-link>
    </b-navbar>
  </div>

<!-- LOGIN MODAL -->
<b-modal id="login-modal" title="Login">
  <b-form-input v-model="loginForm.email" type="email" placeholder="Email"></b-form-input>
  <br>
  <b-form-input v-model="loginForm.password" type="password" placeholder="Password"></b-form-input>
  <template slot="modal-footer" slot-scope="{ ok }">
    <b-button @click="verifyLogin(ok)">
      Login
    </b-button>
  </template>
</b-modal>

<!-- REGISTER MODAL -->
<b-modal id="register-modal" title="Register Account">
  <b-form-input v-model="registerForm.firstName" type="text" placeholder="First name"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.lastName" type="text" placeholder="Last name"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.email" type="email" placeholder="Email"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.password" type="password" placeholder="Password"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.password2" type="password2" placeholder="Confirm Password"></b-form-input>
  
  <template slot="modal-footer" slot-scope="{ ok }">
    <b-button @click="verifyRegister(ok)">
      Register
    </b-button>
  </template>
</b-modal>

</div>
</template>



