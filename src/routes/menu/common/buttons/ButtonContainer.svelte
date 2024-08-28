<div class="button-container">
    <slot />
</div>

<style lang="scss">
    @import "../../../../colors.scss";

    .button-container {
      background: none;
      display: flex;
      column-gap: 15px;
      padding: 15px;
      width: max-content;
      margin: -50px;
      margin-right: -48px;
      padding-top: 225px;
    }
</style>