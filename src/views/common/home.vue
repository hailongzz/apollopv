<template>

</template>

<script>
  export default {
    beforeRouteEnter (to, from, next) {
      next (vm =>{
        console.log(vm.$router, 123321)
      })
    }
  }
</script>

