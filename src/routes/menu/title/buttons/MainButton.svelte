<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { expoIn, expoOut } from "svelte/easing";

  export let title: string;
  export let icon: string;
  export let index: number;

  let hovered = false;

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="main-button"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:click={() => dispatch("click")}
  out:fly|global={{ duration: 500, y: 125, delay: index * 25, easing: expoOut }}
  in:fly|global={{ duration: 500, y: 125, delay: index * 25, easing: expoOut }}
>
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
    <div class="title">{title}</div>
  </div>

  <div class="wrapped-content">
    <slot parentHovered={hovered} />
  </div>
</div>

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .main-button {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    cursor: pointer;
    font-weight: normal;
    margin-right: 25px;
    scale: 70%;
    border-radius: 100%;

    &:hover {
      .icon {
        background-color: rgba(white, 0.5);
      }
    }
  }

  .icon {
    background-color: rgba($background-color, $opacity);
    width: 90px;
    height: 90px;
    border-radius: 100%;
    transition: ease background-color 0.2s;
    position: relative;
    align-items: center;
    //border: $border-thing;

    .title {
      position: fixed;
      font-size: 25px;
      top: 110%;
      color: rgba(white, 0.8);
      left: 50%;
      transform: translateX(-50%);
      text-shadow: $primary-shadow;
    }

    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 80%;
    }
  }
</style>
