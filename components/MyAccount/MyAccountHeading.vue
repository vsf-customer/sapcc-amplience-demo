<template functional>
  <h6 class="my-account-heading">
    <slot />
  </h6>
</template>

<script>
export default {
  name: 'MyAccountHeading'
};
</script>

<style lang="scss" scoped>
.my-account-heading {
  font-family: var(--font-family--primary);
  line-height: 1.6;
  font-size: var(--font-size--base);
  margin: 0 0 var(--spacer-base);
  font-weight: var(--font-weight-normal);
}
</style>
