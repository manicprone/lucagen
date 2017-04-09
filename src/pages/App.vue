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
    margin: 0;
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

  .page h1 {
    margin: 0;
  }
  .page-header {
    background-color: #ededed;
    padding: 7px 0;
    border-top: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;
  }
  .page-body {
    margin: 30px;
  }

  .version {
    display: none;
    color: #727272;
    font-size: 10px;
  }
</style>
