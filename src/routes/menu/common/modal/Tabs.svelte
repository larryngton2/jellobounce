<script lang="ts">
  import { type ComponentType, createEventDispatcher } from "svelte";

  let availableTabsElement: HTMLElement | undefined;

  export let tabs: {
    title: string;
    icon: string;
    component: ComponentType;
  }[];
  export let activeTab = 0;

  const dispatch = createEventDispatcher<{
    changeTab: { activeTab: number };
  }>();

  function setActiveTab(i: number) {
    activeTab = i;
    dispatch("changeTab", { activeTab });
  }
</script>

<div class="tabs">
  <div class="available-tabs" bind:this={availableTabsElement}>
    {#each tabs as { title, icon }, index}
      <button
        class="tab-button"
        class:active={tabs[activeTab].title === title}
        on:click={() => setActiveTab(index)}
      >
        <img class="icon" src="img/menu/altmanager/{icon}" alt={title} />
        <span>{title}</span>
      </button>
    {/each}
  </div>

  <div style="width: {availableTabsElement?.clientWidth}px">
    <svelte:component this={tabs[activeTab].component} />
  </div>
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .available-tabs {
    display: flex;
    column-gap: 10px;
    margin-bottom: 25px;
  }

  .tab-button {
    background-color: rgba($background-color, 0.25);
    color: $text-color;
    padding: 10px;
    border: solid 1px transparent;
    border-radius: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 10px;
    cursor: pointer;
    transition:
      ease border-color 0.2s,
      ease background-color 0.2s;
    box-shadow: $primary-shadow;

    .icon {
      height: 30px;
    }

    &.active,
    &:hover {
      background-color: rgba($background-color, 0.35);
    }
  }
</style>
