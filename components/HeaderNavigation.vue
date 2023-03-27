<template>
  <div class="header-navigation">
    <div data-testid="header-navigation" class="sf-header__navigation desktop-only">
      <SfHeaderNavigationItem
        v-for="item in navigationItems"
        :key="item.id"
        class="nav-item"
        data-testid="category"
        :label="item.name"
        :link="localePath(item.route)"
      />
    </div>
    <SfModal class="smartphone-only" :visible="isMobileMenuOpen">
      <SfList>
        <SfListItem
          v-for="item in navigationItems"
          :key="item.id"
          class="nav-item sf-header-navigation-item"
        >
          <SfMenuItem
            :label="item.name"
            class="sf-header-navigation-item__menu-item"
            :link="localePath(item.route)"
            @click.native="toggleMobileMenu"
          />
        </SfListItem>
      </SfList>
    </SfModal>
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { SfMenuItem, SfModal, SfList } from '@storefront-ui/vue';
import { useUiState } from '~/composables';

export default defineComponent({
  name: 'HeaderNavigation',
  components: {
    SfMenuItem,
    SfModal,
    SfList
  },
  props: {
    categories: {
      type: Array,
      default: () => ([])
    }
  },
  setup(props) {
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();

    const navigationItems = computed(() => {
      return props.categories.map(category => ({ name: category.name, route: { name: 'category', params: { slug_1: category.id } }}));
    });

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      navigationItems
    };
  }
});
</script>

<style lang="scss" scoped>
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
.sf-list__item {
  @include for-mobile {
    display: block;
  }
}
.sf-modal {
  ::v-deep &__bar {
    display: none;
  }
  ::v-deep &__content {
    padding: var(--modal-content-padding, 0);
  }
}
</style>
