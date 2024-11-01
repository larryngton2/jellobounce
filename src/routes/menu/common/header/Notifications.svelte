<script lang="ts">
    import {fly} from "svelte/transition";
    import {notification, type TNotification} from "./notification_store";
    import {onMount} from "svelte";

    interface NotificationWithId {
        notification: TNotification;
        id: number;
    }

    let notifications: NotificationWithId[] = [];

    onMount(() => {
       notifications = [];
    });

    notification.subscribe((v) => {
        if (!v) {
            return;
        }
        const id = Date.now();
        const n = {
            notification: v,
            id
        };
        notifications = [...notifications, n];
        setTimeout(() => {
            notifications = notifications.filter(n => n.id !== id);
        }, (v?.delay ?? 3) * 1000);
    });
</script>

<div class="notifications">
    {#each notifications as n (n.id)}
        <div class="notification" transition:fly|global={{duration: 500, y: 100}}>
            <div class="icon" class:error={n.notification.error}>
                <img src="img/hud/notification/icon-info.svg" alt="info">
            </div>
            <div class="title">{n.notification.title}</div>
            <div class="message">{n.notification.message}</div>
        </div>
    {/each}
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .notifications {
    display: grid;
    grid-template-columns: 1fr;
    z-index: 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
  }

  .notification {
    grid-row-start: 1;
    grid-column-start: 1;
    background-color: rgba($background-color, $opacity);
    border-radius: 12px;
    display: grid;
    grid-template-areas:
        "a b"
        "a c";
    grid-template-columns: max-content 1fr;
    overflow: hidden;
    padding-right: 7px;
    //border: $border-thing;
    box-shadow: $primary-shadow;
    text-shadow: $primary-shadow;

    .title {
      color: $text-color;
      font-weight: 600;
      font-size: 18px;
      grid-area: b;
      align-self: flex-end;
    }

    .message {
      color: $text-dimmed-color;
      font-weight: 400;
      grid-area: c;
    }

    .icon {
      grid-area: a;
      height: 55px;
      width: 55px;
      //background-color: rgba($accent-color, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;

      &.error {
        background-color: $menu-error-color;
      }
    }
  }
</style>