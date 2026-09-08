class BaseModel {
  static tableName = 'table_name';
  static primaryKey = 'id';

  constructor(data = {}) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static async findAll(filters = {}) {
    throw new Error('Method not implemented');
  }

  static async findById(id) {
    throw new Error('Method not implemented');
  }

  static async create(data) {
    throw new Error('Method not implemented');
  }

  static async update(id, data) {
    throw new Error('Method not implemented');
  }

  static async delete(id) {
    throw new Error('Method not implemented');
  }

  toJSON() {
    const obj = {};
    Object.keys(this).forEach((key) => {
      if (this[key] !== undefined) {
        obj[key] = this[key];
      }
    });
    return obj;
  }
}

module.exports = BaseModel;
