<script lang="ts">
    import { fly } from "svelte/transition";
    import { expoOut } from "svelte/easing";
    import { onDestroy, onMount } from "svelte";
    import { getClientInfo, getSession } from "../../../../integration/rest";
    import { listen } from "../../../../integration/ws";
    import type { ClientInfo } from "../../../../integration/types";

    let fps: number | null = null;
    let clientVersion: string | null = null;
    let clientInfo: ClientInfo | null = null;
    let username = "";
    let avatar = "";
    let intervalId: number;

    async function refreshSession() {
        const session = await getSession();
        username = session.username;
        avatar = session.avatar;
    }

    async function getClientInfoData() {
        clientInfo = await getClientInfo();
    }

    onMount(async () => {
        await refreshSession();
        intervalId = setInterval(async () => {
            await getClientInfoData();
        }, 50);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

    listen("clientInfo", (data: ClientInfo) => {
        fps = data.fps;
        clientVersion = data.clientVersion;
    });
</script>

<div class="main-wrapper">
    {#if clientInfo}
        <div
            class="fps"
            in:fly|global={{
                duration: 500,
                delay: 25,
                y: 50,
                easing: expoOut,
            }}
            out:fly|global={{ duration: 500, y: 50, easing: expoOut }}
        >
            {clientInfo.fps} FPS
        </div>
    {/if}
    <div
        class="userinfo"
        transition:fly|global={{ duration: 500, y: 50, easing: expoOut }}
    >
        <object
            data={avatar}
            type="image/png"
            class="avatar"
            aria-label="avatar"
        >
            <img src="img/steve.png" alt="avatar" class="avatar" />
        </object>
        <span class="username">{username}</span>
    </div>
</div>

<style lang="scss">
    @use "../../../../colors.scss" as *;

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
        background-color: rgba($background-color, $opacity);
        padding: 5px 6px;
        border-radius: 6px;
        height: 28px;
        //border: $border-thing;
    }

    .userinfo {
        grid-area: d;
        color: white;
        text-shadow: $primary-shadow;
        box-shadow: $primary-shadow;
        font-weight: 400;
        font-size: 15px;
        margin-left: 7px;
        background-color: rgba($background-color, $opacity);
        padding: 5px 6px;
        border-radius: 6px;
        height: 28px;
        //border: $border-thing;

        .avatar {
            height: 18px;
            width: 18px;
            border-radius: 100%;
            margin-bottom: -3.5px;
            box-shadow: $primary-shadow;
        }
    }
</style>
