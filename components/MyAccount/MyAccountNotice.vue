<template functional>
  <p class="my-account-notice">
    <slot />
  </p>
</template>

<script>
export default {
  name: 'MyAccountNotice'
};
</script>

<style lang="scss" scoped>
.my-account-notice {
  font-family: var(--font-family--primary);
  line-height: 1.6;
  margin: var(--spacer-lg) 0 0 0;
  font-size: var(--font-size--sm);

  ::v-deep a {
    color: var(--c-primary);
    text-decoration: underline;
      &:hover {
        color: var(--c-text);
      }
  }
}
</style>
