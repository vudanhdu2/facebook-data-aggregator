
/**
 * Utility functions for efficient data processing
 */

/**
 * Virtual pagination helper - returns a slice of data efficiently
 * @param data The full data array
 * @param page Current page number (1-based)
 * @param itemsPerPage Number of items per page
 */
export function getPaginatedData<T>(data: T[], page: number, itemsPerPage: number): T[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  return data.slice(startIndex, endIndex);
}

/**
 * Efficiently search through a data array by properties
 * @param data Array of objects to search through
 * @param searchQuery Search query string
 * @param properties Array of property names to search in
 */
export function searchObjects<T extends Record<string, any>>(
  data: T[],
  searchQuery: string,
  properties: string[]
): T[] {
  if (!searchQuery) return data;
  
  const query = searchQuery.toLowerCase();
  
  return data.filter(item => 
    properties.some(prop => {
      const value = item[prop];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(query);
    })
  );
}

/**
 * Process large datasets in chunks to avoid UI freezes
 * @param data Large array to process
 * @param processFn Function to process each item
 * @param chunkSize Size of each processing chunk
 * @param onProgress Optional callback for progress updates
 */
export function processInChunks<T, R>(
  data: T[],
  processFn: (item: T) => R,
  chunkSize: number = 1000,
  onProgress?: (processed: number, total: number) => void
): Promise<R[]> {
  return new Promise((resolve) => {
    const result: R[] = [];
    const total = data.length;
    let processed = 0;
    
    function processChunk(startIndex: number) {
      const endIndex = Math.min(startIndex + chunkSize, total);
      
      for (let i = startIndex; i < endIndex; i++) {
        result.push(processFn(data[i]));
        processed++;
      }
      
      if (onProgress) {
        onProgress(processed, total);
      }
      
      if (endIndex < total) {
        // Process next chunk asynchronously
        setTimeout(() => processChunk(endIndex), 0);
      } else {
        // All done
        resolve(result);
      }
    }
    
    // Start processing
    processChunk(0);
  });
}

/**
 * Group data by a specific property
 * @param data Array of objects
 * @param property Property to group by
 */
export function groupBy<T extends Record<string, any>>(
  data: T[],
  property: keyof T
): Record<string, T[]> {
  return data.reduce((groups, item) => {
    const key = String(item[property]);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
