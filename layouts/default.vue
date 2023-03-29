<template>
  <div>
    <RenderContent v-if="styleGuide.length" :content="styleGuide" />
    <LazyHydrate when-visible>
      <TopBar class="desktop-only" />
    </LazyHydrate>

    <AppHeader />

    <div id="layout">
      <nuxt :key="this.$route.fullPath" />
      <BottomNavigation />
      <CartSidebar />
      <WishlistSidebar />
      <CategoryFilters />
      <LoginModal />
      <Notification />
      <client-only>
        <CookieConsent />
      </client-only>
      <AnonymousConsentsModal />
    </div>
    <LazyHydrate when-visible>
      <AppFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader';
import BottomNavigation from '~/components/BottomNavigation';
import AppFooter from '~/components/AppFooter';
import TopBar from '~/components/TopBar';
import CartSidebar from '~/components/CartSidebar';
import WishlistSidebar from '~/components/WishlistSidebar';
import LoginModal from '~/components/LoginModal';
import LazyHydrate from 'vue-lazy-hydration';
import Notification from '~/components/Notification';
import CookieConsent from '~/components/CookieConsent';
import AnonymousConsentsModal from '~/components/AnonymousConsentsModal';
import CategoryFilters from '~/components/Category/CategoryFilters';
import { useAppState } from '~/composables';
import { onMounted } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useStore } from '@vsf-enterprise/sapcc';
import useCmsLayout from '~/composables/useCmsLayout';

export default {
  name: 'DefaultLayout',

  components: {
    LazyHydrate,
    TopBar,
    AppHeader,
    BottomNavigation,
    AppFooter,
    CartSidebar,
    WishlistSidebar,
    LoginModal,
    Notification,
    CookieConsent,
    AnonymousConsentsModal,
    CategoryFilters
  },

  setup() {
    const { isLogout, loadInitialAppState } = useAppState();
    const { load: loadStore } = useStore();
    const { getLayout, styleGuide } = useCmsLayout();

    onSSR(async () => {
      await loadStore();
      await Promise.all([
        getLayout()
      ]);
    });

    onMounted(async () => {
      if (!isLogout.value) await loadInitialAppState();
    });

    return {
      styleGuide
    };
  },

  head () {
    return this.$nuxtI18nHead({ addSeoAttributes: true });
  }
};
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';

#layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS
html {
  width: auto;
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}
</style>
