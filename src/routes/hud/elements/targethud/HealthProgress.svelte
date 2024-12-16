<script lang="ts">
    import thWidth from "./TargetHud.svelte";

    export let maxHealth: number;
    export let health: number;

    let width = Math.ceil((health / maxHealth) * 100);
    $: width = Math.ceil((health / maxHealth) * 100);
</script>

<div class="health-progress">
    <div class="thumb" style="width: {width}%;">
        <div class="thumb2" style="width: {width}%;"></div>
        <div class="thumb3" style="width: {width}%;"></div>
    </div>
</div>

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .health-progress {
        position: relative;
        bottom: 9px;
        left: 79.68px;
        border-radius: 6px;
        max-width: 156px;
        background-color: rgba($background-color, 0.2);
        box-shadow: $primary-shadow;
    }

    .thumb {
        height: 10.75px;
        background-color: $healthprogress-neutral;
        transition: ease-out width 0.3s;
        border-radius: 6px;
        z-index: 1;

        .thumb2 {
            position: absolute;
            height: 10.75px;
            transition: ease-out width 0.6s;
            border-radius: 6px;
            background-color: $healthprogress-lose;
            z-index: -1;
        }

        .thumb3 {
            position: absolute;
            height: 10.75px;
            border-radius: 6px;
            background-color: $healthprogress-gain;
            z-index: -2;
        }
    }
</style>
