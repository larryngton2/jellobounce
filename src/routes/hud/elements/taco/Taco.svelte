<script lang="ts">
  import {fly} from "svelte/transition";
  import {expoInOut} from "svelte/easing";
  import {onMount} from 'svelte';
  import {getSession} from "../../../../integration/rest";
  import {listen} from "../../../../integration/ws";
  
  let username = "";
  let avatar = "";

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

<div class="h">
    <div class="userinfo" transition:fly|global={{duration: 500, y: 50, easing: expoInOut}}>
        <object data={avatar} type="image/png" class="avatar" aria-label="avatar">
            <img src="img/steve.png" alt=avatar class="avatar">
        </object>
    <span class="username">{username}</span>
    </div>
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .userinfo {
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
</style>