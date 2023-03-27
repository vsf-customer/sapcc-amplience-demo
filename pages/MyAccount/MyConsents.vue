<template>
  <SfTabs
    v-if="consents && consentTemplates.length"
    :open-tab="1"
  >
    <SfTab :title="$t('My Consents')">
      <MyAccountHeading>
        {{ $t('Manage your privacy, preferences and consent in a transparent way and in compliance with international privacy regulations') }}
      </MyAccountHeading>
      <div :key="item.id" v-for="item in consentTemplates">
        <p>
          <strong>
            {{ item.name }}
          </strong>
        </p>
        <SfCheckbox
          v-model="item.selected"
          :name="item.id"
          :label="item.description"
          @change="onChange($event, item)"
        />
      </div>
    </SfTab>
  </SfTabs>
</template>

<script lang="ts">
import { SfTabs, SfButton, SfProperty, SfCheckbox } from '@storefront-ui/vue';
import { useConsents } from '@vsf-enterprise/sapcc';
import { computed, onMounted } from '@nuxtjs/composition-api';
import MyAccountHeading from '~/components/MyAccount/MyAccountHeading.vue';

export default {
  name: 'MyConsents',
  components: {
    SfTabs,
    SfButton,
    SfProperty,
    SfCheckbox,
    MyAccountHeading
  },
  setup() {
    const {
      load,
      consents,
      giveConsent,
      removeConsent,
      isAccepted
    } = useConsents();

    const consentTemplates = computed(() => consents.value.consentTemplates.map(template => ({
      ...template,
      selected: isAccepted(template)
    })));

    onMounted(async () => {
      await load({});
    });

    const onChange = async (event, item) => {
      if (item.selected) {
        await giveConsent({
          consentTemplateId: item.id,
          consentTemplateVersion: item.version
        });
        return;
      }
      await removeConsent({
        consentTemplateId: item.id,
        consentCode: item.currentConsent.code
      });
    };

    return {
      consents,
      consentTemplates,
      onChange
    };
  }
};
</script>

<style lang="scss" scoped>
@include sf-tab--orphan;
</style>
