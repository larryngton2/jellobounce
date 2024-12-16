<script lang="ts">
  import ToolTip from "../ToolTip.svelte";
  import { getSession, openScreen } from "../../../../integration/rest";
  import { onMount } from "svelte";
  import { listen } from "../../../../integration/ws";
  import { fly } from "svelte/transition";
  import { expoOut } from "svelte/easing";

  let username = "";
  let avatar = "";
  let premium = true;

  async function refreshSession() {
    const session = await getSession();
    username = session.username;
    avatar = session.avatar;
    premium = session.premium;
  }

  onMount(async () => {
    await refreshSession();
  });

  listen("session", async () => {
    await refreshSession();
  });
</script>

<div
  class="account"
  transition:fly|global={{ duration: 500, y: 100, easing: expoOut }}
>
  <object data={avatar} type="image/png" class="avatar" aria-label="avatar">
    <img src="img/steve.png" alt="avatar" class="avatar" />
  </object>
  <div class="username">{username}</div>
  <div class="account-type">
    {#if premium}
      <span class="premium">Online</span>
    {:else}
      <span class="offline">Offline</span>
    {/if}
  </div>
  <button
    class="button-change-account"
    type="button"
    on:click={() => openScreen("altmanager")}
  >
    <ToolTip text="Change account" />
  </button>
</div>

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .account {
    padding: 15px 15px;
    border-radius: 12px;
    align-items: center;
    display: grid;
    grid-template-areas:
      "a b c"
      "a d e";
    grid-template-columns: max-content 1fr max-content;
    margin-top: -210px;
  }

  .avatar {
    height: 63px;
    width: 63px;
    border-radius: 50%;
    grid-area: a;
    margin-right: 10px;
  }

  .username {
    padding-top: 18px;
    font-weight: 600;
    color: white;
    font-size: 22px;
    grid-area: b;
    align-self: flex-end;
    margin-right: 7px;
    text-shadow: $primary-shadow;
  }

  .account-type {
    padding-top: 20px;
    font-weight: 400;
    font-size: 20px;
    grid-area: c;
    align-self: flex-start;

    .premium {
      color: $account-online-color;
      text-shadow: $primary-shadow;
    }

    .offline {
      color: $text-dimmed-color;
      text-shadow: $primary-shadow;
    }
  }

  .button-change-account {
    background-color: transparent;
    border: none;
    grid-area: a;
    position: relative;
    height: max-content;
    cursor: pointer;
    width: 63px;
    height: 63px;
    border-radius: 50%;
  }
</style>
