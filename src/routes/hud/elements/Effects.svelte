<script lang="ts">
    import {listen} from "../../../integration/ws";
    import type {ClientPlayerDataEvent} from "../../../integration/events";
    import type {StatusEffect} from "../../../integration/types";
    import {fly} from "svelte/transition";
    import {expoInOut} from "svelte/easing";

    let effects: StatusEffect[] = [];

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        effects = event.playerData.effects;
    });

    function formatTime(duration: number): string {
        return new Date(((duration / 20) | 0) * 1000).toISOString().substring(14, 19);
    }
</script>

<div class="effects">
    {#each effects as e}
        <div class="effect" transition:fly={{duration: 700, y: 50, easing: expoInOut}}>
            <span class="name" style="color: {'#' + e.color.toString(16)}">{e.localizedName} {e.amplifier + 1}</span>
            <span class="duration">{formatTime(e.duration)}</span>
        </div>
    {/each}
</div>

<style lang="scss">
  @import "../../../colors.scss";

  .effect {
    font-weight: 600;
    font-size: 14px;
    text-align: left;
    background-color: rgba($background-color, $opacity);
    padding: 5px 8px;
    box-shadow: $primary-shadow;
    border-left: $border-thing;
    border-right: $border-thing;
    text-shadow: $primary-shadow;

    .duration {
      color: white;
    }
  }

  .effect:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom: $border-thing;
  }

  .effect:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top: $border-thing;
  }
</style>