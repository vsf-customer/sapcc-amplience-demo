<template>
  <SfSection
    :title-heading="$t('Show yourself')"
    subtitle-heading="#YOURLOOK"
    class="instagram-feed"
  >
    <div class="instagram-feed__grid">
      <picture
        :data-index="index"
        v-for="(image, index) of images"
        :key="`instagram-feed-image-${index}`"
        class="instagram-feed__grid__image"
      >
        <source
          media="(min-width:1024px)"
          :srcset="$getCloudinaryImageUrl(image.desktop)"
        >
        <img :src="$getCloudinaryImageUrl(image.mobile)" :alt=image.alt>
      </picture>
    </div>
  </SfSection>
</template>

<script>
import { SfSection, SfImage } from '@storefront-ui/vue';
import { useContext, computed } from '@nuxtjs/composition-api';
import { useStore } from '@vsf-enterprise/sapcc';

export default {
  name: 'InstagramFeed',
  components: {
    SfSection,
    SfImage
  },
  setup () {
    const { $config } = useContext();
    const { store } = useStore();

    const images = computed(() => {
      const isApparelStore = store.value.name === 'Apparel Store UK';
      const storeKey = isApparelStore ? 'apparel' : 'electronics';
      return $config.theme.homepage[storeKey].instagramFeed;
    });

    return { images };
  }
};
</script>

<style lang="scss" scoped>
.instagram-feed {
  --heading-title-font-weight: var(--font-weight--semibold);
  --section-margin: var(--spacer-xl) 0;
  --section-content-margin: var(--spacer-xl) 0;
  --heading-title-font-size: var(--h2-font-size);
  @include for-desktop {
    --section-content-margin: var(--spacer-2xl) 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: .5rem;
    max-width: 393px;
    margin: 0 auto;

    @include for-desktop {
      grid-auto-flow: column;
      max-width: 60rem;
      gap: 1rem;
    }

    &__image {
      @include for-desktop {
        &:nth-child(4n-3) {
          grid-column-start: 1;
          grid-row: span 3;
        }
        &:nth-child(4n) {
          grid-column-start: 2;
          grid-row: span 3;
        }
        &:nth-child(4n - 2) {
          grid-column-start: 2;
          grid-row: span 1;
        }
        &:nth-child(4n-1) {
          grid-column-start: 1;
          grid-row: span 1;
        }
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
