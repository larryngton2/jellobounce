<script lang="ts">
  import type { ConfigurableSetting, Module } from "../../integration/types";
  import { getModuleSettings, setModuleEnabled } from "../../integration/rest";
  import { listen } from "../../integration/ws";
  import type {
    ClickGuiValueChangeEvent,
    KeyboardKeyEvent,
    ModuleToggleEvent,
  } from "../../integration/events";
  import { highlightModuleName } from "./clickgui_store";
  import { onMount } from "svelte";
  import {
    convertToSpacedString,
    spaceSeperatedNames,
  } from "../../theme/theme_config";
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  export let modules: Module[];

  let resultElements: HTMLElement[] = [];
  let searchContainerElement: HTMLElement;
  let autoFocus: boolean = true;
  let searchInputElement: HTMLElement;
  let query: string;
  let filteredModules: Module[] = [];
  let selectedIndex = 0;

  function reset() {
    filteredModules = [];
    query = "";
    $highlightModuleName = null;
  }

  function filterModules() {
    if (!query) {
      reset();
      return;
    }

    selectedIndex = 0;

    filteredModules = modules.filter(
      (m) =>
        m.name
          .toLowerCase()
          .includes(query.toLowerCase().replaceAll(" ", "")) ||
        m.aliases.some((a) =>
          a.toLowerCase().includes(query.toLowerCase().replaceAll(" ", "")),
        ),
    );
  }

  async function handleKeyDown(e: KeyboardKeyEvent) {
    if (filteredModules.length === 0 || e.action === 0) {
      return;
    }

    switch (e.keyCode) {
      case 264:
        selectedIndex = (selectedIndex + 1) % filteredModules.length;
        break;
      case 265:
        selectedIndex =
          (selectedIndex - 1 + filteredModules.length) % filteredModules.length;
        break;
      case 257:
        await toggleModule(
          filteredModules[selectedIndex].name,
          !filteredModules[selectedIndex].enabled,
        );
        break;
      case 258:
        const m = filteredModules[selectedIndex]?.name;
        if (m) {
          $highlightModuleName = m;
        }
        break;
    }

    resultElements[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  function handleBrowserKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Tab") {
      e.preventDefault();
    }
  }

  async function toggleModule(name: string, enabled: boolean) {
    await setModuleEnabled(name, enabled);
  }

  function handleWindowClick(e: MouseEvent) {
    if (!searchContainerElement.contains(e.target as Node)) {
      reset();
    }
  }

  function handleWindowKeyDown() {
    if (document.activeElement !== document.body) {
      return;
    }

    if (autoFocus) {
      searchInputElement.focus();
    }
  }

  function applyValues(configurable: ConfigurableSetting) {
    autoFocus =
      (configurable.value.find((v) => v.name === "SearchBarAutoFocus")
        ?.value as boolean) ?? true;
  }

  onMount(async () => {
    const clickGuiSettings = await getModuleSettings("ClickGUI");
    applyValues(clickGuiSettings);
    if (autoFocus) {
      searchInputElement.focus();
    }
  });

  listen("moduleToggle", (e: ModuleToggleEvent) => {
    const mod = filteredModules.find((m) => m.name === e.moduleName);
    if (!mod) {
      return;
    }
    mod.enabled = e.enabled;
    filteredModules = filteredModules;
  });

  listen("keyboardKey", handleKeyDown);

  listen("clickGuiValueChange", (e: ClickGuiValueChangeEvent) => {
    applyValues(e.configurable);
  });
</script>

<svelte:window
  on:click={handleWindowClick}
  on:keydown={handleWindowKeyDown}
  on:contextmenu={handleWindowClick}
/>

<div
  class="search"
  class:has-results={query}
  bind:this={searchContainerElement}
  transition:fade|global={{ duration: 200, easing: quintOut }}
>
  <input
    type="text"
    class="search-input"
    placeholder="Search"
    spellcheck="false"
    bind:value={query}
    bind:this={searchInputElement}
    on:input={filterModules}
    on:keydown={handleBrowserKeyDown}
  />

  {#if query}
    <div class="results" transition:fade={{ duration: 100 }}>
      {#if filteredModules.length > 0}
        {#each filteredModules as { name, enabled, aliases }, index (name)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="result"
            class:enabled
            on:click={() =>
              setModuleEnabled(name, !enabled).then(() => (enabled = true))}
            on:contextmenu|preventDefault={() => ($highlightModuleName = name)}
            class:selected={selectedIndex === index}
            bind:this={resultElements[index]}
          >
            <div class="module-name">
              {$spaceSeperatedNames ? convertToSpacedString(name) : name}
            </div>
            <div class="aliases">
              {#if aliases.length > 0}
                (aka {aliases
                  .map((a) =>
                    $spaceSeperatedNames ? convertToSpacedString(a) : a,
                  )
                  .join(", ")})
              {/if}
            </div>
          </div>
        {/each}
      {:else}
        <div class="placeholder">No modules found</div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../colors.scss";

  .search {
    position: fixed;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
    width: 600px;
    border-radius: 50px;
    overflow: hidden;
    transition: ease border-radius 0.2s;
    box-shadow: $primary-shadow;
    background-image: linear-gradient(
      rgba($background-color, 0.6),
      rgba($background-color, 0.5),
      rgba($background-color, 0.45)
    );

    &.has-results {
      border-radius: 12px;
    }

    &:focus-within {
      z-index: 9999999999;
    }
  }

  .results {
    padding: 5px 25px;
    max-height: 250px;
    overflow: auto;

    .result {
      font-size: 16px;
      padding: 10px 0;
      transition: ease padding-left 0.2s;
      cursor: pointer;
      display: grid;
      grid-template-columns: max-content 1fr max-content;

      .module-name {
        position: relative;
        color: rgba(150, 150, 150);
        transition: color 0.2s ease;
      }

      &.enabled {
        .module-name {
          color: white;
          text-shadow: 0px 0px 20px gray;
        }
      }

      .aliases {
        color: rgba($text-dimmed-color, 0.6);
        margin-left: 10px;
      }

      font-size: 16px;
      padding: 10px 0;
      transition: ease padding-left 0.2s;
      cursor: pointer;
      display: grid;
      grid-template-columns: max-content 1fr max-content;

      &.selected {
        padding-left: 10px;
      }

      .module-name::after {
        width: calc(100% + 8px);
      }

      &:hover {
        color: $text-color;

        &::after {
          content: "Right-click to locate";
          color: rgba($text-color, 0.4);
          font-size: 12px;
        }
      }
    }

    .placeholder {
      color: $text-dimmed-color;
      font-size: 16px;
      padding: 10px 0;
    }

    &::-webkit-scrollbar {
      width: 0;
    }
  }

  .search-input {
    padding: 15px 25px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: $text-color;
    width: 100%;
  }
</style>
