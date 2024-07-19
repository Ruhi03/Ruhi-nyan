FROM node:lts-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /app

RUN apk update
RUN apk upgrade
RUN apk add --no-cache python3 py3-pip make gcc g++ linux-headers musl-dev

RUN pnpm install -g pm2

# Install dependencies
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . /app

# Build the app
RUN pnpm run build

CMD ["pm2-runtime", "ecosystem.config.cjs"]