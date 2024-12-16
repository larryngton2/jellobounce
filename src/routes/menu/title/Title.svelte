<script lang="ts">
    import MainButton from "./buttons/MainButton.svelte";
    import Account from "../common/header/Account.svelte";
    import { onDestroy } from "svelte";
    import {
        browse,
        exitClient,
        getClientUpdate,
        openScreen,
        toggleBackgroundShaderEnabled,
    } from "../../../integration/rest";
    import Menu from "../common/Menu.svelte";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { notification } from "../common/header/notification_store";

    let regularButtonsShown = true;
    let clientButtonsShown = false;

    onMount(() => {
        setTimeout(async () => {
            const update = await getClientUpdate();
            if (update.updateAvailable) {
                notification.set({
                    title: `LiquidBounce ${update.newestVersion?.clientVersion} has been released!`,
                    message: `Download it from liquidbounce.net!`,
                    error: false,
                    delay: 99999999,
                });
            }
        }, 1500);
    });

    function toggleButtons() {
        if (clientButtonsShown) {
            clientButtonsShown = false;
            setTimeout(() => {
                regularButtonsShown = true;
            }, 700);
        } else {
            regularButtonsShown = false;
            setTimeout(() => {
                clientButtonsShown = true;
            }, 500);
        }
    }

    let currentTime: string;

    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        currentTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    const interval = setInterval(updateTime, 10);

    onDestroy(() => {
        clearInterval(interval);
    });

    updateTime();
</script>

<Menu>
    <div class="content">
        <div class="clock" transition:fly|global={{ duration: 500, y: -50 }}>
            {currentTime}
        </div>
        <div class="account"><Account /></div>
        <div class="main-buttons">
            {#if regularButtonsShown}
                <MainButton
                    title="Singleplayer"
                    icon="singleplayer"
                    index={0}
                    on:click={() => openScreen("singleplayer")}
                />

                <MainButton
                    title="Multiplayer"
                    icon="multiplayer"
                    let:parentHovered
                    on:click={() => openScreen("multiplayer")}
                    index={1}
                ></MainButton>
                <MainButton
                    title="Other"
                    icon="other"
                    on:click={toggleButtons}
                    index={2}
                />
            {:else if clientButtonsShown}
                <MainButton
                    title="Exit"
                    icon="shutdown"
                    on:click={exitClient}
                    index={0}
                />
                <MainButton
                    title="Toggle Shader"
                    icon="pen-2"
                    on:click={toggleBackgroundShaderEnabled}
                    index={1}
                />
                <MainButton
                    title="Proxies"
                    icon="proxymanager"
                    on:click={() => openScreen("proxymanager")}
                    index={2}
                />
                <MainButton
                    title="ClickGUI"
                    icon="clickgui"
                    on:click={() => openScreen("clickgui")}
                    index={3}
                />
                <MainButton
                    title="Options"
                    icon="options"
                    on:click={() => openScreen("options")}
                    index={4}
                />
                <!-- <MainButton title="Scripts" icon="scripts" index={2}/> -->
                <MainButton
                    title="Back"
                    icon="back-large"
                    on:click={toggleButtons}
                    index={5}
                />
            {/if}
        </div>
    </div>
</Menu>

<style lang="scss">
    @use "../../../colors.scss" as *;

    .clock {
        color: white;
        opacity: 0.8;
        font-size: 250px;
        font-weight: 800;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        text-shadow: $primary-shadow;
    }

    .account {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 50px;
    }

    .content {
        flex: 1;
        display: grid;
        grid-template-areas:
            "a ."
            "b c";
        grid-template-rows: 1fr max-content;
        grid-template-columns: 1fr max-content;
    }

    .main-buttons {
        display: flex;
        flex-direction: row;
        row-gap: 25px;
        grid-area: a;
        position: absolute;
        bottom: 25px;
        left: 50.5%;
        transform: translateX(-50%);
    }
</style>
