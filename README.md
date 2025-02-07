# Image Compression Mini-App

## Overview

This application allows users to upload an image, preview it, and receive a
compressed version. The image is compressed using the `sharp` library, and the
compressed image can be downloaded.

## Features

- Upload and preview images.
- Compress images using the `sharp` library.
- Download the compressed image.
- Responsive design.
- Error handling.
- Rate limiting.
- GDRP compliance (no cookies, no tracking, IP anonymization).

## Technologies used

- Node 22
- Next.js 15
- Tailwind CSS
- Shadcn
- Sharp
- Zod
- Prettier
- ESLint
- Redis

## Setup and installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd pic-squeeze
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

## Architectural decisions

TBD

## Production deployment

TBD

## Assumptions and limitations

- No files are stored on the server.
- The compressed image is stored in memory and is not persisted.
