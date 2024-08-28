<script lang="ts">
    import {fade} from "svelte/transition";
    import {afterUpdate} from "svelte";

    export let text: string;
    export let color = "#2e2e2e";

    let element: HTMLElement;
    let shown = false;

    afterUpdate(() => {
        element?.parentNode?.addEventListener("mouseenter", e => {
            shown = true;
        });

        element?.parentNode?.addEventListener("mouseleave", e => {
            shown = false;
        });
    });
</script>

<div bind:this={element}>
    {#if shown}
        <div transition:fade="{{duration: 100}}" class="tooltip" style="background-color: {color};">{text}</div>
    {/if}
</div>

<style lang="scss">
  @import "../../../colors.scss";

  .tooltip {
    color: white;
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;
    position: absolute;
    white-space: nowrap;
    left: 50%;
    top: 0;
    transform: translate(-50%, -45px);
    z-index: 1000;
    box-shadow: 0 0 10px rgba($shadow-color, 0.5);
    font-family: "sf-pro";

    &::after {
      content: "";
      display: block;
      height: 12px;
      width: 12px;
      background-color: inherit;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 2px) rotate(45deg);
    }
  }
</style>
