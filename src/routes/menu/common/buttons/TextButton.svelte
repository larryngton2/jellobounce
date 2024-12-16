<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { expoOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  export let title: string;
  export let disabled = false;

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
  class="icon-text-button"
  on:click={() => dispatch("click")}
  {disabled}
  transition:fly|global={{ duration: 500, y: 100, easing: expoOut }}
>
  <div class="icon"></div>
  <div class="title">{title}</div>
</button>

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .icon-text-button {
    background-color: rgba($background-color, $opacity);
    display: flex;
    border: none;
    border-radius: 12px;
    align-items: center;
    overflow: hidden;
    transition: ease 0.2s background-color;
    //border: $border-thing;
    box-shadow: $primary-shadow;

    &:not([disabled]):hover {
      &:hover {
        cursor: pointer;
        background-color: rgba($accent-color, 0.7);
      }
    }

    &[disabled] {
      opacity: $opacity;
    }
  }

  .title {
    font-size: 21px;
    font-weight: 400;
    color: rgba($text-color, 0.8);
    padding: 10px 25px;
    text-align: center;
  }
</style>
