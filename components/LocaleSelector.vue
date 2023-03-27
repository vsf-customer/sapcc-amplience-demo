<template>
  <div class="container">
    <SfButton
      v-if="availableLanguages.length"
      class="container__lang container__lang--selected"
      @click="toggleLocaleSelector"
    >
      <SfImage
        :src="`/icons/langs/${locale}.webp`"
        :width="20"
        :height="20"
        alt="Flag"
        :image-tag="$globalImgTag"
      />
    </SfButton>
    <SfBottomModal
      :is-open="isOpen"
      :title="$t('Choose language')"
      @click:close="toggleLocaleSelector"
    >
      <SfList>
        <SfListItem v-for="lang in availableLanguages" :key="lang.isocode">
          <nuxt-link :to="switchLocalePath(lang.isocode)">
            <SfCharacteristic class="language">
              <template #title>
                <span>{{ lang.name }}</span>
              </template>
              <template #icon>
                <SfImage
                  :src="`/icons/langs/${lang.isocode}.webp`"
                  :width="20"
                  :height="20"
                  alt="Flag"
                  class="language__flag"
                  :image-tag="$globalImgTag"
                />
              </template>
            </SfCharacteristic>
          </nuxt-link>
        </SfListItem>
      </SfList>
    </SfBottomModal>
  </div>
</template>

<script>
import {
  SfImage,
  SfSelect,
  SfButton,
  SfList,
  SfBottomModal,
  SfCharacteristic
} from '@storefront-ui/vue';
import { ref, computed, useContext } from '@nuxtjs/composition-api';
import { useStore } from '@vsf-enterprise/sapcc';

export default {
  components: {
    SfImage,
    SfSelect,
    SfButton,
    SfList,
    SfBottomModal,
    SfCharacteristic
  },
  setup() {
    const { store } = useStore();
    const { i18n: { locale } } = useContext();

    const isOpen = ref(false);

    const availableLanguages = computed(() =>
      store.value?.languages.filter((language) => language.isocode !== locale) ?? []
    );

    function toggleLocaleSelector () {
      isOpen.value = !isOpen.value;
    }

    return {
      availableLanguages,
      locale,
      isOpen,
      toggleLocaleSelector
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 calc(#{var(--spacer-2xs)} * -1);
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  .sf-bottom-modal {
    z-index: 2;
    left: 0;
    @include for-desktop {
      --bottom-modal-height: 100vh;
    }
  }
  .sf-list {
    .language {
      padding: var(--spacer-sm);
      &__flag {
        margin-right: var(--spacer-sm);
      }
    }
    @include for-desktop {
      display: flex;
    }
  }
  &__lang {
    width: 20px;
    --button-box-shadow: none;
    background: none;
    padding: 0 var(--spacer-2xs);
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;
    &:hover,
    &--selected {
      opacity: 1;
    }
  }
}
</style>
