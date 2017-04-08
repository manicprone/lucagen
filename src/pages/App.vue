<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view id="page-content"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app',
  };
</script>

<style>
  body {
    background-color: #e9e9e9;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .page {

  }

  .page h1 {
    margin: 8px 0;
  }

  .version {
    color: #727272;
  }
</style>
