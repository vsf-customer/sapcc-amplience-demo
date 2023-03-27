<template>
<nav class="my-account-nav" data-testid="my-account-navigation">
  <SfBar
    :back="!isMyAccountActive"
    :title="activeLink.meta.label"
    class="smartphone-only"
    @click:back="navigateToMyAccount"
  />
  <h1 class="my-account-nav__title desktop-only">
    {{ $t("My Account") }}
  </h1>
  <div
    v-for="(section, sectionIndex) in navSections"
    :key="`my-account-nav-section-${sectionIndex}`"
    :class="{ 'desktop-only': !isMyAccountActive }"
  >
    <h2 class='my-account-nav__section-title'>
      {{ $t(section.title) }}
    </h2>
    <SfList>
      <SfListItem
        v-for="(link, linkIndex) in section.links"
        :key="`nav-section-link-${sectionIndex}-${linkIndex}`"
        class="my-account-nav__link"
      >
        <SfMenuItem
          :label="$t(link.meta.label)"
          :link="localePath(link.path)"
        />
      </SfListItem>
    </SfList>
  </div>
  <SfMenuItem
    class="my-account-nav__link"
    :class="{ 'desktop-only': !isMyAccountActive }"
    :label="$t('Log out')"
    @click.native="handleLogout"
  />
</nav>
</template>

<script>
import { SfBar, SfList, SfMenuItem } from '@storefront-ui/vue';
import { defineComponent, useContext, useRouter, useRoute, computed } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'MyAccountNav',
  components: {
    SfBar,
    SfList,
    SfMenuItem
  },
  setup() {
    const { localePath, i18n } = useContext();
    const route = useRoute();
    const router = useRouter();

    const getRoutesPerSection = (sectionName) => {
      return router.options.routes
        .find(route => route.name.includes('my-account')).children
        .filter(route => route.meta.section === sectionName)
        .sort((route1, route2) => route1.meta.ordinal - route2.meta.ordinal);
    };

    const navSections = [
      {
        title: 'Personal Details',
        links: getRoutesPerSection('personal-details')
      },
      {
        title: 'Order Details',
        links: getRoutesPerSection('order-details')
      }
    ];

    const activeLink = computed(() => {
      const allLinks = navSections[0].links.concat(navSections[1].links);
      const activeLink = allLinks.find(link => localePath(link.path) === route.value.path);
      return activeLink ?? { path: 'my-account', meta: { label: i18n.t('My Account') } };
    });

    const isMyAccountActive = computed(() => activeLink.value.path === 'my-account');

    const navigateToMyAccount = () => {
      router.push(localePath({ name: 'my-account' }));
    };

    const handleLogout = async () => {
      router.push(localePath({ name: 'home', query: { logout: true } }));
    };

    return { navSections, activeLink, isMyAccountActive, navigateToMyAccount, handleLogout };
  }
});
</script>

<style lang="scss" scoped>
.my-account-nav {
  box-sizing: border-box;
  @include for-desktop {
    padding: var(--spacer-base);
    flex: 0 0 430px;
    background: var(--c-light);
  }
  &__title{
    margin-bottom: var(--spacer-base);
    font-weight: var(--font-weight--medium);
    font-size: var(--h3-font-size);
  }
  &__section-title {
    margin: var(--spacer-sm);
    font-size: var(--font-size--lg);
    @include for-desktop {
      margin: var(--spacer-xl) 0 0 0;
    }
  }
  &__link {
    padding: var(--spacer-sm);
    border-bottom: 1px solid var(--c-light);
    font-family: var(--font-family--secondary);
    &:hover,
    .nuxt-link-active {
      --menu-item-label-color: var(--c-primary);
    }
    @include for-desktop {
      margin: var(--spacer-base) 0;
      padding: 0;
    }
  }
}
</style>
