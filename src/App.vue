<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <subway msg="南京地铁出行线路规划系统"/>
  </div>
</template>

<script>
import Subway from './components/Subway.vue'

export default {
  name: 'App',
  components: {
    Subway
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
