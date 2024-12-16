<script lang="ts">
  import ToolTip from "../ToolTip.svelte";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let title: string;
  export let icon: string;

  let hovered = false;

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="icon-button"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:click={() => dispatch("click")}
>
  <ToolTip text={title} />

  <div class="icon">
    {#if !hovered}
      <img
        transition:fade={{ duration: 200 }}
        src="img/menu/icon-{icon}.svg"
        alt={icon}
      />
    {:else}
      <img
        transition:fade={{ duration: 200 }}
        src="img/menu/icon-{icon}-hover.svg"
        alt={icon}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .icon-button {
    position: relative;
  }

  .icon {
    height: 58px;
    width: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
