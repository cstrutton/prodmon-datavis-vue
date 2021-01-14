<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
      <ul>
        <li v-for='machine in machines' :key='machine'>
          {{machine}}
          <input>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'myStore',
  data () {
    return {
      msg: 'Machines List2'
    }
  },
  computed: {
    machines() {
      console.log(this.$store.state.machines)
      return this.$store.state.machines
    }
  },
  mounted() {
    this.$store.dispatch("getMachines");
    // console.log(this.machines)
  }
}
</script>