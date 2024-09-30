<script lang="ts">
    import {fade} from "svelte/transition";
    import Dot from "../menu/Dot.svelte";
</script>

<div class="logo">
    <div class="one">jello<span class="two" transition:fade|global={{duration: 500}}>bounce</span>
    </div>
</div>

<Dot/>

<style lang="scss">
    @import "../../colors.scss";

    .logo {
        position: absolute;
        left: 15px;
        top: 15px;
        font-family: "Borel";
        color: white;
        font-size: 50px;
        z-index: 1;
        text-align: center;
    }
</style>