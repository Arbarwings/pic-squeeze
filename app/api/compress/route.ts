import { env } from "@/env";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compressImage } from "@/lib/compressors";
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { getRequestIP, hashIPAddress } from "@/lib/server";
import { createFileSchema } from "@/lib/utils";

// Disable automatic body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const redis = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@ratelimit/pic-squeeze",
});

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
    const ipAddress = getRequestIP(request);
    const identifier = hashIPAddress(ipAddress);
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      console.log("[RATE_LIMIT_EXCEEDED] Rate limit exceeded for", identifier);
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const validationResult = await validateFormData(formData);

    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.errors);
      return NextResponse.json(
        { errors: validationResult.error.errors },
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

    return new NextResponse(outputBuffer, {
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
