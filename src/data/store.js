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
    userProperties: [],
    userPropertiesCounter: 0,
    lastPropertySearch: null,
    cart: [],
    cartCounter: 0
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
        paymentMethods: [],
        points: 100
      }
      state.users.push(newUser);
    },
    propertySearch: (state, payload) => {
      state.lastPropertySearch = payload;
    },
    addToCart: (state, payload) => {
      state.cart.push({ ...payload, cartId: state.cartCounter });
      state.cartCounter++;
    },
    removeFromCart: (state, payload) => {
      state.cart = R.filter(cartItem => cartItem.cartId != payload, state.cart);
    },
    payCart: (state, payload) => {
      state.cart = [];
      state.loggedClient.points -= payload.pointsSpent;
      state.loggedClient.points += Math.floor(payload.totalSpent / 10);
      state.loggedClient.points = state.loggedClient.points >= 0 ? state.loggedClient.points : 0;
    },
    insertProperty: (state, payload) => {
      const reviews = 0;
      const score = 1;
      const distance = Math.floor((Math.random() * 25 )) + 1 ;

      state.userProperties.push({
        id: state.userPropertiesCounter,
        picture: 'pictures/properties/undefined.jpg',
        ...payload,
        reviews,
        score,
        distance,

      });

      state.userPropertiesCounter++;
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
      state.properties,
    generateProperties: state => {
      let generatedProperties = state.properties;
    
      for (let i = 0; i < generatedProperties.length; i++) {
        generatedProperties[i] = {
          ...generatedProperties[i],
          wifi: randomYesNo(),
          pets: randomYesNo(),
          smokers: randomYesNo(),
          cleaning: randomYesNo(),
          guests: randomYesNo(),
          garage: randomYesNo(),
          reviews: Math.floor((Math.random() * 950 )) + 50,
          distance: Math.floor((Math.random() * 25 )) + 1 
        }
      }

      let userProps = R.filter(prop => 
        state.lastPropertySearch.destination.toUpperCase() == prop.location.toUpperCase(),
        state.userProperties)
      
      return R.concat(generatedProperties, userProps);
    },
    getCart: state =>
      state.cart,
  }
}

const getUserByEmail = (email, state) =>
  R.find(R.propEq('email', email), state.users);

const randomYesNo = () =>
  Math.floor((Math.random() * 10 )) >= 4;