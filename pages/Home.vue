<template>
  <div id="home">
    <LazyHydrate when-idle>
      <SfBanner
        class="hero"
        :title="$t(hero.title)"
        :subtitle="$t(hero.subtitle)"
        :background="hero.background"
        :image="hero.image"
        :image-tag="$globalImgTag"
      />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfBannerGrid :banner-grid="1" class="banner-grid">
        <template v-for="item in banners" v-slot:[item.slot]>
          <SfBanner
            :key="item.slot"
            :title="$t(item.title)"
            :subtitle="$t(item.subtitle)"
            :description="$t(item.description)"
            :button-text="$t(item.buttonText)"
            :image="item.image"
            :class="item.class"
            :image-tag="$globalImgTag"
          />
        </template>
      </SfBannerGrid>
    </LazyHydrate>

    <SfHeading :title="$t('Top-selling now')" :level="2" />

    <LazyHydrate when-visible>
        <SfCarousel class="carousel" :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }">
          <SfCarouselItem class="carousel__item" v-for="(product, i) in productsRef" :key="i">
            <SfProductCard
              :title="product.title"
              :image="product.image"
              :regular-price="product.price.regular"
              :max-rating="product.rating.max"
              :score-rating="product.rating.score"
              :show-add-to-cart-button="true"
              :is-in-wishlist="product.isInWishlist"
              class="carousel__item__product"
              @click:wishlist="toggleWishlist(i)"
              :image-tag="$globalImgTag"
              :image-height="215"
              :image-width="215"
            />
          </SfCarouselItem>
        </SfCarousel>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCallToAction
        class="call-to-action"
        :title="$t(callToAction.title)"
        :description="$t(callToAction.description)"
        :image="callToAction.image"
      >
        <template #button>
          <SfButton
            class="sf-call-to-action__button"
            data-testid="cta-button"
            @click="toggleNewsletterModal"
          >
            {{ $t(callToAction.buttonText) }}
          </SfButton>
        </template>
      </SfCallToAction>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <NewsletterModal @email-submitted="onSubscribe" />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <InstagramFeed />
    </LazyHydrate>
  </div>
</template>

<script>
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfSection,
  SfCarousel,
  SfProductCard,
  SfImage,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton
} from '@storefront-ui/vue';
import InstagramFeed from '~/components/InstagramFeed.vue';
import NewsletterModal from '~/components/NewsletterModal.vue';
import LazyHydrate from 'vue-lazy-hydration';
import { useUiState, useAppState } from '../composables';
import { useContext, ref, onMounted, computed } from '@nuxtjs/composition-api';
import { useStore } from '@vsf-enterprise/sapcc';

export default {
  name: 'Home',
  components: {
    InstagramFeed,
    SfHero,
    SfBanner,
    SfCallToAction,
    SfSection,
    SfCarousel,
    SfProductCard,
    SfImage,
    SfBannerGrid,
    SfHeading,
    SfArrow,
    SfButton,
    NewsletterModal,
    LazyHydrate
  },
  setup() {
    const { $config } = useContext();
    const { toggleNewsletterModal } = useUiState();
    const { isLogout, resetAppState } = useAppState();
    const { store } = useStore();

    const themeConfig = computed(() => {
      const isApparelStore = store.value.name === 'Apparel Store UK';
      const storeKey = isApparelStore ? 'apparel' : 'electronics';
      return $config.theme.homepage[storeKey];
    });

    const productsRef = ref(themeConfig.value.products);

    const toggleWishlist = (index) => {
      productsRef.value[index].isInWishlist = !productsRef.value[index].isInWishlist;
    };

    const onSubscribe = (emailAddress) => {
      console.log(`Email ${emailAddress} was added to newsletter.`);
      toggleNewsletterModal();
    };

    onMounted(async () => {
      if (isLogout.value) await resetAppState();
    });

    return {
      toggleWishlist,
      toggleNewsletterModal,
      onSubscribe,
      productsRef,
      ...themeConfig.value
    };
  }
};
</script>

<style lang="scss" scoped>
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  ::v-deep .sf-banner__title {
    width: 60%;
    text-transform: none;
    font: var(--font-weight--semibold) var(--h2-font-size)/1.2 var(--font-family--secondary);
    padding-top: var(--spacer-sm);
  }
  ::v-deep .sf-banner__subtitle {
    font: var(--font-weight--normal) var(--h6-font-size)/1.4 var(--font-family--secondary);
    color: var(--c-gray);
  }
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
    min-height: 586px;
  }
  @include for-mobile {
    margin: var(--spacer-xl) auto var(--spacer-lg);
    min-height: 230px;
    --banner-background-position: 30%;
    ::v-deep .sf-banner__subtitle,
    ::v-deep .sf-banner__title {
      width: 60%;
      text-align: left;
      white-space: normal;
    }
    ::v-deep .sf-banner__wrapper {
      padding: var(--spacer-xl) var(--spacer-sm) 0;
    }
  }
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
      text-decoration: none;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }
  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product {
      --product-card-add-button-transform: translate3d(0, 30%, 0);
    }
  }
  ::v-deep .sf-arrow--long .sf-arrow--right {
    --arrow-icon-transform: rotate(180deg);
    -webkit-transform-origin: center;
    transform-origin: center;
  }
}
</style>
