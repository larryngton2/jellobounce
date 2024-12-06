<script lang="ts">
  import { quintOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  export let closeOnInternalClick: boolean;

  let expanded = false;
  let selectElement: HTMLElement;
  let headerElement: HTMLElement;

  function handleWindowClick(e: MouseEvent) {
    if (!selectElement.contains(e.target as Node)) {
      expanded = false;
    }
  }

  function handleSelectClick(e: MouseEvent) {
    if (closeOnInternalClick) {
      expanded = !expanded;
    } else {
      if (!expanded) {
        expanded = true;
      } else {
        expanded = !headerElement.contains(e.target as Node);
      }
    }
  }
</script>

<svelte:window on:click={handleWindowClick} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="select"
  class:expanded
  bind:this={selectElement}
  on:click={handleSelectClick}
>
  <div class="header" bind:this={headerElement}>
    <span class="title">
      <slot name="title" />
    </span>
    <img src="img/menu/icon-select-arrow.svg" alt="expand" />
  </div>
  {#if expanded}
    <div
      class="options"
      transition:fade|global={{ duration: 150, easing: quintOut }}
    >
      <slot name="options"></slot>
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../../../../colors.scss";

  .select {
    cursor: pointer;
    min-width: 250px;
    position: relative;

    &.expanded {
      .header {
        border-radius: 12px;
      }
    }
  }

  .header {
    background-color: $misc-background-color;
    padding: 15px;
    display: flex;
    column-gap: 20px;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
    transition: ease 0.2s;
    z-index: 1;
    box-shadow: $primary-shadow;

    img {
      position: absolute;
      right: 7px;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(black, 0.25);
      padding: 15px 10px;
      box-shadow: $primary-shadow;
      border-radius: 7px;
    }

    &:hover {
      background-color: rgba($background-color, 0.45);
    }

    .title {
      color: white;
      font-size: 20px;
      font-weight: 400;

      span {
        font-weight: 600;
      }
    }
  }

  .options {
    position: absolute;
    z-index: 1000;
    width: 100%;
    border-radius: 12px;
    max-height: 75vh;
    overflow: auto;
    background-color: rgba($background-color, $opacity);
    margin-top: 10px;
    //border: $border-thing;
    box-shadow: $primary-shadow;
  }
</style>
