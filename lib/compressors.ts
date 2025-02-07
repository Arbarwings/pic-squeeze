import sharp from "sharp";

const getFormatDetails = (
  format: string,
  quality: number,
  sharpInstance: sharp.Sharp,
  originalName: string,
) => {
  switch (format) {
    case "png":
      return {
        output: sharpInstance.png({ quality }),
        filename: `compressed-${originalName}.png`,
        mimeType: "image/png",
      };
    case "webp":
      return {
        output: sharpInstance.webp({ quality }),
        filename: `compressed-${originalName}.webp`,
        mimeType: "image/webp",
      };
    case "jpeg":
    case "jpg":
    default:
      return {
        output: sharpInstance.jpeg({ quality }),
        filename: `compressed-${originalName}.jpeg`,
        mimeType: "image/jpeg",
      };
  }
};

export async function compressImage(
  image: File,
  quality: number,
): Promise<{ outputBuffer: Buffer; filename: string; mimeType: string }> {
  try {
    const buffer = await image.arrayBuffer();
    const sharpInstance = sharp(buffer).resize({
      fit: "inside",
      withoutEnlargement: true,
    });

    const contentType = image.type;
    const format = contentType
      .substring(contentType.indexOf("/") + 1)
      .toLowerCase();

    const { output, filename, mimeType } = getFormatDetails(
      format,
      quality,
      sharpInstance,
      image.name.substring(0, image.name.lastIndexOf(".")) || image.name,
    );

    const outputBuffer = output ? await output.toBuffer() : Buffer.from(buffer);

    return { outputBuffer, filename, mimeType };
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error("Image compression failed");
  }
}
