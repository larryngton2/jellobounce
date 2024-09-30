<script lang="ts">
    import InvDot from "./InvDot.svelte";
</script>

<div class="logo">
    <div class="one">jello<span class="two">bounce</span>
    </div>
</div>

<InvDot/>

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