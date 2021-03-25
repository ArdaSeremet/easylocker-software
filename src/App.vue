<template>
<div id="app-frame">
  <div class="top-nav">
    <span @click="goHome" class="logo">
      EasyLocker
    </span>
    <span @click="goHome" class="main-page-btn">
      Main Page
    </span>
    <span class="clock">
      {{ clock }}
    </span>
  </div>
  <router-view />
</div>
</template>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css'; 

@font-face {
  font-family: "Spantaran";
  src: local("Spantaran"),
  url(./assets/fonts/Spantaran.ttf) format("truetype");
}

* {
  box-sizing: border-box;
}

body {
  background-color: #F4F4F4;
}

.main-page-btn {
  font-size: 18px;
  background-color: #d6481d;
  height: 80%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 10px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.top-nav {
  background-color: #0B61C1;
  padding: 0 50px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFF;
  box-shadow: 0 0 5px gray;
}

.logo {
  font-family: 'Spantaran', Arial, sans-serif;
  font-size: 28px;
}

.clock {
  font-size: 16px;
  font-weight: bold;
}

</style>
<script>
export default {
  name: 'App',
  data() {
    return {
      clock: '00:00'
    }
  },
  mounted() {
    this.updateClock()
    setInterval(this.updateClock, 10000)
  },
  methods: {
    updateClock: function () {
      let date = new Date()
      this.clock = `${date.getHours()}:${date.getMinutes()}`
    },
    goHome: function () {
      this.$router.push('/')
    }
  }
}
</script>
