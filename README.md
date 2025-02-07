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
- Automated tests.

## Technologies used

- Node 22
- Next.js 15
- Tailwind CSS
- Shadcn
- Sharp
- Zod
- Vitest
- Prettier
- ESLint
- Redis
- Docker
- Docker Compose
- Devcontainer
- GitHub Actions

## Setup and installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Arbarwings/pic-squeeze.git
    cd pic-squeeze
    ```

### Using the Devcontainer (Recommended)

This project is configured to use a devcontainer, which provides a consistent
and pre-configured development environment. This is the recommended way to
develop for this project.

#### Benefits

- **Consistency:** Ensures everyone on the team has the same development
  environment.
- **Pre-configured:** All necessary tools and dependencies are pre-installed.
- **Isolated:** Keeps your local machine clean.
- **Redis Server:** Includes a Redis server for development purposes.

#### Steps

1.  **Install VS Code and the Remote - Containers extension.**
2.  **Open the project in VS Code.**
3.  **If prompted, click "Reopen in Container".** If not prompted, you can
    manually trigger this by opening the command palette (View -> Command
    Palette...) and typing "Remote-Containers: Reopen in Container".
4.  **VS Code will build and start the devcontainer.** This may take a few
    minutes the first time.
5.  **Once the devcontainer is running, you can access the app at
    http://localhost:3000.**

### Manual setup

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start the development server:**

    ```bash
    npm run dev
    ```

3.  **Open the app:**

    Open [http://localhost:3000](http://localhost:3000) with your browser to see
    the result.

## Architectural decisions

- **Next.js for Frontend and Backend:** Next.js is used for both the frontend
  (user interface) and the backend (API routes). This simplifies development and
  deployment, and allows for server-side rendering.

- **API Routes for Image Compression:** Next.js API routes are used to handle
  the image compression logic. This keeps the compression logic separate from
  the frontend, and allows for easy scaling.

- **Sharp for Image Compression:** The `sharp` library is used for image
  compression. This library is fast and efficient, and supports a wide range of
  image formats.

- **Zod for Validation:** Zod is used for validating the input data. This
  ensures that the input data is valid before it is processed, and helps to
  prevent errors.

- **Redis for Rate Limiting:** Redis is used for rate limiting. This prevents
  the API from being overwhelmed by too many requests, and helps to protect
  against abuse. It's using an hashed IP address as the identifier.

- **In-Memory Image Handling:** The original and compressed images are handled
  in memory and are not persisted to disk. This simplifies the application and
  makes it privacy-friendly.

- **Devcontainer for Development Environment:** A devcontainer is used to
  provide a consistent and pre-configured development environment. This ensures
  that everyone on the team has the same development environment, and simplifies
  the setup process.

## Production deployment

This project can be deployed using Docker and Docker Compose. The provided
`docker-compose.yml` file defines the services required for the application,
including the Next.js app and a Redis instance.

### Prerequisites

- Docker and Docker Compose installed on your server.

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Arbarwings/pic-squeeze.git
    cd pic-squeeze
    ```

2.  **Build the Docker image:**

    ```bash
    docker-compose build
    ```

3.  **Run the Docker Compose stack:**

    ```bash
    docker-compose up -d
    ```

    This will start the Next.js app and the Redis instance in detached mode.

4.  **Access the application:**

    Once the containers are running, you can access the application at
    `http://your_server_ip:3000`. Make sure that port 3000 is open in your
    firewall.

## Assumptions and limitations

- No files are stored on the server.
- The compressed image is stored in memory and is not persisted.
- The application assumes that the user has a modern web browser with support
  for JavaScript and file uploads.
- The application is designed for single-user use and does not support
  multi-user collaboration.
- The application does not support image formats other than those supported by
  the `sharp` library.
- The maximum image size that can be uploaded is limited by the server's memory
  and the `sharp` library's capabilities.
- The rate limiting mechanism relies on hashing the IP address, which may not be
  accurate in all cases (e.g., users behind a proxy or VPN).
- The application assumes that the Redis server is running and accessible.
