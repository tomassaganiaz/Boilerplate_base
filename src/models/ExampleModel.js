class ExampleModel {
  static tableName = 'examples';
  static primaryKey = 'id';
  static records = new Map([
    [1, { id: 1, name: 'Example', status: 'active' }],
  ]);

  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static async findAll(filters = {}) {
    const { status, limit = 20, offset = 0 } = filters;
    return Array.from(this.records.values())
      .filter((record) => !status || record.status === status)
      .slice(offset, offset + limit)
      .map((record) => new ExampleModel(record));
  }

  static async findById(id) {
    if (!id) return null;
    const record = this.records.get(Number(id));
    return record ? new ExampleModel(record) : null;
  }

  static async create(data) {
    const example = new ExampleModel(data);
    example.id = Date.now();
    example.createdAt = new Date();
    example.updatedAt = new Date();
    this.records.set(example.id, example.toJSON());
    return example;
  }

  static async update(id, data) {
    const example = await this.findById(id);
    if (!example) return null;
    
    Object.assign(example, data);
    example.updatedAt = new Date();
    this.records.set(example.id, example.toJSON());
    return example;
  }

  static async delete(id) {
    return this.records.delete(Number(id));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = ExampleModel;
