<script lang="ts">
    import {fly} from "svelte/transition";
    import {expoInOut} from "svelte/easing";
    import {onMount} from 'svelte';
    import {fade} from 'svelte/transition';
    import {getSession} from "../../../integration/rest";
    import {listen} from "../../../integration/ws";

    let visible = true;
    let username = "";
    let avatar = "";

    onMount(() => {
        const timer = setTimeout(() => {
            visible = false;
        }, 0);

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
        <div class="fade" transition:fade={{duration: 1000}}></div>
    {/if}

<div class="main-wrapper">
    <div class="text" transition:fly|global={{duration: 500, x: -50, easing: expoInOut}}>knox</div>
        <div class="userinfo" transition:fly|global={{duration: 500, y: 50, easing: expoInOut}}>
            <object data={avatar} type="image/png" class="avatar" aria-label="avatar">
                <img src="img/steve.png" alt=avatar class="avatar">
            </object>
        <span class="username">{username}</span>
    </div>
</div>

<div class="shaderfix"></div>

<style lang="scss">
    @import "../../../colors.scss";

    .main-wrapper {
        display: grid;
        grid-template-areas: "a b";
    }

    .text {
        grid-area: a;
        font-family: "urbanist-variable";
        color: $text-color;
        font-size: 40px;
        z-index: 1;
        text-shadow: $primary-shadow;
        font-weight: 400;
        padding: 0 7px;
        border-radius: 12px;
        background-color: rgba($background-color, $opacity2);
        border: $border-thing;
    }

    .userinfo {
        grid-area: b;
        color: white;
        text-shadow: $primary-shadow;
        box-shadow: $primary-shadow;
        font-weight: 400;
        font-size: 15px;
        margin-left: 7px;
        background-color: rgba($background-color, $opacity2);
        padding: 4px 5px;
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

    .fade {
        position: absolute;
        top: -15px;
        left: -15px;
        background-color: $fade-color;
        width: 100vw;
        height: 100vh;
        z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999; // just to be sure
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