<script lang="ts">
    import { listen } from "../../../integration/ws";
    import { scale } from "svelte/transition";
    import type { BlockCountChangeEvent } from "../../../integration/events";
    import { expoOut } from "svelte/easing";

    let count: number | undefined = undefined;

    function mapToColor(value: number): string {
        if (value <= 0) {
            return "rgb(255, 0, 0)";
        } else if (value <= 64) {
            return `rgb(255, ${Math.floor((value * 255) / 60)}, 0)`;
        } else {
            return "rgb(211, 211, 211)";
        }
    }

    listen("blockCountChange", (data: BlockCountChangeEvent) => {
        count = data.count;
    });
</script>

{#if count !== undefined}
    <div
        class="count"
        style="color: {mapToColor(count)}"
        transition:scale={{ easing: expoOut, duration: 500 }}
    >
        <span class="text">Blocks:</span>
        {count}
    </div>
{/if}

<style lang="scss">
    @use "../../../colors.scss" as *;

    .count {
        background-color: rgba($background-color, $opacity);
        border-radius: 12px;
        padding: 5px 8px;
        font-weight: 500;
        //border: $border-thing;
        box-shadow: $primary-shadow;
        text-shadow: $primary-shadow;

        .text {
            color: white;
        }
    }
</style>
