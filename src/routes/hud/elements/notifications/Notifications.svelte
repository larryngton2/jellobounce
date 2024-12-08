<script lang="ts">
    import { flip } from "svelte/animate";
    import { listen } from "../../../../integration/ws";
    import { fly } from "svelte/transition";
    import Notification from "./Notification.svelte";
    import type { NotificationEvent } from "../../../../integration/events";
    import { expoOut } from "svelte/easing";
    import enable from "/sounds/enable.ogg";
    import disable from "/sounds/disable.ogg";
    import warn from "/sounds/warn.ogg";
    import success from "/sounds/success.ogg";
    import { Howl } from "howler";

    interface TNotification {
        animationKey: number;
        id: number;
        title: string;
        severity: string;
        message: string;
    }

    let notifications: TNotification[] = [];

    function addNotification(title: string, message: string, severity: string) {
        let animationKey = Date.now();
        const id = animationKey;

        if (severity === "ENABLED" || severity === "DISABLED") {
            // Check if there still exists an enable/disable notification for the same module
            const index = notifications.findIndex((n) => n.message === message);
            if (index !== -1) {
                // Set the id of the new notification to the old notification's id.
                // This will make svelte able to animate it correctly
                animationKey = notifications[index].animationKey;

                // Remove the old notification
                notifications.splice(index, 1);
            }
        }

        notifications = [
            { animationKey, id, title, message, severity },
            ...notifications,
        ];

        setTimeout(() => {
            notifications = notifications.filter((n) => n.id !== id);
        }, 1000);
    }

    function enableSound() {
        const esound = new Howl({ src: [enable], html5: true, preload: true });
        esound.play();
    }

    function disableSound() {
        const dsound = new Howl({ src: [disable], html5: true, preload: true });
        dsound.play();
    }

    function warnSound() {
        const wsound = new Howl({ src: [warn], html5: true, preload: true });
        wsound.play();
    }

    function successSound() {
        const ssound = new Howl({ src: [success], html5: true, preload: true });
        ssound.play();
    }

    listen("notification", (e: NotificationEvent) => {
        addNotification(e.title, e.message, e.severity);

        if (e.severity === "ENABLED") enableSound();
        if (e.severity === "DISABLED") disableSound();
        if (e.severity === "ERROR") warnSound();
        if (e.severity === "SUCCESS") successSound();
        if (e.severity === "INFO") warnSound();
    });
</script>

<div class="notifications">
    {#each notifications as { title, message, severity, animationKey } (animationKey)}
        <div
            animate:flip={{ duration: 200 }}
            in:fly={{ duration: 500, x: -50, easing: expoOut }}
            out:fly|global={{ duration: 500, x: -50 }}
        >
            <Notification {title} {message} {severity} />
        </div>
    {/each}
</div>
