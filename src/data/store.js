import * as R from 'ramda/dist/ramda';

import { DefaultUser } from '../data/clientData';
import { Properties } from '../data/propertyData';

// Main app state
export let Store = {
  state: {
    userLoggedIn: false,
    loggedClient: {},
    users: [ DefaultUser ],
    properties: Properties,
    lastPropertySearch: null
  },
  mutations: { // sync
    // Session
    login: (state, payload) => {
      state.userLoggedIn = true;

      const user = getUserByEmail(payload.email, state);
      state.loggedClient = user;
    },
    logout: state => {
      state.userLoggedIn = false;
      state.loggedClient = {}
    },
    registerUser: (state, payload) => {
      const newUser = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        paymentMethods: []
      }
      console.log(newUser);
      state.users.push(newUser);
    },
    propertySearch: (state, payload) => {
      state.lastPropertySearch = payload;
    }

  },
  actions: { // async

  },
  getters: {
    // Session
    isLogged: state => 
      state.userLoggedIn,
    lastPropertySearched: state => 
      state.lastPropertySearch,
    wasPropertySearched: state => 
      !R.isNil(state.lastPropertySearch),
    loggedClient: state => 
      state.loggedClient,
    userExists: state => payload => 
      !R.isNil(getUserByEmail(payload.email, state)),
    credentialsValid: state => payload => {
      const user = getUserByEmail(payload.email, state);
      return !R.isNil(user) && 
        payload.email == user.email && 
        payload.password == user.password;
    },
    getProperties: state =>
      state.properties
  }
}

const getUserByEmail = (email, state) =>
  R.find(R.propEq('email', email), state.users);
