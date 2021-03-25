<template>
  <h2>Select The Drawer Size</h2>

  <ul class="size-boxes">
    <li
      :class="`${sCount == 0 ? 'unavailable' : ''}`"
      @click="handleBtn('s', sCount)"
    >
      <span class="size-code">S</span>
      <div class="size-text">Small</div>
      <div class="dimensions">100x100x100mm</div>
    </li>
    <li
      :class="`${mCount == 0 ? 'unavailable' : ''}`"
      @click="handleBtn('m', mCount)"
    >
      <span class="size-code">M</span>
      <div class="size-text">Medium</div>
      <div class="dimensions">200x200x150mm</div>
    </li>
    <li
      :class="`${lCount == 0 ? 'unavailable' : ''}`"
      @click="handleBtn('l', lCount)"
    >
      <span class="size-code">L</span>
      <div class="size-text">Large</div>
      <div class="dimensions">300x300x250mm</div>
    </li>
    <li
      :class="`${xlCount == 0 ? 'unavailable' : ''}`"
      @click="handleBtn('xl', xlCount)"
    >
      <span class="size-code">XL</span>
      <div class="size-text">Extra Large</div>
      <div class="dimensions">400x400x400mm</div>
    </li>
  </ul>

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
ul.size-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 80%;
  margin: 200px auto 0 auto;
  grid-gap: 20px;
  align-content: center;
  justify-items: center;
}
ul.size-boxes li {
  background: linear-gradient(#eee, #ddd);
  background: #3c80ce;
  color: #fff;
  border: 1px solid #ebebeb;
  width: 100%;
  padding: 20px 0;
  border-radius: 10px;
  cursor: pointer;
}
ul.size-boxes li.unavailable {
  background-color: #000;
}
.size-code {
  display: block;
  font-family: "Courier New", Courier, monospace;
  font-size: 56px;
  margin-bottom: 20px;
}
.size-text,
.dimensions {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
}
.dimensions {
  margin-bottom: 0;
}
</style>

<script>
import * as CONFIG from "@/./config";
import * as HELPERS from "@/./helpers";

export default {
  name: "LeaveToRFIDUser/DrawerSize",
  data() {
    return {
      sCount: 0,
      mCount: 0,
      lCount: 0,
      xlCount: 0,
      modalShow: false,
      modalText: "ERROR",
    };
  },
  methods: {
    handleBtn: function (size, count) {
      this.modalText = "Processing...";
      this.modalShow = true;
      if (count <= 0) {
        this.modalText =
          "Black-colored drawers are unavailable. Please see later.";
        setTimeout(() => {
          this.modalShow = false;
        }, 3000);
        return;
      }

      // TODO: Open associated drawer and start package leaving procedure.
      // Get the drawer_id of available drawer.
      CONFIG.db.query(
        "SELECT * FROM drawers WHERE locker_id = ? AND status = ? AND size = ?",
        [CONFIG.LOCKER_ID, 0, size],
        (err, res) => {
          if (err) {
            this.modalText =
              "An internal system error occured. Please try again later.";
            setTimeout(() => {
              this.modalShow = false;
            }, 3000);
            return;
          }

          if (res.length <= 0) {
            this.modalText =
              "No available drawers can be found for this size. Please try again later.";
            setTimeout(() => {
              this.modalShow = false;
            }, 3000);
            return;
          }

          let drawerData = res[0];
          this.modalText = "Found an available drawer. Opening it...";

          HELPERS.handleOpeningDrawer(drawerData.relay_number, (err) => {
            if (err) {
              this.modalText =
                "An internal system error occured. Please try again later.";
              setTimeout(() => {
                this.modalShow = false;
              }, 3000);
              return;
            }

            this.modalText =
              "Opened the drawer. Please close it after leaving the package.";

            HELPERS.pollSolenoidUntilClosed(
              drawerData.relay_number,
              (err, res) => {
                if (err) {
                  this.modalText =
                    "An internal system error occured. Please try again later...";
                  setTimeout(() => {
                    this.modalShow = false;
                  }, 3000);
                  return;
                }

                if (res) {
                  this.modalText =
                    "Package is left successfully. Please wait...";

                  CONFIG.db.query(
                    "UPDATE drawers SET status = ?, barcode = ?, user_id = ?, rfid_user_id = ?, recipient_name = ?, recipient_email = ?, recipient_phone = ? WHERE locker_id = ? AND id = ?",
                    [
                      1,
                      0,
                      0,
                      this.$route.query.rfidUserId,
                      "",
                      "",
                      "",
                      CONFIG.LOCKER_ID,
                      drawerData.id,
                    ],
                    (err) => {
                      if (err) {
                        this.modalText =
                          "An internal system error occured. Please try again later...";
                        setTimeout(() => {
                          this.modalShow = false;
                        }, 3000);
                        return;
                      }

                      this.modalText =
                        "Sucessfully completed the leaving procedure. Have a nice day!";
                      setTimeout(() => {
                        this.modalShow = false;
                        this.$router.push("/");
                      }, 3000);
                    }
                  );
                }
              }
            );
          });
        }
      );

      //this.$router.push({ path: "/leave/name", query: { sizeCode: size } });
    },
  },
  beforeCreate() {
    CONFIG.db.query(
      `SELECT id, size FROM drawers WHERE locker_id = ? AND status = 0`,
      [CONFIG.LOCKER_ID],
      (err, res) => {
        if (err) return;
        if (res.length <= 0) return;

        res.forEach((item) => {
          switch (item["size"]) {
            case "s":
              this.sCount++;
              break;
            case "m":
              this.mCount++;
              break;
            case "l":
              this.lCount++;
              break;
            case "xl":
              this.xlCount++;
              break;
          }
        });
      }
    );
  },
};
</script>
