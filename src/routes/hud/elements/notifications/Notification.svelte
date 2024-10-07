<script lang="ts">
    export let title: string;
    export let message: string;
    export let severity: string;
</script>

<div class="notification">
    <div class="icon {severity.toString().toLowerCase()}"/>
    <div class="title">{title}</div>
    <div class="message">{message}</div>
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .notification {
    display: grid;
    grid-template-areas:
            "a b"
            "a c";
    grid-template-columns: max-content 1fr;
    column-gap: 7px;
    background: rgba($background-color, $opacity);
    border-radius: 12px;
    min-width: 250px;
    overflow: hidden;
    padding: 7px;
    margin-bottom: 7px;
    box-shadow: $primary-shadow;
    border: $border-thing;
    text-shadow: $primary-shadow;
  }

  .icon {
    height: 40px;
    width: 40px;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 100px;
    grid-area: a;
    transition: background-color 0.2s;
    position: relative;

    &.success {
      background-color: #4dac6800;
      background-image: url("/img/hud/notification/icon-success.svg");
    }

    &.error {
      background-color: #fc413000;
      background-image: url("/img/hud/notification/icon-error.svg");
    }

    &.info {
      background-color: #2e2e2e00;
      background-image: url("/img/hud/notification/icon-info.svg");
    }

    &.disabled,
    &.enabled {
      &::after {
        content: "";
        position: absolute;
        height: 10px;
        width: 10px;
        border-radius: 100px;
        top: 50%;
        transform: translate(-50%, -50%);
        background: white;
        transition: all 0.2s ease-out;
      }

      background-image: url("/img/hud/notification/icon-toggle.svg");
    }

    &.enabled {
      background-color: #4dac6800;

      &::after {
        left: 62%;
      }
    }

    &.disabled {
      background-color: #fc413000;

      &::after {
        left: 38%;
      }
    }
  }

  .title {
    grid-area: b;
    font-size: 16px;
    color: white;
    font-weight: 600;
  }

  .message {
    grid-area: c;
    font-size: 14px;
    color: #cbd1e3;
    font-weight: 500;
  }
</style>
