<script lang="ts">
    import {slide} from "svelte/transition";
    import {quintOut} from "svelte/easing";
    import {createEventDispatcher} from "svelte";
    import GenericSelect from "./GenericSelect.svelte";

    export let options: string[];
    export let values: string[];
    export let title: string;

    const dispatch = createEventDispatcher<{
        change: { values: string[] }
    }>();

    function handleOptionClick(o: string) {
        if (values.includes(o)) {
            values = values.filter(v => v !== o);
        } else {
            values = [...values, o]
        }
        dispatch("change", {values});
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<GenericSelect closeOnInternalClick={false}>
    <svelte:fragment slot="title">
        {title}
    </svelte:fragment>

    <svelte:fragment slot="options">
        {#each options as o}
            <div on:click={() => handleOptionClick(o)} class="option" class:active={values.includes(o)}
                 transition:slide|global={{ duration: 150, easing: quintOut }}>
                <span>{o}</span>
            </div>
        {/each}
    </svelte:fragment>
</GenericSelect>

<style lang="scss">
  @import "../../../../../colors.scss";

  .option {
    font-weight: 400;
    color: rgba(150,150,150);
    font-size: 20px;
    padding: 15px 20px;
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
    }
  }
</style>
