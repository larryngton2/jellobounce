<script lang="ts">
    import {fly} from "svelte/transition";
    import {expoInOut} from "svelte/easing";
    import {onMount} from 'svelte';
    import {fade} from 'svelte/transition';

    let visible = true;

    onMount(() => {
        const timer = setTimeout(() => {
            visible = false;
        }, 0);

    return () => clearTimeout(timer);
});
</script>

    {#if visible}
        <div class="fade" transition:fade={{duration: 1000}}></div>
    {/if}

<div class="watermark" transition:fly|global={{duration: 500, x: -50, easing: expoInOut}}>jello</div>
<div class="shaderfix"></div>

<style lang="scss">
    @import "../../../colors.scss";

    .watermark {
        //position: fixed;
        //top: 15px;
        //left: 15px;
        font-family: "Borel";
        color: $text-color;
        font-size: 50px;
        z-index: 1;
        text-shadow: $primary-box-shadow;
    }

    .fade {
        position: absolute;
        top: -15px;
        left: -15px;
        background-color: $fade-color;
        width: 100vw;
        height: 100vh;
        z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999; // just to be sure
    }

    .shaderfix {
        top: -15px;
        left: -15px;
        position: absolute;
        background-color: $shaderfix-color;
        width: 100vw;
        height: 100vh;
        z-index: -2;
    }
</style>