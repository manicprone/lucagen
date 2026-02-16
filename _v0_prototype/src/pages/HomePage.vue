<template>
  <div class="home-page page">

    <div class="nav-links">
      <router-link to="/world">DotWorld</router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomePage',

  data: () => {
    return {
      canvas: null,
    };
  },

  computed: {
  },

  mounted() {
  },
};
</script>

<style scoped>

  .nav-links {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100px;
    width: 300px;
    margin: -50px 150px -50px -150px;
  }
  .nav-links a {
    font-size: 1.4em;
  }

</style>
