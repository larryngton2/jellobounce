<script lang="ts">
  import {fly} from "svelte/transition";
  import {expoInOut} from "svelte/easing";
  import {onMount} from 'svelte';
  import {getSession} from "../../../../integration/rest";
  import {listen} from "../../../../integration/ws";
  
  let username = "";
  let premium = true;
  let avatar = "";

  async function refreshSession() {
      const session = await getSession();
      username = session.username;
      premium = session.premium;
      avatar = session.avatar;
  }

  onMount(async () => {
      await refreshSession();
  });

  listen("session", async () => {
      await refreshSession();
  });
</script>

<div class="h">
    <div class="userinfo" transition:fly|global={{duration: 500, y: 50, easing: expoInOut}}>
        <object data={avatar} type="image/png" class="avatar" aria-label="avatar">
            <img src="img/steve.png" alt=avatar class="avatar">
        </object>
    <span class="username">{username} |
        {#if premium}
        <span class="status">Online</span>
        {:else}
        <span class="status">Offline</span>
        {/if}
    </span>
    </div>
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .userinfo {
    color: white;
    text-shadow: 0px 0px 5px rgba($shadow-color, 0.5);
    font-family: "sf-pro";
    font-weight: 400;
    font-size: 15px;

        .avatar {
            height: 18px;
            width: 18px;
            border-radius: 6px;
            margin-bottom: -3.5px;
            box-shadow: 0px 0px 5px rgba($shadow-color, 0.5);
            margin-right: 3px;
        }
    }
</style>