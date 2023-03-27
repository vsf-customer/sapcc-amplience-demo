import { useRoute, useRouter } from '@nuxtjs/composition-api';
import { AgnosticFacetSearchParams, AgnosticCategoryTree } from '@vue-storefront/core';
import { Facet, FacetValue } from '@vsf-enterprise/sap-commerce-webservices-sdk';

const defaultNonFilters = ['page', 'sort', 'term', 'itemsPerPage'];

const reduceFilters = (query) => (prev, curr) => {
  const makeArray =
    Array.isArray(query[curr]) || defaultNonFilters.includes(curr);

  return {
    ...prev,
    [curr]: makeArray ? query[curr] : [query[curr]]
  };
};

const getFiltersDataFromUrl = ({ router, onlyFilters, nonFilters }) => {
  const { query } = router.history.current;
  return Object.keys(query)
    .filter((f) =>
      onlyFilters ? !nonFilters.includes(f) : nonFilters.includes(f)
    )
    .reduce(reduceFilters(query), {});
};

const useUiHelpers = () => {
  const router = useRouter();
  const route = useRoute();

  // TODO: replace old AgnosticFacetSearchParams interface by AgnosticSearchParams
  const getSearchFromURL = (searchTerm?: string): AgnosticFacetSearchParams => {
    const { query, params } = route.value;

    return {
      // Page in SAP starts form 0, but in ui we can't display page 0, so that's why we subtract one from page query.
      currentPage: Number(query.page as string) - 1 || 0,
      sort: String(query.sort) || 'relevance',
      filters: {
        allCategories: [params.slug_1]
      },
      query: route.value.query.query,
      pageSize: Number(query.itemsPerPage as string) || 20,
      searchTerm: searchTerm || (query.term as string)
    };
  };

  const getCatLink = (category: AgnosticCategoryTree) => {
    const params = getFiltersDataFromUrl({
      router,
      onlyFilters: false,
      nonFilters: ['sort', 'term', 'itemsPerPage']
    });
    return {
      path: `/c/${category.id}/${category.name}`,
      query: params
    };
  };

  const changeSorting = (sort: string): void => {
    const { query } = route.value;
    router.push({ query: { ...query, sort, page: '1' } });
  };

  const changeFilters = (option: FacetValue): void => {
    router.push({
      query: {
        ...route.value.query,
        query: option.query.query.value
      }
    });
  };

  const changeItemsPerPage = (
    itemsPerPage: string,
    previousItemsPerPage: number | string
  ): void => {
    const { query } = router.currentRoute;
    const page = Number(query.page) || 1;
    previousItemsPerPage = Number(query.itemsPerPage || previousItemsPerPage);
    const reCalculatedPage = Math.floor(
      (((page - 1) * previousItemsPerPage) / Number(itemsPerPage)) + 1
    ).toString();

    router.push({
      query: {
        ...query,
        itemsPerPage,
        page: reCalculatedPage
      }
    });
  };

  // eslint-disable-next-line
  const isFacetColor = (facet: Facet): boolean => facet.name === 'Color';

  return {
    getSearchFromURL,
    getCatLink,
    changeSorting,
    changeFilters,
    changeItemsPerPage,
    isFacetColor
  };
};

export default useUiHelpers;
