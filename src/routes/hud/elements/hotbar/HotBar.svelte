<script lang="ts">
    import Status from "./Status.svelte";
    import {listen} from "../../../../integration/ws";
    import type {PlayerData, TextComponent as TTExtComponent} from "../../../../integration/types";
    import {onMount} from "svelte";
    import {getPlayerData} from "../../../../integration/rest";
    import {fade, fly} from "svelte/transition";
    import TextComponent from "../../../menu/common/TextComponent.svelte";
    import type {ClientPlayerDataEvent, OverlayMessageEvent} from "../../../../integration/events";
    import {expoInOut} from "svelte/easing";

    let lastSlot = 0;
    let currentSlot = 0;
    let playerData: PlayerData | null = null;
    let maxAbsorption = 0;
    let slotsElement: HTMLElement | undefined;

    let showItemStackName = false;
    let showItemStackNameTimeout: number | null = null;
    let itemStackName: TTExtComponent | string | null = null;
    let overlayMessage: OverlayMessageEvent | null = null;
    let overlayMessageTimeout: number | null = null;

    function updatePlayerData(s: PlayerData) {
        playerData = s;
        if (playerData.absorption <= 0) {
            maxAbsorption = 0;
        }
        if (playerData.absorption > maxAbsorption) {
            maxAbsorption = playerData.absorption;
        }
        currentSlot = playerData.selectedSlot;
        if (currentSlot !== lastSlot) {
            lastSlot = currentSlot;
            if (playerData.mainHandStack.identifier !== "minecraft:air") {
                itemStackName = playerData.mainHandStack.displayName;
                if (showItemStackNameTimeout !== null) {
                    clearTimeout(showItemStackNameTimeout);
                }
                showItemStackName = true;
                showItemStackNameTimeout = setTimeout(() => {
                    showItemStackName = false;
                }, 2000);
            }
        }
    }

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        updatePlayerData(event.playerData);
    });

    listen("overlayMessage", (event: OverlayMessageEvent) => {
        overlayMessage = event;
        if (overlayMessageTimeout !== null) {
            clearTimeout(overlayMessageTimeout);
        }
        overlayMessageTimeout = setTimeout(() => {
            overlayMessage = null;
        }, 3000)
    });

    onMount(async () => {
        updatePlayerData(await getPlayerData());
    });
</script>

{#if playerData && playerData.gameMode !== "spectator"}
    <div class="hotbar" transition:fly={{duration: 700, y: 50, easing: expoInOut}}>
        {#if overlayMessage !== null}
            <div class="overlay-message" transition:fade|global={{duration: 200}}
                 style="max-width: {slotsElement?.offsetWidth ?? 0}px">
                <TextComponent fontSize={14} textComponent={overlayMessage.text}/>
            </div>
        {/if}
        {#if showItemStackName && itemStackName !== null}
            <div class="item-name" transition:fade|global={{duration: 200}}>
                <TextComponent fontSize={14} textComponent={itemStackName}/>
            </div>
        {/if}
        <div class="status">
            <div class="pair">
                {#if playerData.armor > 0}
                    <Status
                            max={20}
                            value={playerData.armor}
                            color="#555555"
                            alignRight={false}
                            icon="shield"
                    />
                {:else}
                    <div></div>
                {/if}

                {#if playerData.air < playerData.maxAir}
                    <Status
                            max={playerData.maxAir}
                            value={playerData.air}
                            color="#555555"
                            alignRight={true}
                    />
                {:else}
                    <div></div>
                {/if}
            </div>

            {#if playerData.gameMode !== "creative"}
                {#if playerData.absorption > 0}
                    <div class="pair">
                        <Status
                                max={maxAbsorption}
                                value={playerData.absorption}
                                color="#555555"
                                alignRight={false}
                                icon="heart2"
                        />

                        <div></div>
                    </div>
                {/if}
                <div class="pair">
                    <Status
                            max={playerData.maxHealth}
                            value={playerData.health}
                            color="#444444"
                            alignRight={false}
                            icon="heart"
                    />
                    <Status
                            max={20}
                            value={playerData.food}
                            color="#444444"
                            alignRight={true}
                            icon="food"
                    />
                </div>
            {/if}
            {#if playerData.experienceLevel > 0}
                <Status
                        max={100} value={playerData.experienceProgress * 100}
                        color="#333333"
                        alignRight={false}
                        label={playerData.experienceLevel.toString()}
                />
            {/if}
        </div>

        <div class="hotbar-elements">
            <div class="slider" style="left: {currentSlot * 45}px"></div>
            <div class="slots" bind:this={slotsElement}>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
            </div>
        </div>

        {#if playerData?.offHandStack.identifier !== "minecraft:air"}
            <div class="offhand-slot" transition:fade|global={{duration: 150}}></div>
        {/if}
    </div>
{/if}

<style lang="scss">
  @import "../../../../colors.scss";

  .hotbar {
    //position: fixed;
    //bottom: 15px;
    //left: 50%;
    //transform: translateX(-50%);
    font-family: "sf-pro";
  }

  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 25px;
    border-radius: 12px;
  }

  .status {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
    row-gap: 5px;
    column-gap: 20px;
  }

  .hotbar-elements {
    background-color: rgba($background-color, $opacity);
    position: relative;
    border-radius: 12px;
    box-shadow: $primary-shadow;
    border: solid 1px $border-thing;

    .slider {
      height: 45px;
      width: 45px;
      padding-left: 10px;
      position: absolute;
      border-radius: 12px;
      transition: ease 0.15s;
      box-shadow: $misc-box-shadow;
      background-color: rgba($background-color, 0.2);
      scale: 90%;
    }

    .slots {
      display: flex;
    }

    .slot {
      height: 45px;
      width: 45px;
    }
  }

  .offhand-slot {
    height: 45px;
    width: 45px;
    border-radius: 12px;
    background-color: rgba(black, $opacity);
    position: absolute;
    bottom: 0;
    left: -65px;
    box-shadow: $primary-shadow;
    border: solid 1px $border-thing;
  }

  .item-name {
    color: white;
    scale: 110%;
    margin: 0 auto 15px;
    font-weight: 500;
    width: max-content;
    text-shadow: 0px 0px 10px rgba(black, 0.7);
  }

  .overlay-message {
    scale: 110%;
    text-align: center;
    color: white;
    margin-bottom: 22px;
    text-shadow: 0px 0px 10px rgba(black, 0.7);
  }
</style>