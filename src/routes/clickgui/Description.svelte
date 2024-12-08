<script lang="ts">
  import { fade } from "svelte/transition";
  import { description, type TDescription } from "./clickgui_store";
  import { onMount, onDestroy } from "svelte";

  let data: TDescription | null = null;
  let cursorX = 0;
  let cursorY = 0;

  description.subscribe((v) => {
    data = v;
  });

  function handleMouseMove(event: MouseEvent) {
    cursorX = event.clientX;
    cursorY = event.clientY;
  }

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
  });

  onDestroy(() => {
    window.removeEventListener("mousemove", handleMouseMove);
  });
</script>

{#key data}
  {#if data !== null}
    <div
      transition:fade|global={{ duration: 150 }}
      class="description-wrapper"
      style="top: {cursorY + 10}px; left: {cursorX + 10}px;"
    >
      <div class="description">
        <div class="text">{data.description}</div>
      </div>
    </div>
  {/if}
{/key}

<style lang="scss">
  @import "../../colors.scss";

  .description-wrapper {
    position: fixed;
    z-index: 999999999999; // high value to ensure it appears on top
    transform: translateY(-50%);
    pointer-events: none;
  }

  .description {
    position: relative;
    border-radius: 12px;
    background-color: $accent-color;
    filter: drop-shadow($primary-shadow);
    left: 15px;
    pointer-events: none;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-right: 5px solid $accent-color;
      left: -5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .text {
    font-size: 12px;
    padding: 7px;
    color: $text-color;
    pointer-events: none;
  }
</style>
