<template>
  <div class="about">
    <img alt="Vue logo" src="../assets/logo.png">
    <MyStore/>
  </div>
</template>

<script>
// @ is an alias to /src
import MyStore from '@/components/MyStore.vue'

export default {
  name: 'Home',
  components: {
    MyStore
  }
}
</script>
