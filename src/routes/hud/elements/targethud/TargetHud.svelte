<script lang="ts">
    import {listen} from "../../../../integration/ws.js";
    import type {PlayerData} from "../../../../integration/types";
    import {REST_BASE} from "../../../../integration/host";
    import {scale} from "svelte/transition";
    import type {TargetChangeEvent} from "../../../../integration/events";
    import type {ClientPlayerDataEvent} from "../../../../integration/events";
    import {onMount} from "svelte";
    import {getPlayerData} from "../../../../integration/rest";
    import {backInOut} from "svelte/easing";
    import HealthProgress from "./HealthProgress.svelte";

    let target: PlayerData | null = null;
    let visible = true;

    let playerData: PlayerData | null = null;
    let maxAbsorption = 0;

    let hideTimeout: number;

    function updatePlayerData(s: PlayerData) {
        playerData = s;
        if (playerData.absorption <= 0) {
            maxAbsorption = 0;
        }
        if (playerData.absorption > maxAbsorption) {
            maxAbsorption = playerData.absorption;
        }
    }

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        updatePlayerData(event.playerData);
    });

    onMount(async () => {
        updatePlayerData(await getPlayerData());
    });

    function startHideTimeout() {
        hideTimeout = setTimeout(() => {
            visible = false;
        }, 500);
    }

    listen("targetChange", (data: TargetChangeEvent) => {
        target = data.target;
        visible = true;
        clearTimeout(hideTimeout);
        startHideTimeout();
    });

    startHideTimeout();
</script>

{#if visible && target != null}
    <div class="targethud" transition:scale={{duration: 500, easing: backInOut}}>
        <div class="main-wrapper">
            <div class="avatar">
                <img src="{REST_BASE}/api/v1/client/resource/skin?uuid={target.uuid}" alt="avatar" />
            </div>
    
            <div class="name">{target.username}</div>
            <div class="wl">
                {#if playerData !== null && playerData.health !== null}
                    {#if (playerData.health + playerData.absorption) > (target.actualHealth + target.absorption)}
                        <div class="winning">W</div>
                        {:else if (playerData.health + playerData.absorption) < (target.actualHealth + target.absorption)}
                        <div class="losing">L</div>
                        {:else}
                        <div class="draw">D</div>
                    {/if}
                {/if}
            </div>
        </div>
        <HealthProgress maxHealth={target.maxHealth + target.absorption} health={target.actualHealth + target.absorption} />
    </div>
{/if}

<style lang="scss">
    @import "../../../../colors.scss";

    .targethud {
        width: 250px;
        background-color: rgba($background-color, $opacity);
        border-radius: 12px;
        overflow: hidden;
        height: 66px;
        box-shadow: 0 0 10px rgba($shadow-color, 0.5);
        border: solid 1px $border-thing;
        font-family: "sf-pro";
    }

    .main-wrapper {
        display: grid;
        grid-template-areas:
            "a c"
            ". b";
        padding: 7px;
    }

    .name {
        grid-area: a;
        color: $text-color;
        font-weight: 500;
        align-self: flex-start;
        padding-left: 56px;
        padding-top: 4px;
        font-size: 20px;
        padding-right: 12px;
        text-shadow: 0 0 10px rgba($shadow-color, 0.5);
    }

    .wl {
        grid-area: c;
        position: absolute;
        right: 16px;
        top: 15.5px;
        padding-bottom: 9px;
        font-size: 16px;
        text-shadow: 0 0 10px rgba($shadow-color, 0.5);

        .winning {
            color: $targethud-winning;
            filter: grayscale(50%);
        }

        .losing {
            color: $targethud-losing;
            filter: grayscale(50%);
        }

        .draw {
            color: $targethud-draw;
            filter: grayscale(50%);
        }
    }

    .avatar {
        grid-area: a;
        height: 50px;
        width: 50px;
        position: relative;
        image-rendering: pixelated;
        background-image: url("/img/steve.png");
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 6px;
        overflow: hidden;
        padding-left: 11px;
        padding-top: 11px;
        box-shadow: 0 0 10px rgba($shadow-color, 0.5);

        img {
            position: absolute;
            scale: 6.25;
            left: 118px;
            top: 118px;
        }
    }
</style>