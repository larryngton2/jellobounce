<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let value: boolean;
    export let name: string;

    const dispatch = createEventDispatcher();
</script>

<label class="switch-container">
    <div class="switch">
        <input type="checkbox" bind:checked={value} on:change={() => dispatch("change")}/>
        <span class="slider"></span>
    </div>

    <div class="name">{name}</div>
</label>

<style lang="scss">
  @use "sass:color";
  @import "../../../../colors.scss";

  .switch-container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .name {
    font-weight: 500;
    color: $text-color;
    font-size: 12px;
    margin-left: 7px;
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
    background-color: darken($text-color, 55%);
    transition: ease 0.4s;
    height: 8px;
    border-radius: 4px;

    &::before {
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      top: -2px;
      left: 0;
      background-color: $text-color;
      transition: ease 0.4s;
      border-radius: 50%;
    }
  }

  .switch {
    position: relative;
    width: 22px;
    height: 12px;

    input {
      display: none;
    }

    input:checked + .slider {
      background-color: color.scale(
                      desaturate($accent-color, 60%),
              $lightness: -15%
      );
    }

    input:checked + .slider:before {
      transform: translateX(10px);
      background-color: rgba($accent-color, 0.7);
    }
  }
</style>
