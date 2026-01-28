# API Utilities Testing Guide

> **Learn how to test API utilities and services using `createServiceKeys`**

---

## Overview

The `createServiceKeys` utility is a central part of our API layer. It simplifies the management of [TanStack Query](https://tanstack.com/query/latest) keys by automatically generating hierarchical keys based on service method names.

### The Utility: `createServiceKeys`

Located in [src/libs/api/utils.ts](file:///Users/thiagomenezes/Projects/legacy-insights-next/src/libs/api/utils.ts), this function wraps a service object and adds a `keys` method.

---

## 🧪 Testing Patterns

Testing `createServiceKeys` ensures that our service keys are predictable and that the underlying service methods remain functional when wrapped.

### Unit Tests for `createServiceKeys`

The tests in [src/libs/api/utils.spec.ts](file:///Users/thiagomenezes/Projects/legacy-insights-next/src/libs/api/utils.spec.ts) follow these patterns:

#### 1. Verifying Method Preservation

Ensures that all methods from the original handler are present in the wrapped service.

```typescript
it('should return a service object with all original methods', () => {
  const service = createServiceKeys(mockHandler);
  expect(service.list).toBe(mockHandler.list);
  expect(service.get).toBe(mockHandler.get);
});
```

#### 2. Default Key Generation

Verifies that the default primary key (usually the first method name) is used correctly.

```typescript
it('should generate a default key using the first method name', () => {
  const service = createServiceKeys(mockHandler);
  expect(service.keys()).toEqual(['list']);
});
```

#### 3. Custom Primary Keys

Ensures `alternativeKeys` are prioritized when provided.

```typescript
it('should use alternativeKeys if provided', () => {
  const service = createServiceKeys(mockHandler, ['custom-key']);
  expect(service.keys('list')).toEqual(['custom-key', 'list']);
});
```

#### 4. Handling Arguments

Tests that additional arguments passed to `keys()` are appended to the resulting array.

```typescript
it('should include additional arguments in the generated key', () => {
  const service = createServiceKeys(mockHandler);
  const filters = { category: 'test' };
  expect(service.keys('list', filters)).toEqual(['list', 'list', filters]);
});
```

#### 5. Functional Execution

Verifies that calling the wrapped methods correctly invokes the original functions with appropriate parameters.

```typescript
it('should execute original method functions correctly', async () => {
  const service = createServiceKeys(mockHandler);
  const params = { name: 'New Item' };
  await service.create(params);
  expect(mockHandler.create).toHaveBeenCalledWith(params);
});
```

---

## 🚀 Best Practices

1.  **Always use `createServiceKeys`**: When defining new API services, wrap your handlers with this utility to get consistent query keys.
2.  **Naming Matters**: Since the default primary key is derived from `Object.keys(service)[0]`, ensure your handler's first method or property has a descriptive name for the resource (e.g., `list`, `workspaces`).
3.  **Provide Explicit Keys if Needed**: If the derived key is not what you want, use `alternativeKeys`.

---

## 🔗 Related Documentation

- [Testing Guide](./testing.md)
- [API Data Fetching](./api-data-fetching.md)
- [Code Patterns](./code-patterns.md)
