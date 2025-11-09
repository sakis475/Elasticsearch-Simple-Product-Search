import { faker } from "@faker-js/faker";
import { Product } from "../../types/Product";

export const generateFakeProducts = (count: number): Product[] => {
  const products: Product[] = [];

  count = Math.min(Math.max(0, count), 10000); // Ensure non-negative count and cap at 10000

  for (let i = 0; i < count; i++) {
    products.push({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()), // as number
      category: faker.commerce.department(),
    });
  }

  return products;
};
