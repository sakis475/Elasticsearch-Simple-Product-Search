import { generateFakeProducts } from "../lib/helpers/generateFakeProducts";
import * as elasticLib from "../lib/helpers/elasticLib";
import { redisGet, redisSet } from "../lib/redis";

export async function getProducts(query: string, fields: string[] = ["title"]) {
  const cacheKey = JSON.stringify({ query, fields });
  const cached = await redisGet(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback if parsing fails
      return cached;
    }
  }
  const results = await elasticLib.queryByMatch(
    "products",
    "title",
    query,
    10,
    {
      fields,
      fuzzy: true,
    }
  );
  await redisSet(cacheKey, JSON.stringify(results), 3600); // cache for 1 hour
  return results;
}

export async function addRandomProductsToIndex(
  count: number,
  indexName: string = "products"
) {
  const products = generateFakeProducts(count);

  const docs = products.map((product) => ({
    document: product,
  }));

  const result = await elasticLib.bulkIndexDocuments(indexName, docs);
  return result;
}
