const ExampleService = require('../../../src/services/ExampleService');
const ExampleModel = require('../../../src/models/ExampleModel');

jest.mock('../../../src/models/ExampleModel');

describe('ExampleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call Model.findAll with filters', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      ExampleModel.findAll.mockResolvedValue(mockData);
      
      const result = await ExampleService.getAll({ status: 'active' });
      
      expect(ExampleModel.findAll).toHaveBeenCalledWith({ status: 'active' });
      expect(result).toEqual(mockData);
    });
  });

  describe('getById', () => {
    it('should throw error if id is not provided', async () => {
      await expect(ExampleService.getById(null)).rejects.toThrow('ID is required');
    });

    it('should return null if entity not found', async () => {
      ExampleModel.findById.mockResolvedValue(null);
      
      const result = await ExampleService.getById(999);
      
      expect(result).toBeNull();
    });

    it('should return entity if found', async () => {
      const mockEntity = { id: 1, name: 'Test' };
      ExampleModel.findById.mockResolvedValue(mockEntity);
      
      const result = await ExampleService.getById(1);
      
      expect(result).toEqual(mockEntity);
    });
  });

  describe('create', () => {
    it('should throw error if data is not provided', async () => {
      await expect(ExampleService.create(null)).rejects.toThrow('Data is required');
    });

    it('should throw error if data is empty', async () => {
      await expect(ExampleService.create({})).rejects.toThrow('Data is required');
    });

    it('should call Model.create with data', async () => {
      const mockEntity = { id: 1, name: 'New' };
      ExampleModel.create.mockResolvedValue(mockEntity);
      
      const result = await ExampleService.create({ name: 'New' });
      
      expect(ExampleModel.create).toHaveBeenCalledWith({ name: 'New' });
      expect(result).toEqual(mockEntity);
    });
  });

  describe('update', () => {
    it('should throw error if id is not provided', async () => {
      await expect(ExampleService.update(null, {})).rejects.toThrow('ID is required');
    });

    it('should throw error if data is not provided', async () => {
      await expect(ExampleService.update(1, null)).rejects.toThrow('Data is required');
    });

    it('should call Model.update with id and data', async () => {
      const mockEntity = { id: 1, name: 'Updated' };
      ExampleModel.update.mockResolvedValue(mockEntity);
      
      const result = await ExampleService.update(1, { name: 'Updated' });
      
      expect(ExampleModel.update).toHaveBeenCalledWith(1, { name: 'Updated' });
      expect(result).toEqual(mockEntity);
    });
  });

  describe('delete', () => {
    it('should throw error if id is not provided', async () => {
      await expect(ExampleService.delete(null)).rejects.toThrow('ID is required');
    });

    it('should call Model.delete with id', async () => {
      ExampleModel.delete.mockResolvedValue(true);
      
      const result = await ExampleService.delete(1);
      
      expect(ExampleModel.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });
});
