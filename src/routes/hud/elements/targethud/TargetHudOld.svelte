<script lang="ts">
    import { listen } from "../../../../integration/ws.js";
    import type { PlayerData } from "../../../../integration/types";
    import { REST_BASE } from "../../../../integration/host";
    import { fade } from "svelte/transition";
    import type { TargetChangeEvent } from "../../../../integration/events";

    let target: PlayerData | null = null;
    let visible = true;

    let hideTimeout: number;

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
    <div class="targethud" transition:fade|global={{ duration: 200 }}>
        <div class="main-wrapper">
            <div class="avatar">
                <img
                    src="{REST_BASE}/api/v1/client/resource/skin?uuid={target.uuid}"
                    alt="avatar"
                />
            </div>

            <div class="name">{target.username}</div>
            <div class="health-stats">
                <div class="stat">
                    <div class="value">
                        Health: {Math.floor(
                            target.actualHealth + target.absorption,
                        )}
                    </div>
                    <img
                        class="icon"
                        src="img/hud/targethud/icon-health.svg"
                        alt="health"
                    />
                </div>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .targethud {
        //position: fixed;
        //top: 50%;
        //left: calc(50% + 20px);
        //transform: translateY(-50%); // overwrites the component transform
        min-width: 250px;
        background-color: rgba($background-color, $opacity);
        border-radius: 12px;
        overflow: hidden;
        height: 66px;
        box-shadow: $primary-shadow;
        //border: $border-thing;
    }

    .main-wrapper {
        display: grid;
        grid-template-areas:
            "a b d"
            "f c e";
        padding: 7px;
    }

    .name {
        grid-area: a;
        color: white;
        font-weight: 500;
        align-self: flex-start;
        padding-left: 56px;
        padding-top: 4px;
        font-size: 20px;
        padding-right: 5px;
    }

    .health-stats {
        grid-area: b;
        position: absolute;
        left: 64px;
        bottom: 11px;
        padding-top: 9px;

        .stat {
            .value {
                color: $text-dimmed-color;
                font-size: 16px;
                min-width: 18px;
                display: inline-block;
                text-align: right;
                font-weight: 500;
            }
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
        border-radius: 100px;
        overflow: hidden;
        padding-left: 11px;
        padding-top: 11px;

        img {
            position: absolute;
            scale: 6.25;
            left: 118px;
            top: 118px;
        }
    }
</style>
