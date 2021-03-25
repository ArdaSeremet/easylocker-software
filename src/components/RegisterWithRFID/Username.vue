<template>
  <h2>Register With RFID Tag</h2>

  <div class="input-group">
    <input
      @input="onInputChange"
      type="text"
      v-model="username"
      placeholder="Username"
      name="username"
    />
    <button v-on:click="handleSubmit()">Register</button>
    <SimpleKeyboard
      @onChange="onChange"
      @onKeyPress="onKeyPress"
      :input="username"
    />
  </div>

  <div class="modal" v-if="modalShow">
    {{ modalText }}
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  border: 1px solid #222;
  background-color: #333;
  padding: 15px;
  width: 60%;
  height: 40%;
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
  font-size: 60px;
  text-align: center;
  letter-spacing: 20px;
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
import * as CONFIG from "@/./config";
import SimpleKeyboard from "@/components/SimpleKeyboard.vue";

export default {
  name: "RegisterRFID/Username",
  components: { SimpleKeyboard },
  data() {
    return {
      modalShow: false,
      modalText: "ERROR",
      username: "",
    };
  },
  methods: {
    onChange(input) {
      this.username = input;
    },
    onKeyPress(button) {
      console.log("button", button);
    },
    onInputChange(input) {
      this.username = input.target.value;
    },
    handleSubmit() {
      this.modalText = "Processing...";
      this.modalShow = true;

      if (this.username.length <= 0) {
        this.modalText = "Please enter a valid username.";
      }

      CONFIG.db.query(
        "SELECT * FROM rfid_users WHERE locker_id = ? AND name = ?",
        [CONFIG.LOCKER_ID, this.username],
        (err, res) => {
          if (err) {
            this.modalText =
              "An internal system error occured. Please try again later.";
            setTimeout(() => {
              this.modalShow = false;
            }, 3000);
            return;
          }

          if (res.length > 0) {
            this.modalText =
              "This username is already being used, please enter another one.";
            setTimeout(() => {
              this.modalShow = false;
            }, 3000);
            return;
          }

          this.modalText = "Username is available. Registering now...";

          CONFIG.db.query(
            "INSERT INTO rfid_users SET locker_id = ?, name = ?, rfid_uuid = ?",
            [CONFIG.LOCKER_ID, this.username, this.$route.query.rfidUUID],
            (err) => {
              if (err) {
                this.modalText =
                  "An internal system error occured while registering the user. Please try again later.";
                setTimeout(() => {
                  this.modalShow = false;
                }, 3000);
                return;
              }

              this.modalText = "Successfully registered the user!";
              setTimeout(() => {
                this.modalShow = false;
                this.$router.push("/");
              }, 3000);
            }
          );
        }
      );

      console.log("Username", this.username);
    },
  },
  mounted() {},
};
</script>