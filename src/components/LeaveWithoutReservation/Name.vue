<template>
<h2>Recipient Name</h2>

<div class="input-group">
    <input @input="onInputChange" type="text" v-model="name" placeholder="Name" name="name">
    <button v-on:click="handleSubmit()">Continue To Next Step</button>
    <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="name"/>
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
    background-color: #FFF;
    border: 1px solid #EBEBEB;
    font-size: 60px;
    text-align: center;
    letter-spacing: 20px;
}

.input-group button {
    border: 1px solid #EBEBEB;
    border-radius: 0 0 5px 5px;
    border-top: 0;
    background-color: #222;
    color: #FFF;
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
import SimpleKeyboard from '@/components/SimpleKeyboard.vue'

export default {
    name: 'Leave/Name',
    components: {
        SimpleKeyboard
    },
    data() {
        return {
            name: ''
        }
    },
    methods: {
        onChange(input) {
          this.name = input;
        },
        onKeyPress(button) {
          console.log("button", button);
        },
        onInputChange(input) {
          this.name = input.target.value;
        },
        handleSubmit() {
            if(this.name.length <= 0) return

            this.$router.push({ path: '/leave/email', query: { sizeCode: this.$route.query.sizeCode, name: this.name } })
        }
    },
    mounted() {
        console.log(this.$route.query.sizeCode)
    }
}
</script>
