<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { GroupedModules } from "../../integration/types";
    import Module from "./Module.svelte";

    export let categories: GroupedModules;

    let panelElement: HTMLElement;
    let panelTop = 100;
    let panelLeft = 100;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let isResizing = false;
    export let panelWidth = 1500;
    let panelHeight = 750;
    let selectedCategory = Object.keys(categories)[0];

    function savePanelSettings() {
        localStorage.setItem("panelWidth", panelWidth.toString());
        localStorage.setItem("panelHeight", panelHeight.toString());
        localStorage.setItem("panelLeft", panelLeft.toString());
        localStorage.setItem("panelTop", panelTop.toString());
    }

    function selectCategory(category: string) {
        selectedCategory = category;
        savePanelSettings(); // Save immediately when category changes
    }

    // Load saved dimensions on mount
    onMount(() => {
        const savedWidth = localStorage.getItem("panelWidth");
        const savedHeight = localStorage.getItem("panelHeight");
        const savedLeft = localStorage.getItem("panelLeft");
        const savedTop = localStorage.getItem("panelTop");

        if (savedWidth) panelWidth = parseInt(savedWidth);
        if (savedHeight) panelHeight = parseInt(savedHeight);
        if (savedLeft) panelLeft = parseInt(savedLeft);
        if (savedTop) panelTop = parseInt(savedTop);
    });

    // Remove the event listener on component destroy
    onDestroy(() => {
        savePanelSettings();
        window.removeEventListener("beforeunload", savePanelSettings);
    });

    function onMouseDown(event: MouseEvent) {
        isDragging = true;
        startX = event.clientX - panelLeft;
        startY = event.clientY - panelTop;
    }

    function onMouseMove(event: MouseEvent) {
        if (isDragging) {
            panelLeft = event.clientX - startX;
            panelTop = event.clientY - startY;
        } else if (isResizing) {
            panelWidth = Math.max(200, event.clientX - panelLeft);
            panelHeight = Math.max(150, event.clientY - panelTop);
        }
    }

    function onMouseUp() {
        isDragging = false;
        isResizing = false;
    }

    function onResizeMouseDown(event: MouseEvent) {
        isResizing = true;
        event.stopPropagation();
    }
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="panel-container"
    style="top: {panelTop}px; left: {panelLeft}px; width: {panelWidth}px; height: {panelHeight}px"
    bind:this={panelElement}
    on:mousedown={onMouseDown}
>
    <!-- Sidebar with category names, scrollable if overflowed -->
    <div class="sidebar">
        <!-- Adjust for padding -->
        {#each Object.keys(categories) as category}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="category-item {category === selectedCategory
                    ? 'active'
                    : ''}"
                on:click={() => selectCategory(category)}
            >
                <img
                    class="icon"
                    src="img/clickgui/icon-{category.toLowerCase()}.svg"
                    alt="icon"
                />
                <div class="text">{category}</div>
            </div>
        {/each}
    </div>

    <div class="modules-panel">
        {#if selectedCategory}
            <div class="panel">
                <div class="title">ClickGUI</div>
                <div class="modules">
                    {#each categories[selectedCategory] as { name, enabled, description, aliases } (name)}
                        <Module {name} {enabled} {description} {aliases} />
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="resize-handle" on:mousedown={onResizeMouseDown} />
</div>

<style lang="scss">
    @import "../../colors.scss";
    .panel-container {
        position: absolute;
        display: flex;
        flex-direction: row;
        gap: 16px;
        cursor: move;
    }
    .sidebar {
        width: 150px;
        background-color: rgba($background-color, $opacity);
        padding: 10px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        overflow-y: auto;
        box-shadow: $primary-shadow;
    }
    .category-item {
        color: $text-dimmed-color;
        padding: 8px;
        cursor: pointer;
        border-radius: 7px;
        text-align: center;
        transition: background-color 0.2s ease;
        background-color: rgba($background-color, 0.15);
    }
    .category-item:hover {
        background-color: rgba(0, 0, 0, 0.25);
    }
    .category-item.active {
        background-color: rgba(0, 0, 0, 0.35);
    }
    .modules-panel {
        flex: 1;
    }
    .panel {
        border-radius: 12px;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        box-shadow: $primary-shadow;
    }
    .title {
        background-color: rgba($background-color, $opacity);
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        cursor: pointer;
        text-align: center;
    }
    .modules {
        overflow-y: auto;
        background-color: rgba(black, 0.45);
    }
    .resize-handle {
        width: 15px;
        height: 15px;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: nwse-resize;
        border-radius: 100%;
        background-image: linear-gradient(
            to bottom right,
            transparent,
            transparent,
            $accent-color
        );
    }
</style>
