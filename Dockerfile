FROM hayd/deno:alpine-1.1.0
# FROM denoland/deno:alpine-1.10.3

WORKDIR /application

USER deno

COPY dependencies.ts ./
RUN deno cache dependencies.ts

COPY . .
RUN deno cache mod.ts

ENV SHELL /bin/sh

# CMD ["run", "--allow-all", "DrakeFile.ts", "start"]
CMD ["run", "--allow-env", "--allow-read", "--allow-net", "--lock", "lock.json", "mod.ts"]

EXPOSE 3001