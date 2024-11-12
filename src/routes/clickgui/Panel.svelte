<script lang="ts">
    import { onMount, onDestroy, beforeUpdate } from "svelte";
    import type {
        GroupedModules,
        Module as TModule,
    } from "../../integration/types";
    import Module from "./Module.svelte";
    import { listen } from "../../integration/ws";
    import { setItem } from "../../integration/persistent_storage";
    import { scaleFactor, maxPanelZIndex } from "./clickgui_store";
    import { browserReload, getClientUpdate } from "../../integration/rest";

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

    const panelConfig: PanelConfig = loadPanelConfig();

    async function savePanelConfig() {
        await setItem(
            `clickgui.panel.${selectedCategory}`,
            JSON.stringify(panelConfig),
        );
    }

    interface PanelConfig {
        top: number;
        left: number;
        width: number;
        height: number;
        expanded?: boolean;
        scrollTop: number;
        zIndex?: number;
    }

    function loadPanelConfig(): PanelConfig {
        const savedConfig = localStorage.getItem(
            `clickgui.panel.${selectedCategory}`,
        );
        if (savedConfig) {
            const config = JSON.parse(savedConfig) as Partial<PanelConfig>;

            return {
                top: config.top ?? panelTop,
                left: config.left ?? panelLeft,
                width: config.width ?? panelWidth,
                height: config.height ?? panelHeight,
                expanded: config.expanded ?? false,
                scrollTop: config.scrollTop ?? 0,
                zIndex: config.zIndex ?? 0,
            };
        }
        return {
            top: panelTop,
            left: panelLeft,
            width: panelWidth,
            height: panelHeight,
            expanded: false,
            scrollTop: 0,
            zIndex: 0,
        };
    }

    function fixPosition() {
        panelConfig.left = Math.max(
            0,
            Math.min(
                panelConfig.left,
                document.documentElement.clientWidth - panelElement.offsetWidth,
            ),
        );
        panelConfig.top = Math.max(
            0,
            Math.min(
                panelConfig.top,
                document.documentElement.clientHeight -
                    panelElement.offsetHeight,
            ),
        );
    }

    function onMouseDown(event: MouseEvent) {
        isDragging = true;
        startX = event.clientX - panelConfig.left;
        startY = event.clientY - panelConfig.top;
        panelConfig.zIndex = ++$maxPanelZIndex;
        savePanelConfig();
    }

    function onMouseMove(event: MouseEvent) {
        if (isDragging) {
            panelConfig.left = event.clientX - startX;
            panelConfig.top = event.clientY - startY;
            fixPosition();
            savePanelConfig();
        } else if (isResizing) {
            panelConfig.width = Math.max(200, event.clientX - panelConfig.left);
            panelConfig.height = Math.max(150, event.clientY - panelConfig.top);
            savePanelConfig();
        }
    }

    function onMouseUp() {
        isDragging = false;
        isResizing = false;
    }

    function toggleExpanded() {
        panelConfig.expanded = !panelConfig.expanded;
        savePanelConfig();
    }

    function selectCategory(category: string) {
        selectedCategory = category;
        panelConfig.scrollTop = 0;
        savePanelConfig();
    }

    function handleModulesScroll() {
        panelConfig.scrollTop = panelElement.scrollTop;
        savePanelConfig();
    }

    // Listen for module enable/disable events and update the module state
    listen("toggleModule", (e: { moduleName: string; enabled: boolean }) => {
        const module = categories[selectedCategory].find(
            (mod: TModule) => mod.name === e.moduleName,
        );
        if (module) {
            module.enabled = e.enabled;
            savePanelConfig();
            browserReload;
        }
    });

    onMount(() => {
        panelTop = panelConfig.top;
        panelLeft = panelConfig.left;
        panelWidth = panelConfig.width;
        panelHeight = panelConfig.height;

        setTimeout(() => {
            if (panelElement) {
                panelElement.scrollTo({
                    top: panelConfig.scrollTop,
                    behavior: "smooth",
                });
            }
        }, 500);
    });

    onDestroy(() => {
        savePanelConfig();
        window.removeEventListener("beforeunload", savePanelConfig);
    });

    function onResizeMouseDown(
        event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement },
    ) {
        throw new Error("Function not implemented.");
    }
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="panel-container"
    style="top: {panelConfig.top}px; left: {panelConfig.left}px; width: {panelConfig.width}px; height: {panelConfig.height}px"
    bind:this={panelElement}
    on:mousedown={onMouseDown}
>
    <div class="sidebar">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#each Object.keys(categories) as category}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
                <div class="title">ClickGUI - preview</div>
                <div
                    class="modules"
                    on:scroll={handleModulesScroll}
                    bind:this={panelElement}
                >
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
        background-color: rgba(black, 0.25);
    }
    .category-item.active {
        background-color: rgba(black, 0.35);
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
        flex-direction: column;
        background-color: rgba($background-color, $opacity);
        max-height: calc(100% - 40px); // 40px buffer for title height
        padding: 10px;
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
            white
        );
    }
</style>
