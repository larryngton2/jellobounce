<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: boolean;
  export let name: string;

  const dispatch = createEventDispatcher();
</script>

<label class="switch-container">
  <div class="switch">
    <input
      type="checkbox"
      bind:checked={value}
      on:change={() => dispatch("change")}
    />
    <span class="slider"></span>
  </div>

  <div class="name">{name}</div>
</label>

<style lang="scss">
  @use "sass:color";
  @use "../../../../colors.scss" as *;

  .switch-container {
    display: flex;
    align-items: center;
  }

  .name {
    font-weight: 500;
    color: $text-color;
    font-size: 12px;
    margin-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .slider {
    position: absolute;
    top: 2px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $text-dimmed-color;
    transition: ease 0.25s;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .switch {
    position: relative;
    width: 15px;
    height: 12px;

    input {
      display: none;
    }

    input:checked + .slider {
      background-color: $setting-color;
      box-shadow: 0 0 17px rgba(black, 0.75);
    }
  }
</style>
