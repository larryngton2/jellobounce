<script lang="ts">
    import { expoOut } from "svelte/easing";
    import { fly } from "svelte/transition";
</script>

<div
    class="option-bar"
    transition:fly|global={{ duration: 500, y: -100, easing: expoOut }}
>
    <slot />
</div>

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .option-bar {
        background-color: rgba($background-color, $opacity);
        padding: 15px 30px;
        display: flex;
        border-radius: 12px;
        align-items: center;
        column-gap: 30px;
        margin-bottom: 25px;
        //border: $border-thing;
    }
</style>
