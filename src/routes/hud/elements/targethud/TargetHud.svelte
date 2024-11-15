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
    import { onMount, afterUpdate } from "svelte";

    let target: PlayerData | null = null;
    let visible = true;

    let playerData: PlayerData | null = null;
    let maxAbsorption = 0;

    let hideTimeout: number;
    let showDamageEffect = false;

    let previousHealth = 0;

    let nameElement: HTMLElement;
    let wlElement: HTMLElement;

    function updateNamePadding() {
        if (nameElement && wlElement) {
            const wlWidth = wlElement.offsetWidth;
            nameElement.style.paddingRight = `${wlWidth + 10}px`;
        }
    }

    onMount(() => {
        updateNamePadding();
    });

    afterUpdate(() => {
        updateNamePadding();
    });

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
        if (previousHealth !== 0 && newHealth !== previousHealth) {
            showDamageEffect = true;
            setTimeout(() => (showDamageEffect = false), 50);
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
        <div class="main-wrapper">
            <div class="avatar">
                {#if showDamageEffect}
                    <div class="damage-effect" out:fade={{ duration: 450 }} />
                {/if}
                <img
                    src="{REST_BASE}/api/v1/client/resource/skin?uuid={target.uuid}"
                    alt="avatar"
                />
            </div>
            <div class="name" bind:this={nameElement}>
                {target.username}
            </div>
            <div class="wl" bind:this={wlElement}>
                {#if playerData !== null && playerData.health !== null}
                    {#if playerData.health + playerData.absorption > target.actualHealth + target.absorption}
                        <div class="winning">
                            {Math.floor(
                                target.actualHealth + target.absorption,
                            )}
                        </div>
                    {:else if playerData.health + playerData.absorption < target.actualHealth + target.absorption}
                        <div class="losing">
                            {Math.floor(
                                target.actualHealth + target.absorption,
                            )}
                        </div>
                    {:else}
                        <div class="draw">
                            {Math.floor(
                                target.actualHealth + target.absorption,
                            )}
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
        <HealthProgress
            maxHealth={target.maxHealth + target.absorption}
            health={target.actualHealth + target.absorption}
        />
    </div>
{/if}

<style lang="scss">
    @import "../../../../colors.scss";

    .targethud {
        width: 250px;
        background-color: rgba($background-color, $opacity);
        border-radius: 12px;
        overflow: hidden;
        height: 64px;
        box-shadow: $primary-shadow;
        //border: $border-thing;
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
        text-shadow: $primary-shadow;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .wl {
        grid-area: c;
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 16px;
        text-shadow: $text-shadow;

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
            background-color: rgba(red, 0.25);
            border-radius: 8px;
        }
    }
</style>
