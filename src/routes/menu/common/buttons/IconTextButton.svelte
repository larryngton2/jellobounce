<script lang="ts">
    import {createEventDispatcher} from "svelte";
       import {fly} from "svelte/transition";

    export let title: string;
    export let disabled = false;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button class="icon-text-button" on:click={() => dispatch("click")} {disabled} transition:fly|global={{duration: 350, y: 100}}>
    <div class="icon">
    </div>
    <div class="title">{title}</div>
</button>

<style lang="scss">
    @import "../../../../colors.scss";

    .icon-text-button {
      background-color: rgba($background-color, 0.5);
      display: flex;
      border: none;
      border-radius: 12px;
      align-items: center;
      overflow: hidden;
      background-size: 200% 100%;
      transition: ease .2s background-color;
      font-family: "sf-pro";
      height: 55px;
      border: solid 1px $border-thing;

      &:not([disabled]):hover {
        &:hover {
          cursor: pointer;
          background-color: $accent-color;
        }
      }

      &[disabled] {
        opacity: .6;
      }
    }

    .title {
      font-size: 21px;
      font-weight: 400;
      color: rgba($text-color, 0.8);
      padding: 30px 30px;
      text-align: center;
  }
</style>