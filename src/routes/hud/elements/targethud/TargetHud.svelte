<script lang="ts">
    import { listen } from "../../../../integration/ws.js";
    import type { PlayerData } from "../../../../integration/types";
    import { REST_BASE } from "../../../../integration/host";
    import { fade, scale } from "svelte/transition";
    import type { TargetChangeEvent } from "../../../../integration/events";
    import type { ClientPlayerDataEvent } from "../../../../integration/events";
    import { getPlayerData } from "../../../../integration/rest";
    import { expoOut } from "svelte/easing";
    import HealthProgress from "./HealthProgress.svelte";
    import { onMount } from "svelte";

    let target: PlayerData | null = null;
    let visible = true;

    let playerData: PlayerData | null = null;
    let maxAbsorption = 0;

    let hideTimeout: number;
    let showDamageEffect = false;

    let previousHealth = 0;

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

        const newHealth = target!.actualHealth + target!.absorption;
        if (previousHealth !== 0 && newHealth < previousHealth) {
            showDamageEffect = true;
            setTimeout(() => (showDamageEffect = false), 250);
        }
        previousHealth = newHealth;
    });

    startHideTimeout();
</script>

{#if visible && target != null}
    <div
        class="targethud"
        transition:scale={{ duration: 500, easing: expoOut }}
    >
        <div class="avatar">
            {#if showDamageEffect}
                <div class="damage-effect" out:fade={{ duration: 250 }} />
            {/if}
            <img
                src="{REST_BASE}/api/v1/client/resource/skin?uuid={target.uuid}"
                alt="avatar"
            />
        </div>
        <div class="name">
            {target.username}
        </div>
        <div class="heart-icon">
            <img src="img/hud/targethud/icon-health.svg" alt="heart-icon" />
        </div>
        <div class="stats">
            <div class="health">
                {Math.floor(target.actualHealth + target.absorption)}
            </div>
            <span class="wl">
                {#if playerData !== null && playerData.health !== null}
                    {#if playerData.health + playerData.absorption > target.actualHealth + target.absorption}
                        <div class="winning">Winning</div>
                    {:else if playerData.health + playerData.absorption < target.actualHealth + target.absorption}
                        <div class="losing">Losing</div>
                    {:else}
                        <div class="draw">Draw</div>
                    {/if}
                {/if}
            </span>
        </div>
        <HealthProgress
            maxHealth={target.maxHealth + target.absorption}
            health={target.actualHealth + target.absorption}
        />
    </div>
{/if}

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .targethud {
        width: 250px;
        background-color: rgba($background-color, $opacity);
        border-radius: 12px;
        overflow: hidden;
        height: 79px;
        box-shadow: $primary-shadow;
        //border: $border-thing;
    }

    .name {
        color: $text-color;
        font-weight: 500;
        position: absolute;
        left: 78.18px;
        top: 9px;
        width: 158px;
        height: 22px;
        font-size: 20px;
        text-shadow: $primary-shadow;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .heart-icon {
        width: 16.12px;
        height: 15.2px;
        position: absolute;
        left: 80px;
        top: 35px;

        img {
            width: 16.12px;
            height: 15.2px;
        }
    }

    .stats {
        width: 136px;
        position: absolute;
        left: 98px;
        top: 31px;
        text-shadow: $text-shadow;
        color: #c8c8c8;
        display: grid;
        grid-template-areas: "a b";

        .health {
            grid-area: a;
            overflow: hidden;
            padding-right: 5px;
            font-size: 20px;
        }

        .wl {
            grid-area: b;
            font-size: 15px;
            padding-top: 4px;
            text-align: right;

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
    }

    .avatar {
        margin: 7.16px;
        left: 7px;
        top: 7px;
        scale: 125.297%;
        height: 50px;
        width: 50px;
        position: relative;
        image-rendering: pixelated;
        background-image: url("/img/steve.png");
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 8px;
        overflow: hidden;
        padding-left: 11px;
        padding-top: 11px;
        box-shadow: $primary-shadow;

        img {
            position: absolute;
            scale: 6.25;
            left: 118px;
            top: 118px;
            z-index: 1;
        }

        .damage-effect {
            z-index: 10;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(red, 0.4);
            border-radius: 9px;
        }
    }
</style>
