const ExampleModel = require('../../../src/models/ExampleModel');

describe('ExampleModel', () => {
  describe('constructor', () => {
    it('should create instance with default values', () => {
      const model = new ExampleModel();
      expect(model.id).toBeNull();
      expect(model.name).toBe('');
      expect(model.description).toBe('');
      expect(model.status).toBe('active');
    });

    it('should create instance with provided data', () => {
      const data = {
        id: 1,
        name: 'Test',
        description: 'Description',
        status: 'inactive',
      };
      const model = new ExampleModel(data);
      expect(model.id).toBe(1);
      expect(model.name).toBe('Test');
      expect(model.description).toBe('Description');
      expect(model.status).toBe('inactive');
    });
  });

  describe('findById', () => {
    it('should return null for null id', async () => {
      const result = await ExampleModel.findById(null);
      expect(result).toBeNull();
    });

    it('should return model instance for valid id', async () => {
      const result = await ExampleModel.findById(1);
      expect(result).toBeInstanceOf(ExampleModel);
      expect(result.id).toBe(1);
    });
  });

  describe('create', () => {
    it('should create and return model instance', async () => {
      const data = { name: 'New Item', description: 'New Description' };
      const result = await ExampleModel.create(data);
      expect(result).toBeInstanceOf(ExampleModel);
      expect(result.name).toBe('New Item');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    it('should return null for non-existent id', async () => {
      const result = await ExampleModel.update(999, { name: 'Updated' });
      expect(result).toBeNull();
    });

    it('should update and return model instance', async () => {
      const result = await ExampleModel.update(1, { name: 'Updated' });
      expect(result).toBeInstanceOf(ExampleModel);
      expect(result.name).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should return true', async () => {
      const result = await ExampleModel.delete(1);
      expect(result).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should return object with model properties', () => {
      const model = new ExampleModel({
        id: 1,
        name: 'Test',
        description: 'Desc',
        status: 'active',
      });
      const json = model.toJSON();
      expect(json).toEqual({
        id: 1,
        name: 'Test',
        description: 'Desc',
        status: 'active',
        createdAt: null,
        updatedAt: null,
      });
    });
  });
});
