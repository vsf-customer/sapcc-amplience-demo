<template>
  <div>
    <p>{{ address.title }} {{ address.firstName }} {{ address.lastName }}</p>
    <p>{{ address.line1 }}</p>
    <p v-if="address.line2">{{ address.line2 }}</p>
    <p>{{ address.town }} {{ address.region }} {{ address.district }}</p>
    <p v-if="address.country">{{ address.country.name }} {{ address.postalCode }}</p>
    <p v-if="address.phone" class="phone">{{ address.phone }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserAddress',
  props: {
    address: {
      type: Object
    }
  }
};
</script>
<style scoped>
p {
  margin: 0;
}
.phone {
  margin-top: var(--spacer-base);
}
</style>
