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
      return this.$route.path.trim() == `${route}`;
    },
    verifyLogin(ok) {
      let userExists = this.$store.getters.userExists({ 
        email: loginForm.email
        });

      let valid = this.$store.getters.credentialsValid({ 
        email: loginForm.email,
        password: loginForm.password
        });

      if (valid) {
        this.$store.commit('login', { email: loginForm.email });
        createToast(this.$bvToast, 'You are now logged in.', 'success');
        ok();
      } else {
        if (!userExists)
          createToast(this.$bvToast, 'Email is not registered.', 'danger');
        else 
          createToast(this.$bvToast, 'Invalid password.', 'danger');
      }
    },
    verifyRegister(ok) {
      if (registerForm.firstName.length < 2 || registerForm.firstName.length > 15) {
        createToast(this.$bvToast, 'Invalid first name.', 'danger');
        return;
      }

      if (registerForm.lastName.length < 2 || registerForm.lastName.length > 15) {
        createToast(this.$bvToast, 'Invalid last name.', 'danger');
        return;
      }

      if (registerForm.email.length < 6 || registerForm.email.length > 30) {
        createToast(this.$bvToast, 'Invalid email.', 'danger');
        return;
      }


      if (registerForm.password.length < 3 || registerForm.password.length > 12) {
        createToast(this.$bvToast, 'Invalid password.', 'danger');
        return;
      }

      if (registerForm.password !== registerForm.password2) {
        createToast(this.$bvToast, 'Passwords don\'t match.', 'danger');
        return;
      }
      
      if (this.$store.getters.userExists({ email: registerForm.email })) {
        createToast(this.$bvToast, 'User already registered.', 'danger');
        return;
      }
      
      
      createToast(this.$bvToast, 'You are now logged in.', 'success');
      this.$store.commit('registerUser', registerForm);
      ok();
    },
    verifyCart() {
      if (this.$store.getters.getCart.length <= 0) {
        createToast(this.$bvToast, 'Cart is currently empty.', 'danger');
        return;
      }
      this.$router.push('/cart');
    },
    logout() {
      this.$store.commit('logout');
      createToast(this.$bvToast, 'You are now logged out.', 'success');
    }
  }
}

// HELPER 
const createToast = (bv, text, type) => {
  bv.toast(text, {
    autoHideDelay: 3000,
    variant: type,
    solid: true
  });
}

</script>

<template>
<div class="banner"> 
  <div id="banner-main">
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand  to="/searchproperty">Booking+</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <div id="banner-routes" v-for="route in Routes" v-bind:key="route.id">
            <router-link 
              :to="{ path: route.path }" 
              v-if="route.banner" 
              tag="b-nav-item"
              :disabled="isDisabled(route.path)"
            >
              {{ route.name }}
            </router-link>
          </div>     
        </b-navbar-nav>     
      </b-collapse>

      <b-button @click="verifyCart()" v-if="this.$store.getters.isLogged">
        Cart
      </b-button>  

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
  
      <b-nav-text v-if="this.$store.getters.isLogged">
          &nbsp;
          &nbsp;
        {{ `Points: ${this.$store.getters.loggedClient.points}` }}
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
<b-modal id="login-modal" title="Login" centered>
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
<b-modal id="register-modal" title="Register Account" centered>
  <b-form-input v-model="registerForm.firstName" type="text" placeholder="First name"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.lastName" type="text" placeholder="Last name"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.email" type="email" placeholder="Email"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.password" type="password" placeholder="Password"></b-form-input>
  <br>
  <b-form-input v-model="registerForm.password2" type="password" placeholder="Confirm Password"></b-form-input>
  <br>
  <template slot="modal-footer" slot-scope="{ ok }">
    <b-button @click="verifyRegister(ok)">
      Register
    </b-button>
  </template>
</b-modal>

</div>
</template>

<style>

</style>


