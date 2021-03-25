<template>
  <h2>Register With RFID Tag</h2>

  <div class="input-group">
    <form @submit="handleSubmit">
      <input
        type="text"
        v-model="rfidNumber"
        @blur="handleBlurOut"
        placeholder="RFID"
        name="rfidNumber"
        ref="rfidInput"
      />
      <button type="submit" value="0">RFID OK</button>
    </form>
  </div>

  <span> Please show your RFID card/tag </span>

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
.input-group {
  position: absolute;
  left: -999px;
  top: -999px;
}
</style>

<script>
import * as CONFIG from "@/./config";

export default {
  name: "RegisterRFID/RFID",
  components: {},
  data() {
    return {
      rfidNumber: "",
      modalShow: false,
      modalText: "ERROR",
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();

      let rfidUUID = this.rfidNumber;
      this.rfidNumber = "";

      this.modalText = "Checking...";
      this.modalShow = true;

      console.log("Read Card UUID", rfidUUID);

      if (rfidUUID.toString().length <= 0) {
        this.modalText = "Please show a valid RFID tag...";
        setTimeout(() => {
          this.modalShow = false;
        }, 3000);
        return;
      }

      CONFIG.db.query(
        "SELECT * FROM rfid_users WHERE locker_id = ? AND rfid_uuid = ?",
        [CONFIG.LOCKER_ID, rfidUUID],
        (err, res) => {
          if (err) {
            this.modalText =
              "An internal system error occured. Please try again later...";
          }

          if (res.length > 0) {
            this.modalText = "This RFID card is already registered.";
          } else {
            this.modalText =
              "Please wait, you are being redirected to the next step.";

            this.$router.push({
              path: "/register-rfid/username",
              query: { rfidUUID: rfidUUID },
            });
          }

          setTimeout(() => {
            this.modalShow = false;
          }, 3000);
        }
      );

      //this.$router.push({ path: '/leave/email', query: { sizeCode: this.$route.query.sizeCode, name: this.name } })
    },
    handleBlurOut(e) {
      e.target.focus();
    },
  },
  mounted() {
    this.$refs.rfidInput.focus();
  },
};
</script>