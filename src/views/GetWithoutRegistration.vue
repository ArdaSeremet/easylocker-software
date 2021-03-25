<template>
  <h2>Get Package</h2>

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

  <div class="modal-wrapper" v-if="modalShow">
    <div class="modal">
      {{ modalText }}
    </div>
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
  name: "GetWithoutRegistration",
  components: {
    SimpleKeyboard,
  },
  data() {
    return {
      barcodeNumber: null,
      modalShow: false,
      modalText: "Undefined",
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
      this.modalText = "Processing...";
      this.modalShow = true;

      CONFIG.db.query(
        `SELECT * FROM drawers WHERE locker_id = ? AND barcode = ? AND status = ?`,
        [CONFIG.LOCKER_ID, this.barcodeNumber, 2],
        (err, res) => {
          if (err) {
            this.modalText =
              "An internal server error occured. Please try again later.";
            setTimeout(() => {
              this.modalShow = false;
            }, 3000);
            return;
          }

          this.barcodeNumber = null;

          if (res.length <= 0) {
            this.modalText =
              "No pending packages are found for this barcode number.";
            setTimeout(() => {
              this.modalShow = false;
            }, 3000);
            return;
          }

          this.modalText = "Found a pending package...";

          const relayNumber = res[0].relay_number;
          const drawerId = res[0].id;

          HELPERS.handleOpeningDrawer(relayNumber, (err) => {
            if (err) {
              this.modalText =
                "Internal server error occured. Please try again later.";
              setTimeout(() => {
                this.modalShow = false;
              }, 3000);
              return;
            }

            this.modalText =
              "Opened the associated drawer. Please close it after you get the package.";

            HELPERS.pollSolenoidUntilClosed(relayNumber, (err, res) => {
              if (err) {
                this.modalText =
                  "Internal server error occured. Please try again later.";
                setTimeout(() => {
                  this.modalShow = false;
                }, 3000);
                return;
              }

              if (res) {
                this.modalText = "Processing...";

                CONFIG.db.query(
                  "UPDATE drawers SET status = ?, barcode = ?, recipient_name = ?, recipient_email = ?, recipient_phone = ? WHERE id = ?",
                  [0, 0, "", "", "", drawerId],
                  (err, res) => {
                    if (err) {
                      this.modalText =
                        "Internal server error occured. Please try again later.";
                      setTimeout(() => {
                        this.modalShow = false;
                      }, 3000);
                      return;
                    }

                    if (res) {
                      this.modalText =
                        "Thank you for choosing us. Have a nice day!";
                      setTimeout(() => {
                        this.modalShow = false;
                        this.$router.push("/");
                      }, 3000);
                    }
                  }
                );
              }
            });
          });
        }
      );
    },
  },
};
</script>
