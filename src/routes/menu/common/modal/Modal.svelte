<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { expoOut } from "svelte/easing";

  export let title: string;
  export let visible: boolean;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("close");
    visible = false;
  }
</script>

{#if visible}
  <div class="modal-wrapper" transition:fade|global={{ duration: 250 }}>
    <div class="modal" transition:scale={{ duration: 500, easing: expoOut }}>
      <button class="button-modal-close" on:click={handleClick}>
        <img src="img/menu/icon-close.svg" alt="close" />
      </button>

      <div class="title">
        {title}
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba($background-color, 0.15);
    z-index: 99999;
    backdrop-filter: blur(15px);
  }

  .modal {
    background-color: rgba($background-color, $opacity);
    min-width: 500px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 25px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: $primary-shadow;
  }

  .title {
    color: $text-color;
    font-size: 34px;
    position: relative;
    width: max-content;
    margin-bottom: 25px;
  }

  .content {
    display: flex;
    flex-direction: column;
    row-gap: 40px;
  }

  .button-modal-close {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    top: 20px;
    right: 20px;
    position: fixed;
    transition: ease background-color 0.25s;

    &:hover {
      background-color: rgba($text-color, 0.1);
    }
  }

  @media screen and (max-width: 1366px) {
    .modal {
      zoom: 0.8;
    }
  }

  @media screen and (max-width: 1200px) {
    .modal {
      zoom: 0.5;
    }
  }

  @media screen and (max-height: 1100px) {
    .modal {
      zoom: 0.8;
    }
  }

  @media screen and (max-height: 700px) {
    .modal {
      zoom: 0.5;
    }
  }

  @media screen and (max-height: 540px) {
    .modal {
      zoom: 0.4;
    }
  }
</style>
