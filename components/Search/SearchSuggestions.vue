<template>
  <SfMegaMenuColumn
    class="search-suggestions sf-mega-menu-column--pined-content-on-mobile"
  >
    <template #title>
      <SfMenuItem
        class="sf-mega-menu-column__header"
        :label="title"
        icon=""
      />
    </template>
    <SfList>
      <SfListItem
        class="search-suggestion"
        v-for="suggestion in suggestions"
        :key="suggestion.id"
      >
        <slot name="suggestion" v-bind="{ suggestion }">
          <SfMenuItem
            :label="suggestion.name || 'Suggestion'"
            :link="localePath(getCatLink(suggestion))"
            icon=""
          />
        </slot>
      </SfListItem>
    </SfList>
  </SfMegaMenuColumn>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfList, SfMenuItem } from '@storefront-ui/vue';
import { useUiHelpers } from '~/composables';
export default defineComponent({
  name: 'SearchSuggestions',
  components: { SfList, SfMenuItem },
  props: {
    title: {
      type: String,
      required: true
    },
    suggestions: {
      type: Array,
      default: () => ([])
    }
  },
  setup() {
    const { getCatLink } = useUiHelpers();
    return { getCatLink };
  }
});
</script>

<style lang="scss" scoped>
.search {
  &-suggestions {
    @include for-mobile {
      width: 100%;
    }
    ::v-deep .sf-mega-menu-column__header {
      pointer-events: none;
      margin: 0;
      @include for-desktop {
        margin-bottom: var(--spacer-sm);
        display: flex;
      }
    }
  }
  &-suggestion {
    @include for-mobile {
      padding-left: var(--spacer-sm);
      padding-right: var(--spacer-sm);
    }
  }
}
</style>
