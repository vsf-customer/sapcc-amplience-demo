<template>
  <div class="sidebar-no-items">
    <div class="empty-cart__banner">
      <SfImage
        :alt="$t('Empty bag')"
        class="sidebar-no-items__image"
        src="/icons/empty-cart.svg"
        :width="256"
        :height="180"
      />
      <SfHeading
        :title="$t('No products here')"
        :level="2"
        class="sidebar-no-items__heading"
        :description="$t('Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.')"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfImage, SfHeading } from '@storefront-ui/vue';

export default defineComponent({
  name: 'SidebarNoItems',
  components: { SfImage, SfHeading }
});
</script>

<style lang="scss" scoped>
.sidebar-no-items {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__image {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}
</style>
