<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CircleLoader from "../CircleLoader.svelte";

  export let title: string;
  export let disabled = false;
  export let secondary = false;
  export let inset = false;
  export let listenForEnter = false;
  export let loading = false;

  const dispatch = createEventDispatcher();

  function handleKeyDown(e: KeyboardEvent) {
    if (!listenForEnter) {
      return;
    }
    if (e.key === "Enter") {
      dispatch("click");
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<button
  class="button-setting"
  class:inset
  type="button"
  on:click={() => dispatch("click")}
  {disabled}
  class:secondary
>
  {#if loading}
    <CircleLoader />
  {/if}
  {title}
</button>

<style lang="scss">
  @import "../../../../colors.scss";

  .button-setting {
    position: relative;
    border: none;
    background-color: $misc-background-color;
    color: $text-color;
    padding: 15px;
    border-radius: 12px;
    font-size: 20px;
    transition:
      ease background-color 0.2s,
      ease opacity 0.2s;
    font-weight: 600;
    box-shadow: $primary-shadow;

    &.inset {
      margin: 0 30px;
    }

    &.secondary {
      background-color: rgba($background-color, 0.25);
    }

    &:not([disabled]):hover {
      background-color: rgba($background-color, 0.45);
      cursor: pointer;

      &.secondary {
        background-color: rgba($background-color, 0.5);
      }
    }

    &[disabled] {
      opacity: 0.6;
    }
  }
</style>
