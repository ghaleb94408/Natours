class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const exclude = ["page", "sort", "limit", "fields"];
    exclude.forEach((key) => delete queryObj[key]);

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryStr = JSON.parse(queryStr);
    this.query.find(queryStr);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }
  selectFields() {
    if (this.queryString.fields) {
      this.query.select(req.query.fields.replaceAll(",", " "));
    } else {
      this.query.select("-__v");
    }
    return this;
  }
  limitResults() {
    if (this.queryString.page) {
      const page = this.queryString.page || 1;
      const limit = this.queryString.limit || 10;
      const skipValue = (page - 1) * limit;
      this.query.skip(skipValue).limit(limit);
    } else {
      this.query.limit(10);
    }
    return this;
  }
}
module.exports = APIFeatures;
