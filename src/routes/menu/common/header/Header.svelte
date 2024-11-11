<script lang="ts">
  import Notifications from "./Notifications.svelte";
</script>

<div class="header">
  <div class="notifications">
    <Notifications />
  </div>
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;

    .notifications {
      position: fixed;
      left: 50%;
      bottom: 50px;
      transform: translateX(-50%);
      z-index: 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
    }
  }
</style>
