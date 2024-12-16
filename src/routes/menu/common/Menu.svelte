<script lang="ts">
  import Header from "./header/Header.svelte";
  import { scale } from "svelte/transition";
  import { onMount } from "svelte";
  import { expoOut } from "svelte/easing";

  const transitionDuration = 550; // TODO: suboptimal

  let ready = false;

  onMount(() => {
    setTimeout(() => {
      ready = true;
    }, transitionDuration);
  });
</script>

<div class="shaderfix"></div>
<div class="menu">
  {#if ready}
    <div transition:scale|global={{ duration: 500, easing: expoOut }}>
      <Header />
    </div>

    <div class="menu-wrapper">
      <slot />
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../../colors.scss" as *;

  .menu {
    padding: 45px;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .shaderfix {
    top: -500px;
    left: -500px;
    position: absolute;
    background-color: $shaderfix-color;
    width: 99999px;
    height: 99999px;
    z-index: -9999999;
  }

  .menu-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    will-change: transform;
  }

  @media screen and (max-width: 1366px) {
    .menu {
      zoom: 0.8;
      height: 125vh;
    }
  }

  @media screen and (max-width: 1200px) {
    .menu {
      zoom: 0.5;
      height: 200vh;
    }
  }

  @media screen and (max-height: 1100px) {
    .menu {
      zoom: 0.8;
      height: 125vh;
    }
  }

  @media screen and (max-height: 700px) {
    .menu {
      zoom: 0.5;
      height: 200vh;
    }
  }

  @media screen and (max-height: 540px) {
    .menu {
      zoom: 0.4;
      height: 250vh;
    }
  }
</style>
