<script lang="ts">
    import {expoInOut} from "svelte/easing";
    import {fade} from "svelte/transition";
</script>

<div class="logo" transition:fade={{duration: 350, easing: expoInOut}}>jellobounce</div>

<style lang="scss">
    @import "../../colors.scss";

    .logo {
        position: absolute;
        left: 15px;
        top: 15px;
        font-family: Borel;
        color: rgba(white, 1);
        font-size: 50px;
        z-index: 1;
        text-align: center;
    }
</style>