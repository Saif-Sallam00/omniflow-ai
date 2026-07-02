import sharp from "sharp";

export class ObjectNotFoundError extends Error {
  constructor(public objectPath: string) {
    super(`Object not found: ${objectPath}`);
    this.name = "ObjectNotFoundError";
  }
}

export class ObjectStorageService {
  // No initialization needed. We are not using disk or cloud buckets.

  /**
   * DATABASE MODE: Compresses the uploaded image with sharp (resize + WebP)
   * and returns a Base64 Data URI for storage in a Postgres text column.
   *
   * The processing (max width 1600px, never upscaled, re-encoded to WebP @ q80)
   * dramatically shrinks the stored payload vs. the raw upload, with no infra
   * change — the image still lives in the database.
   */
  async uploadImageBuffer(buffer: Buffer, _mimeType: string, originalName: string): Promise<string> {
    try {
      const processed = await sharp(buffer)
        .rotate() // honor EXIF orientation before we strip metadata
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const base64String = processed.toString("base64");
      const dataURI = `data:image/webp;base64,${base64String}`;

      console.log(
        `[Storage] Processed ${originalName}: ${buffer.length} → ${processed.length} bytes (webp, ${dataURI.length} chars)`,
      );

      return dataURI;
    } catch (error) {
      console.error("[Storage] Processing Error:", error);
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
