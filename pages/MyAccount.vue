<template>
  <div id="my-account">
    <SfBreadcrumbs
      class="my-account__breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="my-account__content">
      <MyAccountNav />
      <div class="my-account__child">
        <NuxtChild />
      </div>
    </div>
  </div>
</template>

<script>
import { SfBreadcrumbs } from '@storefront-ui/vue';
import { reactive } from '@nuxtjs/composition-api';
import { MIDDLEWARE } from '../helpers/constants';
import { defineComponent, useContext } from '@nuxtjs/composition-api';
import MyAccountNav from '~/components/MyAccount/MyAccountNav.vue';

export default defineComponent({
  name: 'MyAccount',
  components: {
    SfBreadcrumbs,
    MyAccountNav
  },
  middleware: [MIDDLEWARE.IS_AUTHENTICATED],
  setup() {
    const { i18n, localePath } = useContext();

    const breadcrumbs = reactive([
      {
        text: i18n.t('Home'),
        link: localePath('/')
      },
      {
        text: i18n.t('My Account'),
        link: '#'
      }
    ]);

    return { breadcrumbs };
  }
});
</script>

<style lang="scss" scoped>
#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.my-account{
  &__breadcrumbs {
    margin: var(--spacer-base) 0 var(--spacer-lg);
  }
  &__content{
    display: flex;
    @include for-mobile {
      flex-direction: column;
    }
    @include for-desktop {
      min-height: 100vh;
    }
  }
  &__child{
    width: 100%;
    @include for-desktop {
      padding: var(--spacer-lg);
    }
  }
}
</style>
