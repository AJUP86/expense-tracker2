const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);
  const requestedLimit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, requestedLimit), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

function buildPaginationResponse(data, total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

async function paginateQuery(model, query, paginationParams, options = {}) {
  const { page, limit, skip } = paginationParams;
  const { sort = { createdAt: -1 }, populate = null } = options;

  const [data, total] = await Promise.all([
    model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate)
      .lean(),
    model.countDocuments(query),
  ]);

  return buildPaginationResponse(data, total, page, limit);
}

module.exports = {
  parsePaginationParams,
  buildPaginationResponse,
  paginateQuery,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};

