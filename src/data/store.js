import * as R from 'ramda/dist/ramda';

import { DefaultUser } from '../data/clientData';

// Main app state
export let Store = {
  state: {
    userLoggedIn: false,
    loggedClient: {},
    users: [ DefaultUser ]
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
    registerUser: (state, newUser) => {
      state.users.push(newUser);
    }

  },
  actions: { // async

  },
  getters: {
    // Session
    isLogged: state => 
      state.userLoggedIn,
    loggedClient: state => 
      state.loggedClient,
    userExists: state => payload => 
      !R.isNil(getUserByEmail(payload.email, state)),
    credentialsValid: state => payload => {
      const user = getUserByEmail(payload.email, state);
      return !R.isNil(user) && 
        payload.email == user.email && 
        payload.password == user.password;
    }
  }
}

const getUserByEmail = (email, state) =>
  R.find(R.propEq('email', email), state.users);

