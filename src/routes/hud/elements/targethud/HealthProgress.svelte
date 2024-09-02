<script lang="ts">
    export let maxHealth: number;
    export let health: number;

    let width = Math.ceil(health / maxHealth * 100);
    $: width = Math.ceil(health / maxHealth * 100);
</script>

<div class="health-progress">
    <div class="thumb" style="width: {width}%;">
        <div class="thumb2" style="width: {width}%;"></div>
    </div>
</div>

<style lang="scss">
    @import "../../../../colors.scss";

    .health-progress {
        position: relative;
        bottom: 21px;
        left: 65px;
        border-radius: 6px;
        max-width: 169.5px;
        //max-width: 67.8%;
        background-color: rgba($background-color, 0.2);
        box-shadow: 0 0 10px rgba($shadow-color, 0.5);
    }

    .thumb {
        height: 7px;
        background-color: $accent-color;
        transition: ease-out width 0.3s;
        border-radius: 6px;
        background-image: linear-gradient(to right, rgba(#FFF, 1), rgba(#929292, 1));
        z-index: 1;

        .thumb2 {
            position: absolute;
            height: 7px;
            transition: ease-out width 0.5s;
            background-image: linear-gradient(to right, #fff, #929292);
            z-index: -1;
        }
    }    
</style>