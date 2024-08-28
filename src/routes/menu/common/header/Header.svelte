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
    margin-bottom: 60px;
    align-items: center;
    z-index: 1;

    .notifications {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>