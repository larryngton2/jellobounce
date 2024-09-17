<script lang="ts">
  import {fade} from "svelte/transition";
  import {description, type TDescription} from "./clickgui_store";

  let data: TDescription | null = null;

  description.subscribe((v) => {
      data = v;
  });
</script>

{#key data}
  {#if data !== null}
      <div transition:fade|global={{duration: 150}} class="description-wrapper"
           style="top: {data.y}px; left: {data.x + 10}px;">
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
  z-index: 999999999999; //silly
  transform: translateY(-50%);
}

.description {
  position: relative;
  border-radius: 12px;
  background-color: $accent-color;
  filter: drop-shadow(0 0 10px rgba($background-color, 0.1));

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
}
</style>