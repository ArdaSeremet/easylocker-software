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
</template>

<style scoped>
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

export default {
  name: "Leave/DrawerSize",
  data() {
    return {
      sCount: 0,
      mCount: 0,
      lCount: 0,
      xlCount: 0,
    };
  },
  methods: {
    handleBtn: function (size, count) {
      if (count <= 0) return;

      this.$router.push({ path: "/leave/name", query: { sizeCode: size } });
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
