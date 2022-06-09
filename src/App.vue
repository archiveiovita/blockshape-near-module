<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/donate">Donate</router-link>
      |
      <a href="#" v-if="currentUser" @click="signOut">Sign Out</a>

      <h2 v-if="currentUser">Welcome <i>{{ currentUser.accountId }}</i></h2>
    </div>
    <router-view :contract="contract"
                 :currentUser="currentUser"
                 :nearConfig="nearConfig"
                 :walletConnection="walletConnection"/>
  </div>
</template>

<script>

import {mapActions} from 'vuex'

export default {
  props: ['contract', 'currentUser', 'nearConfig', 'walletConnection'],
  methods: {
    ...mapActions({initContract: 'initContract'}),
    signOut() {
      this.walletConnection.signOut();
      window.location.replace(window.location.origin + window.location.pathname);
    }
  },
  mounted() {
    // this.initContract()
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

button {
  background: transparent;
  outline: none;
  border: 1px solid #2c3e50;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
