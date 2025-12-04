import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compressImage } from "@/lib/compressors";
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { getRequestIP, hashIPAddress, rateLimit } from "@/lib/server";
import { createFileSchema } from "@/lib/utils";

// Disable automatic body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to validate form data
async function validateFormData(formData: FormData) {
  const file = formData.get("image") as File;
  const quality = formData.get("quality");

  const schema = createFileSchema(MAX_FILE_SIZE, ACCEPTED_MIME_TYPES).extend({
    quality: z.preprocess(
      (val: unknown) => parseInt(val as string),
      z.number().min(0).max(100),
    ),
  });

  return schema.safeParse({ image: file, quality: quality });
}

export async function POST(request: NextRequest) {
  try {
    if (env.ENABLE_RATE_LIMIT) {
      const ipAddress = getRequestIP(request);
      const identifier = hashIPAddress(ipAddress);
      const allowed = await rateLimit(identifier);

      if (!allowed) {
        console.log(
          "[RATE_LIMIT_EXCEEDED] Rate limit exceeded for",
          identifier,
        );
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again later." },
          { status: 429 },
        );
      }
    }

    const formData = await request.formData();
    const validationResult = await validateFormData(formData);

    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.issues);
      return NextResponse.json(
        { errors: validationResult.error.issues },
        { status: 400 },
      );
    }

    const { image, quality } = validationResult.data;

    if (!image) {
      console.error("No image uploaded");
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const { outputBuffer, filename, mimeType } = await compressImage(
      image,
      quality,
    );

    return new NextResponse(Buffer.from(outputBuffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Image compression error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Image compression failed" },
      { status: 500 },
    );
  }
}
