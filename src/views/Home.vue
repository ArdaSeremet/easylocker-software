<template>
  <div class="home">
    <ul class="action-boxes">
      <li>
        <router-link to="/leave">
          Leave<br />
          Package<br />
          With<br />
          Barcode<br />
        </router-link>
      </li>
      <li>
        <router-link to="/get">
          Get<br />
          Package<br />
          With<br />
          Barcode<br />
        </router-link>
      </li>
      <li>
        <router-link to="/make-reservation">
          Make<br />
          An<br />
          Offline<br />
          Reservation<br />
        </router-link>
      </li>

      <li>
        <router-link to="/register-rfid">
          Register<br />
          User<br />
          With<br />
          RFID Card<br />
        </router-link>
      </li>

      <li>
        <router-link to="/leave-rfid">
          Leave<br />
          To<br />
          An<br />
          RFID User<br />
        </router-link>
      </li>

      <li>
        <router-link to="/get-rfid">
          Get<br />
          Package<br />
          With<br />
          RFID Tag<br />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home {
  padding: 50px;
}

.action-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 100px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
}

.action-boxes li a {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #2e7d32;
  color: #fff;
  text-decoration: none;
  font-size: 36px;
  line-height: 1.3;
  border-radius: 5px;
  transition: 200ms all;
}

.action-boxes li:nth-of-type(2) a {
  background-color: #01579b;
}

.action-boxes li:nth-of-type(3) a {
  background-color: #4527a0;
}

.action-boxes li a:hover {
  transform: scale(1.1);
}
</style>

<script>
// @ is an alias to /src

export default {
  name: "Home",
};
</script>
