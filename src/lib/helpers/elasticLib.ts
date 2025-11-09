import { Client, errors } from "@elastic/elasticsearch";
import type {
  IndexResponse,
  DeleteResponse,
} from "@elastic/elasticsearch/lib/api/types";
import { ErrorException } from "../../errorHandler/errorException";
import { ErrorCode } from "../../errorHandler/errorCode";

// Lazy singleton for Elasticsearch client
let client: Client | null = null;
function getClient(): Client {
  if (!client) {
    if (!process.env.ELASTIC_HOST) {
      throw new Error("ELASTIC_HOST is not defined in environment variables.");
    }
    client = new Client({
      node: process.env.ELASTIC_HOST,
      requestTimeout: 5000,
    });
    console.log("Elasticsearch client initialized.");
  }
  return client;
}

/**
 * Pings Elasticsearch to check if the connection is alive.
 * @returns {Promise<boolean>} - True if alive, false otherwise.
 */
export const ping = async (): Promise<boolean> => {
  try {
    const response = await getClient().ping();
    console.log("Elasticsearch ping successful:", response);
    return true;
  } catch (error: unknown) {
    console.error("Elasticsearch cluster is down!", error);
    return false;
  }
};

/**
 * Indexes a document (adds it if new, updates it if ID exists).
 * @param {string} indexName - The name of the index (e.g., 'users', 'logs').
 * @param {object} document - The JSON document to store.
 * @param {string} [id] - Optional: The specific ID for the document.
 * @returns {Promise<IndexResponse>} - The result from Elasticsearch.
 */
export const indexDocument = async (
  indexName: string,
  document: Record<string, any>,
  id: string | null = null
): Promise<IndexResponse> => {
  if (!indexName || !document) {
    throw new Error("Index name and document are required.");
  }

  try {
    const indexPayload: {
      index: string;
      document: Record<string, any>;
      id?: string;
    } = {
      index: indexName,
      document: document,
    };

    if (id) {
      indexPayload.id = id;
    }

    const result = await getClient().index(indexPayload);
    return result;
  } catch (err: unknown) {
    throw err;
  }
};

/**
 * Bulk indexes multiple documents.
 * @param {string} indexName - The name of the index (e.g., 'users', 'logs').
 * @param {Array<{ document: Record<string, any>; id?: string }>} docs - Array of documents (with optional IDs).
 * @returns {Promise<any>} - The bulk response from Elasticsearch.
 */
export const bulkIndexDocuments = async (
  indexName: string,
  docs: Array<{ document: Record<string, any> }>
): Promise<any> => {
  if (!indexName || !Array.isArray(docs) || docs.length === 0) {
    throw new Error("Index name and non-empty docs array are required.");
  }

  // Prepare bulk body: action/metadata line, then document line
  const body = docs.flatMap(({ document }) => [
    { index: { _index: indexName } },
    document,
  ]);

  try {
    const result = await getClient().bulk({ refresh: true, body });
    return result;
  } catch (err: unknown) {
    console.error("Error bulk indexing documents:", err);
    throw err;
  }
};

/**
 * Performs a basic text search using 'match'.
 * @param {string} indexName - The index to search in.
 * @param {string} field - The document field to search against (e.g., 'username').
 * @param {string} query - The text value to search for.
 * @param {object} [options] - Optional: Additional search options.
 * @param {string[]} [options.fields] - Optional: Specific fields to return.
 * @param {boolean} [options.fuzzy] - Optional: Enable fuzzy matching.
 * @returns {Promise<Array<{ _score: number; [key: string]: any }>>} - An array of the matching documents with relevance scores.
 */
export const queryByMatch = async (
  indexName: string,
  field: string,
  query: string,
  size?: number,
  options?: { fields?: string[]; fuzzy?: boolean }
): Promise<Array<{ _score: number; [key: string]: any }>> => {
  if (!indexName || !field || !query) {
    throw new Error("Index name, field, and query are required.");
  }

  try {
    const matchQuery = options?.fuzzy
      ? { match: { [field]: { query, fuzziness: "AUTO" } } }
      : { match: { [field]: query } };

    const result = await getClient().search<Record<string, any>>({
      index: indexName,
      query: matchQuery,
      size: size ?? 10,
      _source: options?.fields ?? true,
    });

    const hits = result.hits.hits;
    return hits.map((hit) => ({
      _score: hit._score ?? 0,
      ...(hit._source || {}),
    }));
  } catch (err: unknown) {
    console.error("Error searching documents:", err);
    throw err;
  }
};

/**
 * Performs a "match all" query to get all documents in an index.
 * @param {string} indexName - The index to search in.
 * @returns {Promise<Record<string, any>[]>} - An array of all documents (_source).
 */
export const getAllDocuments = async (
  indexName: string
): Promise<Record<string, any>[]> => {
  if (!indexName) {
    throw new Error("Index name is required.");
  }

  try {
    const result = await getClient().search<Record<string, any>>({
      index: indexName,
      query: {
        match_all: {},
      },
      size: 1000,
    });

    const hits = result.hits.hits;
    return hits.map((hit) => hit._source!);
  } catch (err: unknown) {
    console.error("Error getting all documents:", err);
    throw err;
  }
};

/**
 * Deletes a document by its specific ID.
 * @param {string} indexName - The index the document is in.
 * @param {string} id - The ID of the document to delete.
 * @returns {Promise<DeleteResponse | { result: 'not_found' }>} - The result.
 */
export const deleteDocumentById = async (
  indexName: string,
  id: string
): Promise<DeleteResponse | { result: "not_found" }> => {
  if (!indexName || !id) {
    throw new ErrorException(ErrorCode.NotFound);
  }

  try {
    const result = await getClient().delete({
      index: indexName,
      id: id,
    });
    return result;
  } catch (err: unknown) {
    // Handle "not found" gracefully
    if (err instanceof errors.ResponseError && err.statusCode === 404) {
      throw new ErrorException(ErrorCode.NotFound);
    }
    throw err;
  }
};

/**
 * Deletes all documents from a given index.
 * @param {string} indexName - The index to delete all documents from.
 * @returns {Promise<any>} - The response from Elasticsearch.
 */
export const deleteAllDocuments = async (indexName: string): Promise<any> => {
  if (!indexName) {
    throw new Error("Index name is required.");
  }

  try {
    const result = await getClient().deleteByQuery({
      index: indexName,
      query: {
        match_all: {},
      },
      refresh: true,
    });
    return result;
  } catch (err: unknown) {
    console.error("Error deleting all documents:", err);
    throw err;
  }
};
