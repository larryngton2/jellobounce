<script lang="ts">
    import {fly} from "svelte/transition";
    import {expoOut} from "svelte/easing";
    import {onDestroy, onMount} from 'svelte';
    import {getClientInfo, getProtocols, getSelectedProtocol, getSession} from "../../../../integration/rest";
    import {listen} from "../../../../integration/ws";
    import type {ClientInfo, ClientUpdate, Protocol} from "../../../../integration/types";
  
    let fps: number | null = null;
    let protocol: number | null = null;
    let clientVersion: string | null = null;
    let clientInDev: boolean;
    let clientInfo: ClientInfo | null = null;
    let username = "";
    let avatar = "";
    let intervalId: number;
    let protocols: Protocol[] = [];
    let selectedProtocol: Protocol = {
        name: "",
        version: -1
    };
  
    async function refreshSession() {
        const session = await getSession();
        username = session.username;
        avatar = session.avatar;
    };

    async function getClientInfoData() {
        clientInfo = await getClientInfo();
    };

    function clientDevStatus(): string {
        if (clientInDev = true) {
            return "Dev"
        } else {
            return "Release"
        }
    };
  
    onMount(async () => {
        await refreshSession();
        intervalId = setInterval(async () => {
            await getClientInfoData();
        }, 50);

        await getSelectedProtocol();
        protocols = await getProtocols();
        selectedProtocol = await getSelectedProtocol();
    });
  
    onDestroy(() => {
        clearInterval(intervalId);
    });

    listen("clientInfo", (data: ClientInfo) => {
        fps = data.fps;
        clientVersion = data.clientVersion
    });

    listen("clientUpdate", (data: ClientUpdate) => {
        clientInDev = data.development;
    });

    listen("clientProtocol", (data: Protocol) => {
        protocol = data.version;
    });
  </script>
  
  <div class="main-wrapper">
        {#if clientInfo && clientInfo.viaFabricPlus}
          <div class="fps" transition:fly|global={{duration: 500, delay: 25 * 3, y: 50, easing: expoOut}}>{clientInfo.fps} FPS</div>
          <div class="protocol" transition:fly|global={{duration: 500, delay: 25 * 2, y: 50, easing: expoOut}}>Version {selectedProtocol.name}</div>
          <div class="clientversion" transition:fly|global={{duration: 500, delay: 25 * 1, y: 50, easing: expoOut}}>{clientDevStatus()} {clientInfo.clientVersion}</div>
        {/if}
      <div class="userinfo" transition:fly|global={{duration: 500, delay: 25 * 0, y: 50, easing: expoOut}}>
          <object data={avatar} type="image/png" class="avatar" aria-label="avatar">
              <img src="img/steve.png" alt=avatar class="avatar">
          </object>
          <span class="username">{username}</span>
      </div>
  </div>

<style lang="scss">
    @import "../../../../colors.scss";

    .main-wrapper {
        display: grid;
        grid-template-areas: "a b c d";
    }

    .fps {
        grid-area: a;
        color: white;
        text-shadow: $primary-shadow;
        box-shadow: $primary-shadow;
        font-weight: 400;
        font-size: 15px;
        margin-left: 7px;
        background-color: rgba($background-color, $opacity2);
        padding: 4px 6px;
        border-radius: 6px;
        height: 28px;
        border: $border-thing;
    }

    .protocol {
        grid-area: b;
        color: white;
        text-shadow: $primary-shadow;
        box-shadow: $primary-shadow;
        font-weight: 400;
        font-size: 15px;
        margin-left: 7px;
        background-color: rgba($background-color, $opacity2);
        padding: 4px 6px;
        border-radius: 6px;
        height: 28px;
        border: $border-thing;
    }

    .clientversion {
        grid-area: c;
        color: white;
        text-shadow: $primary-shadow;
        box-shadow: $primary-shadow;
        font-weight: 400;
        font-size: 15px;
        margin-left: 7px;
        background-color: rgba($background-color, $opacity2);
        padding: 4px 6px;
        border-radius: 6px;
        height: 28px;
        border: $border-thing;
    }

    .userinfo {
        grid-area: d;
        color: white;
        text-shadow: $primary-shadow;
        box-shadow: $primary-shadow;
        font-weight: 400;
        font-size: 15px;
        margin-left: 7px;
        background-color: rgba($background-color, $opacity2);
        padding: 4px 6px;
        border-radius: 6px;
        height: 28px;
        border: $border-thing;

        .avatar {
            height: 18px;
            width: 18px;
            border-radius: 100%;
            margin-bottom: -3.5px;
            box-shadow: $userinfo-box-shadow;
        }
    }
</style>