<script lang="ts">
    export let maxHealth: number;
    export let health: number;

    let width = Math.ceil(health / maxHealth * 100);
    $: width = Math.ceil(health / maxHealth * 100);
</script>

<div class="health-progress">
    <div class="thumb" style="width: {width}%;">
        <div class="thumb2" style="width: {width}%;"></div>
        <div class="thumb3" style="width: {width}%;"></div>
    </div>
</div>

<style lang="scss">
    @import "../../../../colors.scss";

    .health-progress {
        position: relative;
        bottom: 21px;
        left: 64.8px;
        border-radius: 6px;
        max-width: 169.5px;
        //max-width: 67.8%;
        background-color: rgba($background-color, 0.2);
        box-shadow: 0 0 10px rgba($shadow-color, 0.3);
    }

    .thumb {
        height: 7px;
        background-color: $accent-color;
        transition: ease-out width 0.3s;
        border-radius: 6px;
        background-image: linear-gradient(to right, $healthprogress-neutral-1, $healthprogress-neutral-2);
        z-index: 1;

        .thumb2 {
            position: absolute;
            height: 7px;
            transition: ease-out width 0.6s;
            border-radius: 6px;
            background-image: linear-gradient(to right, $healthprogress-lose-1, $healthprogress-lose-2);
            z-index: -1;
        }

        .thumb3 {
            position: absolute;
            height: 7px;
            border-radius: 6px;
            background-color: $healthprogress-gain;
            z-index: -2;
        }
    }
</style>