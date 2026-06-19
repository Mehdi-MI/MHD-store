/**
 * APIFeatures — chainable query builder for Mongoose
 *
 * Usage:
 *   const features = new APIFeatures(Product.find(), req.query)
 *     .filter()
 *     .search(['name', 'description'])
 *     .sort()
 *     .paginate();
 *   const products = await features.query;
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query       = query;
    this.queryString = queryString;
    this.totalCount  = 0;
  }

  /** Remove reserved params and apply MongoDB comparison operators */
  filter() {
    const queryObj = { ...this.queryString };
    const excluded = ['page', 'limit', 'sort', 'fields', 'search', 'q'];
    excluded.forEach(el => delete queryObj[el]);

    // Convert gte/gt/lte/lt → $gte/$gt/$lte/$lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /** Full-text search on given fields */
  search(fields = []) {
    const q = this.queryString.q || this.queryString.search;
    if (q && fields.length) {
      const searchRegex = new RegExp(q, 'i');
      const searchConditions = fields.map(f => ({ [f]: searchRegex }));
      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  /** Text index search (use with MongoDB text indexes) */
  textSearch() {
    const q = this.queryString.q || this.queryString.search;
    if (q) {
      this.query = this.query.find({ $text: { $search: q } });
    }
    return this;
  }

  /** Sort results */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /** Select specific fields */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /** Paginate results */
  paginate() {
    const page  = Math.max(1, parseInt(this.queryString.page,  10) || 1);
    const limit = Math.min(100, parseInt(this.queryString.limit, 10) || 20);
    const skip  = (page - 1) * limit;

    this.query  = this.query.skip(skip).limit(limit);
    this._page  = page;
    this._limit = limit;
    return this;
  }
}

module.exports = APIFeatures;
