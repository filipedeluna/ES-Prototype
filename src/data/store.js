// Main app state
export let Store = {
  state: {
    userLoggedIn: false
  },
  mutations: { // sync
    // Session
    login(state) {
      state.userLoggedIn = true;
    },
    logout(state) {
      state.userLoggedIn = false;
    }
  },
  actions: { // async

  },
  getters: {
    // Session
    isLogged(state) {
      return state.userLoggedIn;
    }
  }
}
