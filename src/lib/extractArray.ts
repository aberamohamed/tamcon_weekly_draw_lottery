/**
 * Extracts an array from various paginated API response shapes.
 * Handles: plain array, { items }, { users }, { data }, { results }, { list }, etc.
 */
export function extractArray(data: unknown): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  
  const obj = data as Record<string, any>;
  
  // 1. Check common array keys at top level
  for (const key of ['items', 'users', 'draws', 'tickets', 'transactions', 'results', 'list', 'records']) {
    if (Array.isArray(obj[key])) return obj[key];
  }
  
  // 2. If there's a 'data' property, check it
  if (obj.data) {
    if (Array.isArray(obj.data)) return obj.data;
    if (typeof obj.data === 'object') {
      // Recursive check for the nested data object
      return extractArray(obj.data);
    }
  }
  
  return [];
}
