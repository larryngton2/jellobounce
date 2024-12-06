<script lang="ts">
  import { fade } from "svelte/transition";
  import { afterUpdate } from "svelte";

  export let text: string;

  let element: HTMLElement;
  let shown = false;

  afterUpdate(() => {
    element?.parentNode?.addEventListener("mouseenter", (e) => {
      shown = true;
    });

    element?.parentNode?.addEventListener("mouseleave", (e) => {
      shown = false;
    });
  });
</script>

<div bind:this={element}>
  {#if shown}
    <div transition:fade={{ duration: 100 }} class="tooltip">
      {text}
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../../colors.scss";

  .tooltip {
    background-color: $accent-color;
    color: white;
    padding: 7px 10px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    position: absolute;
    white-space: nowrap;
    left: 50%;
    top: 0;
    transform: translate(-50%, -45px);
    z-index: 1000;
    box-shadow: $primary-shadow;

    &::after {
      content: "";
      display: block;
      height: 7px;
      width: 7px;
      background-color: inherit;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 2px) rotate(45deg);
    }
  }
</style>
