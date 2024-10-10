<script lang="ts">
    import {onMount, tick} from "svelte";
    import type {Module} from "../../../integration/types";
    import {getModules} from "../../../integration/rest";
    import {listen} from "../../../integration/ws";
    import {getTextWidth} from "../../../integration/text_measurement";
    import {flip} from "svelte/animate";
    import {fly} from "svelte/transition";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import {arraylistGradient} from "../../../theme/arraylist"; // for some reason you need to keep the import even if its "unused", nice
    import {expoOut} from "svelte/easing";

    let enabledModules: Module[] = [];

    async function updateEnabledModules() {
        const modules = await getModules();
        const visibleModules = modules.filter(m => m.enabled && !m.hidden);

        const modulesWithWidths = visibleModules.map(module => {
                let formattedName = $spaceSeperatedNames ? convertToSpacedString(module.name) : module.name;
                let fullName = module.tag == null ? formattedName : formattedName + " " + module.tag;

                return {
                    ...module,
                    width: getTextWidth(fullName, "400 15px sf-pro")
                };
            }
        );

        modulesWithWidths.sort((a, b) => b.width - a.width);

        enabledModules = modulesWithWidths;
        await tick();
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

<div class="arraylist" id="arraylist" transition:fly|global={{duration: 500, y: -50, easing: expoOut}}>
    {#each enabledModules as {name, tag} (name)}
        <div class="module" id="module" animate:flip={{duration: 350, easing: expoOut}} in:fly={{x: 50, duration: 250, easing: expoOut}} out:fly={{x: 50, duration: 250}}>
            {$spaceSeperatedNames ? convertToSpacedString(name) : name}
            {#if tag}
                <span class="tag" id="tag"> {tag}</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    @import "../../../colors.scss";
    
    :root {
        --gradient-color-1: #{$gradient-color-1};
        --gradient-color-2: #{$gradient-color-2};
    }

    .arraylist {
        //position: fixed;
        //top: 0;
        //right: 0;
        //filter: drop-shadow(0px 0px 15px rgba($arraylist-shadow-color, 1));
    }

    .module {
        background-color: rgba($background-color, $opacity);
        color: $text-color;
        font-size: 15px;
        padding: 5px 7px;
        width: max-content;
        font-weight: 400;
        margin-left: auto;
        text-shadow: $primary-shadow;
        box-shadow: -5px 0px 10px rgba($arraylist-shadow-color, 0.27), 5px 0px 10px rgba($arraylist-shadow-color, 0.27);
        //filter: drop-shadow(0px 0px 10px rgba($arraylist-shadow-color, 1));
    }

    .tag {
        color: $arraylist-tag-color;
    }

    .module:first-child {
        box-shadow: 0px -5px 10px rgba($arraylist-shadow-color, 0.17), -5px 0px 10px rgba($arraylist-shadow-color, 0.17), 5px 0px 10px rgba($arraylist-shadow-color, 0.17);
    }

    .module:last-child {
        box-shadow: 0px 5px 10px rgba($arraylist-shadow-color, 0.17), -5px 0px 10px rgba($arraylist-shadow-color, 0.17), 5px 0px 10px rgba($arraylist-shadow-color, 0.17);
    }
</style>