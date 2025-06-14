FROM oven/bun:1.2.2

WORKDIR /app

COPY ./packages ./packages
COPY ./bun.lock ./bun.lock
COPY ./turbo.json ./turbo.json
COPY ./package*.json ./
COPY ./apps/ws-server/ ./apps/ws-server/

RUN cd ./apps/ws-server && bun install && cd ../..

RUN bun install
RUN bun run db:generate

EXPOSE 3002

CMD ["bun", "run", "start:ws"]