<script lang="ts">
    import {fly} from "svelte/transition";
    import {backInOut} from "svelte/easing";
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

<div class="watermark" id="watermark" transition:fly|global={{duration: 500, y: -50, easing: backInOut}}>jello</div>
<div class="shaderfix"></div>

<style lang="scss">
    @import "../../../colors.scss";

    .watermark {
        //position: fixed;
        //top: 15px;
        //left: 15px;
        font-family: "Borel";
        color: rgba(white, 1);
        font-size: 50px;
        z-index: 1;
        text-shadow: 0px 0px 10px rgba($shadow-color, 0.3);
    }

    .fade {
        position: absolute;
        top: -15px;
        left: -15px;
        background-color: black;
        width: 100vw;
        height: 100vh;
        z-index: -3;
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