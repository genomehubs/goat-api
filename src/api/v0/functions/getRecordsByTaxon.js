import { checkResponse } from "./checkResponse";
import { client } from "./connection";
import { processHits } from "./processHits";
import { searchByTaxon } from "../queries/searchByTaxon";
import { searchByTaxonRawValues } from "../queries/searchByTaxonRawValues";
import { searchByParams } from "../queries/searchByParams";
import { searchByParamsRawValues } from "../queries/searchByParamsRawValues";

export const getRecordsByTaxon = async ({
  index,
  searchTerm,
  result,
  ancestral,
  fields,
  includeEstimates,
  includeRawValues,
  searchRawValues,
  rank,
  depth,
  filters,
  exclusions,
  summaryValues,
  size,
  offset,
  sortBy,
}) => {
  let searchBy = searchRawValues ? searchByTaxonRawValues : searchByTaxon;
  if (!searchTerm) {
    searchBy = searchRawValues ? searchByParamsRawValues : searchByParams;
  }
  const query = await searchBy({
    searchTerm,
    result,
    ancestral,
    fields,
    includeEstimates,
    includeRawValues,
    rank,
    depth,
    filters,
    exclusions,
    summaryValues,
    size,
    offset,
    sortBy,
  });
  const { body } = await client
    .search({
      index,
      body: query,
      rest_total_hits_as_int: true,
    })
    .catch((err) => {
      console.log(err.meta.body.error);
      return err.meta;
    });
  let results = [];
  let status = checkResponse({ body });
  status.size = size;
  status.offset = offset;
  if (status.hits) {
    results = processHits({ body, inner_hits: true });
  }
  return { status, results, query };
};
