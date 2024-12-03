<script lang="ts">
  import { listen } from "../../../../integration/ws";
  import type { KeyEvent } from "../../../../integration/events";
  import type { MinecraftKeybind } from "../../../../integration/types";

  export let gridArea: string;
  export let key: MinecraftKeybind | undefined;

  let active = false;

  listen("key", (e: KeyEvent) => {
    if (e.key !== key?.key.translationKey) {
      return;
    }

    active = e.action === 1 || e.action === 2;
  });
</script>

<div class="key" style="grid-area: {gridArea};" class:active>
  {key?.key.localized ?? "???"}
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .key {
    height: 35px;
    background-color: rgba($background-color, $opacity);
    color: $text-color;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    font-size: 14px;
    font-weight: 500;
    transition:
      ease scale 0.1s,
      ease background-color 0.2s;
    position: relative;
    text-align: center;
    box-shadow: $primary-shadow;
    //border: $border-thing;
    text-shadow: $primary-shadow;

    &.active {
      background-color: rgba($accent-color, 0.7);
      scale: 95%;
      align-self: center;
      color: $text-dimmed-color;
    }
  }
</style>
