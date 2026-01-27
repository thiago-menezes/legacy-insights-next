import { createServiceKeys } from './utils';

describe('createServiceKeys', () => {
  const mockHandler = {
    list: vi.fn().mockResolvedValue([{ id: 1, name: 'Item 1' }]),
    get: vi.fn().mockResolvedValue({ id: 1, name: 'Item 1' }),
    create: vi.fn().mockResolvedValue({ id: 2, name: 'Item 2' }),
  };

  it('should return a service object with all original methods', () => {
    const service = createServiceKeys(mockHandler);
    expect(service.list).toBe(mockHandler.list);
    expect(service.get).toBe(mockHandler.get);
    expect(service.create).toBe(mockHandler.create);
  });

  it('should generate a default key using the first method name', () => {
    const service = createServiceKeys(mockHandler);
    expect(service.keys('list')).toEqual(['list', 'list']);
    expect(service.keys('get')).toEqual(['list', 'get']);
  });

  it('should use alternativeKeys if provided', () => {
    const service = createServiceKeys(mockHandler, ['custom-key']);
    expect(service.keys('list')).toEqual(['custom-key', 'list']);
    expect(service.keys('get')).toEqual(['custom-key', 'get']);
  });

  it('should include additional arguments in the generated key', () => {
    const service = createServiceKeys(mockHandler);
    const filters = { category: 'test' };
    expect(service.keys('list', filters)).toEqual(['list', 'list', filters]);
    expect(service.keys('get', '123', 'extra')).toEqual([
      'list',
      'get',
      '123',
      'extra',
    ]);
  });

  it('should execute original method functions correctly', async () => {
    const service = createServiceKeys(mockHandler);

    const listResult = await service.list();
    expect(mockHandler.list).toHaveBeenCalled();
    expect(listResult).toEqual([{ id: 1, name: 'Item 1' }]);

    const params = { name: 'New Item' };
    const createResult = await service.create(params);
    expect(mockHandler.create).toHaveBeenCalledWith(params);
    expect(createResult).toEqual({ id: 2, name: 'Item 2' });
  });
});
