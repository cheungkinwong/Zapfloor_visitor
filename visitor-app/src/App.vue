<template>
  <auth>
    <router-view :key="$route.fullPath"></router-view>
  </auth>
      <!-- <router-view :key="$route.fullPath"></router-view> -->
</template>

<script>
import Auth from "@/components/auth";
import isEmpty from "lodash/isEmpty";
export default {
  name: "app",
  created() {

  },
  components: {
    auth: Auth
  },
};
</script>

<style lang="scss">
</style>
