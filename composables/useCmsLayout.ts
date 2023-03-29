import { useContent, extractImage, extractComponents } from '@vsf-enterprise/amplience';
import { computed } from '@nuxtjs/composition-api';

const useCmsLayout = () => {
  const { search: searchStyleGuide, content: styleGuide } = useContent('style-guide');
  const { search: searchLayout, content: layout } = useContent('layout');

  const getLayout = () =>
    Promise.all([
      searchStyleGuide({
        custom: {
          type: 'styleGuide',
          field: 'title',
          value: 'styleGuide'
        }
      }),
      searchLayout({
        custom: {
          type: 'layout',
          field: 'title',
          value: 'cms-layout'
        }
      })
    ]);

  const header = computed(() => {
    const extractedHeader = layout.value.length && layout.value[0].header;

    return {
      logo: extractedHeader ? extractImage(extractedHeader.logo) : { url: null, alt: null },
      navigation: extractedHeader
        ? extractedHeader.navigation.filter((item) => item)
        : []
    };
  });

  const footer = computed(() => {
    const extractedFooter = layout.value.length && extractComponents([layout.value[0].footer])[0].props;

    return {
      items: extractedFooter
        ? extractedFooter.items.map((item) => {
          return {
            ...item,
            items: item.items
          };
        })
        : []
    };
  });

  return {
    getLayout,
    styleGuide,
    header,
    footer
  };
};

export default useCmsLayout;
