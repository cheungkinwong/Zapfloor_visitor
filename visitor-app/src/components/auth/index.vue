<template>
  <div>
    {{token}}
    <slot v-if="!token || (token && location && user)"></slot>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("auth", {
      loggedIn: "isLoggedIn",
      location: "getCurrentLocation",
      user: "getCurrentUser",
      loginError: "login_error",
      account: "getCurrentAccount"
    }),
    token() {
      return this.$auth_token || this.$store.getters["auth/get_token"];
    },
    locationId() {
      return (
        this.$location_id || this.$store.getters["auth/getCurrentLocation"]
      );
    },
    created() {
      if (this.token) {
        console.log("create login token location_id==", this.$location_id);
        let data = { token: this.token, locationId: this.locationId };
        this.tokenLogin(data);
      }
    },
  },
  watch: {
    loggedIn: {
      handler: function(loggedIn) {
        this.validateLoggedIn(loggedIn, !this.$iFrame);
      },
      immediate: true
    },
    // account: {
    //   handler: function() {
    //     this.initPusher();
    //   },
    //   immediate: true
    // }
  },

  methods: {
    ...mapActions("auth", ["tokenLogin"]),
    validateLoggedIn(loggedIn, allowedDashboard) {
      if (loggedIn === true) {
        this.initPusher();
        let currentUrl = this.$route.query.currentUrl;
        if (
          !_.isEmpty(currentUrl) &&
          currentUrl != "undefined" &&
          !/login|logout/i.test(currentUrl || "")
        ) {
          this.$router.push(currentUrl);
        } else if (allowedDashboard) {
          this.$router.push("/dashboard");
        }
      } else {
        if (this.$route)
          this.$router.push(
            "/login?currentUrl=" + encodeURIComponent(this.$route.fullPath)
          );
      }
    },
    // initPusher() {
    //   if (!_.isEmpty(this.account))
    //     this.$pusher.subscribe(
    //       "resource_action_notifications_" + this.account.id
    //     );
    // }
  }
}
</script>
