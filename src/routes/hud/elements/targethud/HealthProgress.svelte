<script lang="ts">
    export let maxHealth: number;
    export let health: number;

    let width = Math.ceil(health / maxHealth * 100);
    $: width = Math.ceil(health / maxHealth * 100);
</script>

<div class="health-progress">
    <div class="thumb" style="width: {width}%;"></div>
</div>

<style lang="scss">
    @import "../../../../colors.scss";

    .health-progress {
        position: relative;
        bottom: 21px;
        left: 65px;
        border-radius: 6px;
        //max-width: 170px;
        max-width: 68%;
        background-color: rgba($background-color, 0.3);
        box-shadow: 0 0 10px rgba($shadow-color, 0.5);
    }

    .thumb {
        height: 7px;
        background-color: $accent-color;
        transition: ease width 0.5s;
        border-radius: 6px;
        background-image: linear-gradient(to right, rgba(#FFF, 1), rgba(#929292, 1));
    }    
</style>