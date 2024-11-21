<script lang="ts">
    import { onMount } from "svelte";
    import type { Module as TModule } from "../../integration/types";
    import { listen } from "../../integration/ws";
    import Module from "./Module.svelte";
    import type { ToggleModuleEvent } from "../../integration/events";
    import { fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import {
        highlightModuleName,
        maxPanelZIndex,
        scaleFactor,
    } from "./clickgui_store";
    import { setItem } from "../../integration/persistent_storage";
    import { debounceAsync } from "../../integration/util";

    export let category: string;
    export let modules: TModule[];
    export let panelIndex: number;

    const allModuleElements: Record<string, Module> = {};

    let panelElement: HTMLElement;
    let modulesElement: HTMLElement;

    let moving = false;
    let offsetX = 0;
    let offsetY = 0;
    const GRID_SIZE = 20;
    const panelConfig = loadPanelConfig();

    interface PanelConfig {
        top: number;
        left: number;
        expanded: boolean;
        scrollTop: number;
        zIndex: number;
    }

    function clamp(number: number, min: number, max: number) {
        return Math.max(min, Math.min(number, max));
    }

    function loadPanelConfig(): PanelConfig {
        const localStorageItem = localStorage.getItem(
            `clickgui.panel.${category}`,
        );

        if (!localStorageItem) {
            return {
                top: panelIndex * 50 + 20,
                left: 20,
                expanded: false,
                scrollTop: 0,
                zIndex: 0,
            };
        } else {
            const config: PanelConfig = JSON.parse(localStorageItem);

            // Migration
            if (!config.zIndex) {
                config.zIndex = 0;
            }

            if (config.zIndex > $maxPanelZIndex) {
                $maxPanelZIndex = config.zIndex;
            }

            return config;
        }
    }

    const savePanelConfig = debounceAsync(async () => {
        await setItem(
            `clickgui.panel.${category}`,
            JSON.stringify(panelConfig),
        );
    });

    function fixPosition() {
        panelConfig.left = clamp(
            panelConfig.left,
            0,
            document.documentElement.clientWidth * (2 / $scaleFactor) -
                panelElement.offsetWidth,
        );
        panelConfig.top = clamp(
            panelConfig.top,
            0,
            document.documentElement.clientHeight * (2 / $scaleFactor) -
                panelElement.offsetHeight,
        );
    }

    function onMouseDown(e: MouseEvent) {
        moving = true;

        offsetX = e.clientX - panelConfig.left;
        offsetY = e.clientY - panelConfig.top;
        panelConfig.zIndex = ++$maxPanelZIndex;
        document.body.classList.add("moving-panel");
    }

    function snapToGrid(value: number): number {
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    }

    function onMouseMove(e: MouseEvent) {
        if (moving) {
            const newLeft = (e.clientX - offsetX) * (2 / $scaleFactor);
            const newTop = (e.clientY - offsetY) * (2 / $scaleFactor);

            panelConfig.left = snapToGrid(newLeft);
            panelConfig.top = snapToGrid(newTop);

            fixPosition();
            savePanelConfig();
        }
    }

    function onMouseUp() {
        moving = false;
        document.body.classList.remove("moving-panel");
    }

    function toggleExpanded() {
        panelConfig.expanded = !panelConfig.expanded;

        fixPosition();
        savePanelConfig();
    }

    function handleModulesScroll() {
        panelConfig.scrollTop = modulesElement.scrollTop;
        savePanelConfig();
    }

    highlightModuleName.subscribe(() => {
        const highlightModule = modules.find(
            (m) => m.name === $highlightModuleName,
        );
        if (highlightModule) {
            panelConfig.zIndex = ++$maxPanelZIndex;
            panelConfig.expanded = true;
            savePanelConfig();
        }
    });

    listen("toggleModule", (e: ToggleModuleEvent) => {
        const moduleName = e.moduleName;
        const moduleEnabled = e.enabled;

        const mod = modules.find((m) => m.name === moduleName);
        if (!mod) return;

        mod.enabled = moduleEnabled;
        modules = modules;
    });

    onMount(() => {
        if (!modulesElement) {
            return;
        }

        modulesElement.scrollTo({
            top: panelConfig.scrollTop,
            behavior: "instant",
        });
    });
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<div
    class="panel"
    style="left: {panelConfig.left}px; top: {panelConfig.top}px; z-index: {panelConfig.zIndex};"
    bind:this={panelElement}
    transition:fade|global={{ duration: 200, easing: quintOut }}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="title"
        on:dblclick={() =>
            Object.values(allModuleElements).forEach((it) =>
                it.setExpanded(false),
            )}
        on:mousedown={onMouseDown}
        on:contextmenu|preventDefault={toggleExpanded}
    >
        <img
            class="icon"
            src="img/clickgui/icon-{category.toLowerCase()}.svg"
            alt="icon"
        />
        <span class="category">{category}</span>
    </div>

    <div
        class="modules"
        style="max-height: {panelConfig.expanded ? '545px' : '0'}"
        on:scroll={handleModulesScroll}
        bind:this={modulesElement}
    >
        {#each modules as { name, enabled, description, aliases } (name)}
            <Module
                {name}
                {enabled}
                {description}
                {aliases}
                bind:this={allModuleElements[name]}
            />
        {/each}
    </div>
</div>

<style lang="scss">
    @import "../../colors.scss";

    $GRID_SIZE: 20px;

    :global(.moving-panel) {
        background-image: linear-gradient(
                to right,
                rgba(128, 128, 128, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(
                to bottom,
                rgba(128, 128, 128, 0.1) 1px,
                transparent 1px
            );
        background-size: $GRID_SIZE $GRID_SIZE;
    }

    .panel {
        border-radius: 12px;
        width: 230px;
        position: absolute;
        overflow: hidden;
        box-shadow: $primary-shadow;
        will-change: transform;
        //box-shadow: inset 0 125px 100px -100px rgba(black, 0.8), 0px 0px 10px rgba(black, 0.5);
        align-items: center;
        transition: none;
        user-select: none;
    }

    .title {
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        align-items: center;
        column-gap: 12px;
        padding: 10px;
        cursor: grab;
        text-align: center;
        text-shadow: 0px 0px 20px rgba(150, 150, 150);
        height: 35px;
        background-image: linear-gradient(
            rgba($background-color, 0.6),
            rgba($background-color, 0.5)
        );

        .category {
            left: 50%;
            transform: translateX(-50%);
            position: fixed;
            display: grid;
            font-size: 15px;
            color: $text-color;
            font-weight: 600;
        }

        .icon {
            border-radius: 4px;
        }
    }

    .modules {
        transition: max-height 400ms ease-in-out;
        scroll-behavior: smooth;
        overflow-y: auto;
        overflow-x: hidden;
        background-image: linear-gradient(
            rgba($background-color, 0.5),
            rgba($background-color, 0.45)
        );
    }

    .modules::-webkit-scrollbar {
        width: 0;
    }
</style>
