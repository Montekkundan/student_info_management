FROM oven/bun:latest as build-nextjs

# Set working directory
WORKDIR /app/web

# Copy the package.json and install dependencies
COPY web/package.json /app/web/
RUN bun i

# Copy the entire web (Next.js) project
COPY web/ /app/web/

# Build the Next.js app during Docker build
RUN bun run build

FROM python:3.9-slim

# Install make, curl, unzip, and other tools
RUN apt-get update && apt-get install -y make curl unzip

RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Set work directory for Python
WORKDIR /app

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Create 'teacher' group and add the default user (e.g., root)
RUN groupadd teacher && usermod -aG teacher root

# Copy the Python project files
COPY . /app

COPY --from=build-nextjs /app/web/.next /app/web/.next
COPY --from=build-nextjs /app/web/public /app/web/public
COPY --from=build-nextjs /app/web/node_modules /app/web/node_modules

# Expose port for the Next.js app
EXPOSE 3000

# Start both Python and Next.js concurrently
CMD ["sh", "-c", "make run & cd web && bun run start"]
