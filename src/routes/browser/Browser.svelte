<script lang="ts">
    import type { Browser } from "../../integration/types.js";
    import { onMount } from "svelte";
    import {
        browserForceReload,
        browserGoBack,
        browserGoForward,
        browserNavigate,
        browserReload,
        getBrowser,
    } from "../../integration/rest.js";
    import { listen } from "../../integration/ws.js";
    import type { BrowserUrlChangeEvent } from "../../integration/events.js";
    let browser: Browser;
    async function loadBrowser() {
        browser = await getBrowser();
    }
    onMount(async () => {
        await new Promise((resolve) => setTimeout(resolve, 250));
        await loadBrowser();
    });
    async function onKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            await browserNavigate(browser.url);
        }
    }
    async function handleGo() {
        await browserNavigate(browser.url);
    }
    async function handleBack() {
        await browserGoBack();
    }
    async function handleForward() {
        await browserGoForward();
    }
    async function handleReload() {
        await browserReload();
    }
    async function handleForceReload() {
        await browserForceReload();
    }
    listen("browserUrlChange", (e: BrowserUrlChangeEvent) => {
        browser.url = e.url;
    });
</script>

{#if browser}
    <div class="browser-controls">
        <button on:click={handleBack}>&larr;</button>
        <button on:click={handleForward}>&rarr;</button>
        <button on:click={handleReload}>&#x21bb;</button>
        <div class="address-bar">
            <input
                id="url"
                bind:value={browser.url}
                on:keypress={onKeyPress}
                placeholder="Enter URL"
            />
        </div>
        <button on:click={handleGo}>Go</button>
        <button on:click={handleForceReload}>Force Reload</button>
    </div>
{/if}

<style lang="scss">
    @import "../../colors.scss";

    .browser-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        bottom: 10px;
        left: 10px;
        right: 10px;
        background-color: rgba($background-color, $opacity);
        border-radius: 12px;
        box-shadow: $primary-shadow;
    }

    .address-bar {
        flex-grow: 1;
        margin: 0 10px;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid $border-thing;
        border-radius: 12px;
        outline: none;
        font-size: 14px;
        background-color: rgba($accent-color, 0.7);
        box-shadow: $primary-shadow;
        color: white;
    }

    button {
        background-color: $accent-color;
        color: white;
        border: none;
        padding: 10px 15px;
        margin: 7px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: $primary-shadow;
    }

    button:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
        box-shadow: $primary-shadow;
    }

    button:focus {
        outline: none;
    }
</style>
