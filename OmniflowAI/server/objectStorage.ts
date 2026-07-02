export class ObjectNotFoundError extends Error {
  constructor(public objectPath: string) {
    super(`Object not found: ${objectPath}`);
    this.name = "ObjectNotFoundError";
  }
}

export class ObjectStorageService {
  // No initialization needed. We are not using disk or cloud buckets anymore.

  /**
   * DATABASE MODE: Converts the image buffer to a Base64 Data URI string.
   * This allows the image to be stored directly in the database text column.
   * It persists across restarts because the Database persists.
   */
  async uploadImageBuffer(buffer: Buffer, mimeType: string, originalName: string): Promise<string> {
    try {
      // 1. Convert Buffer to Base64 String
      const base64String = buffer.toString('base64');

      // 2. Create the Data URI
      // Format: data:image/png;base64,.....
      const dataURI = `data:${mimeType};base64,${base64String}`;

      console.log(`[Storage] Converted ${originalName} to Data URI (${dataURI.length} chars)`);

      // 3. Return the huge string to be saved in the database
      return dataURI;

    } catch (error) {
      console.error("[Storage] Conversion Error:", error);
      throw new Error("Failed to process image");
    }
  }

  // Not used in this mode, but kept for compatibility with routes
  async getObjectEntityFile(objectPath: string): Promise<any> {
     return null; 
  }

  async downloadObject(file: any, res: any) {
     // No-op
  }
}