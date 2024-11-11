<script lang="ts">
  import { listen } from "../../../integration/ws";
  import type { PlayerData, Scoreboard } from "../../../integration/types";
  import TextComponent from "../../menu/common/TextComponent.svelte";
  import type { ClientPlayerDataEvent } from "../../../integration/events";
  import { fly } from "svelte/transition";
  import { expoOut } from "svelte/easing";

  let scoreboard: Scoreboard | null = null;

  listen("clientPlayerData", (e: ClientPlayerDataEvent) => {
    const playerData: PlayerData = e.playerData;
    scoreboard = playerData.scoreboard;
  });
</script>

{#if scoreboard}
  <div
    class="scoreboard"
    transition:fly|global={{ duration: 500, x: -50, easing: expoOut }}
  >
    {#if scoreboard.header}
      <div class="header">
        <TextComponent
          fontSize={15}
          allowPreformatting={true}
          textComponent={scoreboard.header}
        />
      </div>
    {/if}
    <div class="entries">
      {#each scoreboard.entries as { name }}
        <div class="row">
          <TextComponent
            fontSize={15}
            allowPreformatting={true}
            textComponent={name}
          />
        </div>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  @import "../../../colors.scss";

  .scoreboard {
    min-width: 200px;
    //position: fixed;
    //left: 15px;
    //top: 550px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $primary-shadow;
    //border: $border-thing;
  }

  .entries {
    background-color: rgba($background-color, $opacity);
    padding: 10px;
  }

  .row {
    display: flex;
    column-gap: 15px;
    justify-content: space-between;
  }

  .header {
    text-align: center;
    background-color: rgba($background-color, $opacity);
    padding: 7px 10px;
  }
</style>
