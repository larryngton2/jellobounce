<div class="button-container">
  <slot />
</div>

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .button-container {
    background: none;
    display: flex;
    column-gap: 15px;
    width: max-content;
    padding-top: 25px;
  }
</style>
