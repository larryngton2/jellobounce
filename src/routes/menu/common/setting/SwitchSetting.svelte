<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: boolean;
  export let title: string;

  const dispatch = createEventDispatcher();
</script>

<div class="switch-setting">
  <label class="switch">
    <input
      type="checkbox"
      bind:checked={value}
      on:change={() => dispatch("change")}
    />
    <span class="button"></span>
  </label>

  <div class="title">{title}</div>
</div>

<style lang="scss">
  @use "sass:color";
  @use "../../../../colors.scss" as *;

  .switch-setting {
    display: flex;
    align-items: center;
  }

  .title {
    color: $text-color;
    font-size: 20px;
    font-weight: 400;
  }

  .button {
    position: absolute;
    top: 2px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $text-dimmed-color;
    transition: ease 0.25s;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .switch {
    position: relative;
    display: flex;
    width: 30px;
    height: 30px;
    align-items: center;
    cursor: pointer;
    margin: 0 10px;

    input {
      display: none;

      &:checked + .button {
        background-color: $accent-color;
        box-shadow: 0 0 25px rgba(black, 0.75);
      }
    }
  }
</style>
