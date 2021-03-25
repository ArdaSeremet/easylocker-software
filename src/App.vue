<template>
  <div id="app-frame">
    <div class="top-nav">
      <span @click="goHome" class="logo"> EasyLocker </span>
      <span @click="goHome" class="main-page-btn"> Main Page </span>
      <span class="clock">
        {{ clock }}
      </span>
    </div>
    <router-view />
  </div>
</template>

<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css";

@font-face {
  font-family: "Spantaran";
  src: local("Spantaran"), url(./assets/fonts/Spantaran.ttf) format("truetype");
}

* {
  box-sizing: border-box;
}

body {
  background-color: #f4f4f4;
}

.modal-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(6px);
}
.modal {
  position: absolute;
  border: 1px solid #222;
  background-color: #333;
  padding: 30px;
  width: 60%;
  border-radius: 20px;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #f4f4f4;
  font-size: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  background-color: #0b61c1;
  padding: 0 50px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  box-shadow: 0 0 5px gray;
}

.logo {
  font-family: "Spantaran", Arial, sans-serif;
  font-size: 28px;
}

.clock {
  font-size: 16px;
  font-weight: bold;
}
</style>
<script>
export default {
  name: "App",
  data() {
    return {
      clock: "00:00",
    };
  },
  mounted() {
    this.updateClock();
    setInterval(this.updateClock, 10000);
  },
  methods: {
    updateClock: function () {
      let date = new Date(Date.now() + 1000 * 60 * 60);
      let clock = "";
      if (date.getHours() < 10) {
        clock += "0";
      }

      clock += date.getHours().toString();

      clock += ":";

      if (date.getMinutes() < 10) {
        clock += "0";
      }

      clock += date.getMinutes().toString();

      this.clock = clock;
    },
    goHome: function () {
      this.$router.push("/");
    },
  },
};
</script>
