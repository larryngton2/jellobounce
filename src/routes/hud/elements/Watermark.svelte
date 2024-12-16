<script lang="ts">
    import { fly } from "svelte/transition";
    import { expoOut } from "svelte/easing";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { listen } from "../../../integration/ws";
    import type { Protocol, Server } from "../../../integration/types";
    import {
        getProtocols,
        getSelectedProtocol,
        getServers,
        getSession,
    } from "../../../integration/rest";

    let visible = true;
    let username = "";
    let avatar = "";
    let protocols: Protocol[] = [];
    let protocol: number | null = null;
    let selectedProtocol: Protocol = {
        name: "",
        version: -1,
    };
    let server: Server[] = [];
    let address: string | null = null;

    onMount(async () => {
        await getSelectedProtocol();
        protocols = await getProtocols();
        selectedProtocol = await getSelectedProtocol();
        await getServerData();
    });

    async function getServerData() {
        server = await getServers();
    }

    listen("clientProtocol", (data: Protocol) => {
        protocol = data.version;
    });

    listen("currentServer", (data: Server) => {
        address = data.address;
    });

    onMount(() => {
        const timer = setTimeout(() => {
            visible = false;
        }, 150);

        return () => clearTimeout(timer);
    });

    async function refreshSession() {
        const session = await getSession();
        username = session.username;
        avatar = session.avatar;
    }

    onMount(async () => {
        await refreshSession();
    });

    listen("session", async () => {
        await refreshSession();
    });
</script>

{#if visible}
    <div class="fade" transition:fade={{ duration: 1350 }}></div>
    <div class="info">
        <div class="text" transition:fade={{ delay: 2500, duration: 1500 }}>
            Logged in as {username} on version {selectedProtocol.name}.
        </div>
    </div>
{/if}
<div class="main-wrapper">
    <div
        class="text"
        transition:fly|global={{ duration: 500, x: -50, easing: expoOut }}
    >
        jello<span class="text2">bounce</span>
    </div>
</div>

<div class="shaderfix" />

<style lang="scss">
    @use "../../../colors.scss" as *;

    .main-wrapper {
        display: grid;
        grid-template-areas: "a" "b";
    }

    .info {
        position: absolute;
        left: 50vw;
        transform: translateX(-50%);
        white-space: nowrap;
        text-shadow: $text-shadow;
    }

    .text {
        grid-area: a;
        font-family: "urbanist-variable";
        color: $text-color;
        font-size: 40px;
        z-index: 1;
        text-shadow: $text-shadow;
        font-weight: 400;
        padding: 0 7px;
        opacity: 0.8;

        .text2 {
            margin-left: 1.5px;
            font-size: 27px;
            color: darken($text-color, 10%);
        }
    }

    .fade {
        position: absolute;
        top: -15px;
        left: -15px;
        background-color: $fade-color;
        width: 100vw;
        height: 100vh;
        z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999; // just to be 100% sure
    }

    .shaderfix {
        top: -15px;
        left: -15px;
        position: absolute;
        background-color: $shaderfix-color;
        width: 100vw;
        height: 100vh;
        z-index: -2;
    }
</style>
