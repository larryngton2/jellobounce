<script lang="ts">
    import {slide} from "svelte/transition";
    import {quintOut} from "svelte/easing";
    import {createEventDispatcher} from "svelte";
    import GenericSelect from "./GenericSelect.svelte";

    export let options: string[];
    export let value: string;
    export let title: string;

    const dispatch = createEventDispatcher<{
        change: { value: string }
    }>();

    function handleOptionClick(o: string) {
        value = o;
        dispatch("change", {value: o});
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<GenericSelect closeOnInternalClick={true}>
    <span slot="title"><span class="title">{title}</span> {value}</span>

    <svelte:fragment slot="options">
        {#each options as o}
            <div on:click={() => handleOptionClick(o)} class="option" class:active={o === value}
                 transition:slide|global={{ duration: 150, easing: quintOut }}>{o}</div>
        {/each}
    </svelte:fragment>
</GenericSelect>

<style lang="scss">
  @import "../../../../../colors.scss";

  .title {
    font-weight: 600;
  }

  .option {
    font-weight: 400;
    color: rgba(150,150,150);
    font-size: 20px;
    padding: 10px 15px;
    transition: ease color .2s;
    font-family: "sf-pro";
    z-index: 1;

    &:hover {
      background-color: rgba($background-color, 0.1);
      color: gray;
    }

    &.active {
      color: white;
      text-shadow: 0px 0px 20px gray;
      background-color: rgba($background-color, 0.4);
      border-radius: 12px;
      margin: 5px;
    }
  }
</style>
