<template>
  <h2>Your E-mail To Get The Reservation Details</h2>

  <div class="input-group">
    <input
      @input="onInputChange"
      type="text"
      v-model="email"
      placeholder="E-mail"
      name="email"
    />
    <button v-on:click="handleSubmit()">Finish</button>
    <SimpleKeyboard
      @onChange="onChange"
      @onKeyPress="onKeyPress"
      :input="email"
    />
  </div>
</template>

<style scoped>
h2 {
  font-size: 32px;
  color: #222;
  margin: 20px;
  border-bottom: 1px solid #063974;
  padding-bottom: 5px;
}
span.spaced {
  display: block;
  margin: 20px;
}
p {
  font-size: 18px;
}
.input-group {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: 1fr 1fr;
  width: 80%;
  margin: 25px auto;
}
.input-group input {
  padding: 10px;
  border-radius: 10px 10px 0 0;
  background-color: #fff;
  border: 1px solid #ebebeb;
  font-size: 44px;
  text-align: center;
  letter-spacing: 5px;
}

.input-group button {
  border: 1px solid #ebebeb;
  border-radius: 0 0 5px 5px;
  border-top: 0;
  background-color: #222;
  color: #fff;
  cursor: pointer;
  font-size: 28px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<script>
import SimpleKeyboard from "@/components/SimpleKeyboard.vue";

export default {
  name: "Leave/OwnEmail",
  components: {
    SimpleKeyboard,
  },
  data() {
    return {
      email: "",
    };
  },
  methods: {
    onChange(input) {
      this.email = input;
    },
    onKeyPress(button) {
      console.log("button", button);
    },
    onInputChange(input) {
      this.email = input.target.value;
    },
    handleSubmit() {
      if (this.email.length <= 0) return;

      this.$router.push({
        path: "/leave/final",
        query: {
          sizeCode: this.$route.query.sizeCode,
          name: this.$route.query.name,
          email: this.$route.query.email,
          ownEmail: this.email,
        },
      });
    },
  },
  mounted() {
    console.log(this.$route.query.sizeCode);
  },
};
</script>
