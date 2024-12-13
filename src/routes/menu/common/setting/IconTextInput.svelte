<script lang="ts">
  export let icon: string;
  export let title: string;
  export let type = "text";
  export let value = "";
  export let maxLength: number | null = null;
  export let pattern: string | null = null;
</script>

<div class="icon-text-input">
  <div class="icon">
    <img src="img/menu/icon-{icon}.svg" alt={icon} />
  </div>
  {#if type === "text"}
    <input
      {pattern}
      maxlength={maxLength}
      class="input"
      spellcheck="false"
      type="text"
      placeholder={title}
      bind:value
      autocomplete="off"
    />
  {:else if type === "password"}
    <input
      {pattern}
      maxlength={maxLength}
      class="input"
      type="password"
      placeholder={title}
      bind:value
      autocomplete="off"
    />
  {/if}
  <div class="button-container">
    <slot />
  </div>
</div>

<style lang="scss">
  @import "../../../../colors.scss";

  .icon-text-input {
    display: grid;
    grid-template-columns: max-content 1fr 60px;
    margin-bottom: -15px;
    box-shadow: $primary-shadow;
    border-radius: 12px;
  }

  .icon {
    height: 64px;
    width: 64px;
    background-color: rgba($background-color, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px 0 0 12px;
  }

  .input {
    color: $text-color;
    font-size: 20px;
    background-color: $setting-color;
    border: none;
    padding: 0 20px 0 18px;
    width: 100%;

    &:invalid {
      border: solid 2px $menu-error-color;
      box-shadow: 0 0 10px rgba(red, 0.25);
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    background-color: $setting-color;
    border-radius: 0 12px 12px 0;
    transition: ease background-color 0.25s;

    &:hover {
      background-color: rgba($background-color, 0.35);
    }
  }
</style>
