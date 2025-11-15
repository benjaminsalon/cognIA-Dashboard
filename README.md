![WhatsApp Image 2025-11-15 at 17 56 57_b90ce0b5](https://github.com/user-attachments/assets/d2e57ac2-6b07-42ee-8d37-8e8d90f4f369)
![WhatsApp Image 2025-11-15 at 17 56 58_c131dab5](https://github.com/user-attachments/assets/d6f68267-9b58-4ac8-a3fd-417b6645fe6c)
![WhatsApp Image 2025-11-15 at 17 56 59_89e38797](https://github.com/user-attachments/assets/1f20bda8-d09f-4c25-85a8-372b61399cf0)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker

The application can be run using Docker and Docker Compose.

### Using Docker Compose (Recommended)

Build and run the application:

```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000).

To stop the application:

```bash
docker-compose down
```

To rebuild after making changes:

```bash
docker-compose up -d --build
```

### Using Docker directly

Build the image:

```bash
docker build -t quiz-app .
```

Run the container:

```bash
docker run -p 3000:3000 -v $(pwd)/data:/app/data quiz-app
```

**Note:** The `data` directory is mounted as a volume to persist lessons, quiz results, and user progress across container restarts.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
