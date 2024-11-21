<script lang="ts">
    import { onMount, tick } from "svelte";
    import type { Module } from "../../../integration/types";
    import { getModules } from "../../../integration/rest";
    import { listen } from "../../../integration/ws";
    import { getTextWidth } from "../../../integration/text_measurement";
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
    import {
        convertToSpacedString,
        spaceSeperatedNames,
    } from "../../../theme/theme_config";
    import { expoOut } from "svelte/easing";
    import { Sound } from "svelte-sound";

    let enabledModules: Module[] = [];
    let enabledSound = "../../../../public/sounds/enable.ogg";
    let disabledSound = "../../../../public/sounds/disable.ogg";

    async function updateEnabledModules() {
        const modules = await getModules();
        const visibleModules = modules.filter((m) => m.enabled && !m.hidden);

        const modulesWithWidths = visibleModules.map((module) => {
            let formattedName = $spaceSeperatedNames
                ? convertToSpacedString(module.name)
                : module.name;
            let fullName =
                module.tag == null
                    ? formattedName
                    : formattedName + " " + module.tag;

            return {
                ...module,
                width: getTextWidth(fullName, "400 15px sf-pro"),
            };
        });

        modulesWithWidths.sort((a, b) => b.width - a.width);

        const previousModules = enabledModules.map((m) => m.name);
        const currentModules = modulesWithWidths.map((m) => m.name);

        const addedModules = currentModules.filter(
            (name) => !previousModules.includes(name),
        );
        const removedModules = previousModules.filter(
            (name) => !currentModules.includes(name),
        );

        if (addedModules.length > 0) {
            playSound(enabledSound);
        }
        if (removedModules.length > 0) {
            playSound(disabledSound);
        }

        enabledModules = modulesWithWidths;
        await tick();
    }

    function playSound(src: string) {
        new Sound({
            props: {
                src,
                autoplay: true,
                volume: 1,
            },
            target: document.body,
        });
    }

    spaceSeperatedNames.subscribe(async () => {
        await updateEnabledModules();
    });

    onMount(async () => {
        await updateEnabledModules();
    });

    listen("toggleModule", async () => {
        await updateEnabledModules();
    });

    listen("refreshArrayList", async () => {
        await updateEnabledModules();
    });
</script>

<div
    class="arraylist"
    transition:fly|global={{ duration: 500, y: -50, easing: expoOut }}
>
    {#each enabledModules as { name, tag } (name)}
        <div
            class="module"
            animate:flip={{ duration: 200 }}
            in:fly={{ x: 50, duration: 250, easing: expoOut }}
            out:fly={{ x: 50, duration: 250 }}
        >
            {$spaceSeperatedNames ? convertToSpacedString(name) : name}
            {#if tag}
                <span class="tag" id="tag"> {tag}</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    @import "../../../colors.scss";

    .arraylist {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .module {
        background-color: rgba($background-color, $opacity);
        color: $text-color;
        font-size: 15px;
        padding: 5px 7px;
        width: max-content;
        font-weight: 400;
        text-shadow: $primary-shadow;
        position: relative;
        z-index: 1;
        //box-shadow: -5px 0px 10px rgba($arraylist-shadow-color, 0.27), 5px 0px 10px rgba($arraylist-shadow-color, 0.27);
        box-shadow: $primary-shadow;
    }

    .tag {
        color: $arraylist-tag-color;
    }
</style>
