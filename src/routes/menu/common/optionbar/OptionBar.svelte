<script lang="ts">
    import {fly} from "svelte/transition";
</script>

<div class="option-bar" transition:fly|global={{duration: 500, x: 1000}}>
    <slot />
</div>

<style lang="scss">
    @import "../../../../colors";

    .option-bar {
      background-color: rgba($background-color, $opacity);
      padding: 15px 30px;
      display: flex;
      border-radius: 12px;
      align-items: center;
      column-gap: 30px;
      margin-bottom: 25px;
      //border: $border-thing;
      margin-top: -60px;
    }
</style>