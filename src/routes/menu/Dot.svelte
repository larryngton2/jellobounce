<script>
    import {onMount} from "svelte";
    import {fade} from "svelte/transition";

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    const smoothingFactor = 0.1;

    const updateMousePosition = (/** @type {{ clientX: number; clientY: number; }} */ event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    };

    const smoothMove = () => {
        currentX += (mouseX - currentX) * smoothingFactor;
        currentY += (mouseY - currentY) * smoothingFactor;
        requestAnimationFrame(smoothMove);
    };

    onMount(() => {
        window.addEventListener('mousemove', updateMousePosition);
        requestAnimationFrame(smoothMove);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    });
</script>

<div class="dot" style="top: {mouseY}px; left: {mouseX}px;" transition:fade={{duration: 150}}/>
<div class="screen"/>

<style lang="scss">
    @import "../../colors.scss";

    .dot {
        position: absolute;
        width: 15px;
        height: 15px;
        pointer-events: none;
        background-color: rgba($dot-color, 0.5);
        border-radius: 100%;
        box-shadow: 0 0 10px rgba($dot-color, 0.7);
        pointer-events: none;
        will-change: transform;
        z-index: 99999999999999999;
    }

    .screen {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0px;
        left: 0px;
        background: none;
        pointer-events: none;
        z-index: 99999999999999999;
    }
</style>
