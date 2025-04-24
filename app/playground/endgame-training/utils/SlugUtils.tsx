import {
  EndgameCategory,
  EndgameSubcategory,
} from "../types/EndgameTrainingTypes";

export function convertToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function getCategoryNameFromSlug(
  categories: EndgameCategory[],
  categorySlug: string
): string {
  const category = categories.find(
    (cat) => convertToSlug(cat.name) === categorySlug
  );

  return category?.name || categorySlug;
}

export function getSubcategoryFromSlug(
  categories: EndgameCategory[],
  categorySlug: string,
  positionSlug: string
): EndgameSubcategory | undefined {
  const category = categories.find(
    (cat) => convertToSlug(cat.name) === categorySlug
  );

  if (!category) return undefined;

  return category.subcategories.find(
    (sub) => convertToSlug(sub.name) === positionSlug
  );
}

export function getSubcategoryNameFromSlug(
  categories: EndgameCategory[],
  categorySlug: string,
  positionSlug: string
): string {
  const subcategory = getSubcategoryFromSlug(
    categories,
    categorySlug,
    positionSlug
  );

  return subcategory?.name || positionSlug;
}
