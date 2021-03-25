<template>
  <h2>Leave Package</h2>

  <div class="input-group">
    <input
      @input="onInputChange"
      type="text"
      v-model="barcodeNumber"
      placeholder="Barcode Number..."
      name="barcode"
    />
    <button v-on:click="handleSubmit()">Check Package</button>
    <SimpleKeyboard
      @onChange="onChange"
      @onKeyPress="onKeyPress"
      :input="barcodeNumber"
    />
  </div>
  <span class="spaced">Or</span>
  <p>You can use barcode scanner to scan your barcodes automatically.</p>

  <div class="modal" v-if="showDrawerCloseModal">
    Please close the drawer after leaving the package...
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
import * as HELPERS from "@/./helpers";
import * as CONFIG from "@/./config";

import SimpleKeyboard from "@/components/SimpleKeyboard.vue";

export default {
  name: "LeaveWithoutRegistration",
  components: {
    SimpleKeyboard,
  },
  data() {
    return {
      barcodeNumber: null,
      showDrawerCloseModal: false,
    };
  },
  mounted() {
    CONFIG.serialParser.on("data", (data) => {
      console.log("RECEIVED DATA: " + data.toString());

      this.barcodeNumber = parseInt(data);
      this.handleSubmit();
    });
  },
  methods: {
    onChange(input) {
      this.barcodeNumber = input;
    },
    onKeyPress(button) {
      console.log("button", button);
    },
    onInputChange(input) {
      this.barcodeNumber = input.target.value;
    },
    handleSubmit: function () {
      CONFIG.db.query(
        `SELECT * FROM drawers WHERE locker_id = ? AND barcode = ? AND status = ?`,
        [CONFIG.LOCKER_ID, this.barcodeNumber, 0],
        (err, res) => {
          if (err) return;

          this.barcodeNumber = null;

          if (res.length > 0) {
            const relayNumber = res[0].relay_number;

            HELPERS.handleOpeningDrawer(relayNumber, (err) => {
              if (err) {
                console.log("SYSTEM FAULT");
                return;
              }

              this.showDrawerCloseModal = true;

              HELPERS.pollSolenoidUntilClosed(relayNumber, (err, res) => {
                if (err) {
                  console.log("DRAWER CLOSE SYSTEM FAULT");
                  return;
                }

                if (res) {
                  this.showDrawerCloseModal = false;
                  console.log("CLOSED DRAWER");
                }
              });
            });
          }
        }
      );
    },
  },
};
</script>
