import { useContext } from '@nuxtjs/composition-api';

const createBreadcrumbFromCategory = (category) => {
  const { localePath } = useContext();
  return {
    text: category.name,
    link: localePath(`/c/${category.id}/${category.name}`)
  };
};

export const getCategoryBreadcrumbs = (categories = [], currentCategoryId, depth = 2) => {
  return categories.reduce((arr, category) => {
    if (depth === 0) return arr;

    const isCurrent = category.id === currentCategoryId;
    if (isCurrent) return [...arr, createBreadcrumbFromCategory(category)];

    const currentSubcategories = getCategoryBreadcrumbs(category.subcategories, currentCategoryId, depth - 1);
    if (currentSubcategories.length) {
      arr.push(createBreadcrumbFromCategory(category), ...currentSubcategories);
    }

    return arr;
  }, []);
};
