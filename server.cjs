const path = require("node:path");
const Fastify = require("fastify");
const { remixFastifyPlugin } = require("@mcansh/remix-fastify");

async function start() {
  let app = Fastify();

  await app.register(remixFastifyPlugin, {
    buildDir: path.join(process.cwd(), "build"),
  });

  let port = Number(process.env.PORT) || 3000;

  let address = await app.listen({ port, host: "0.0.0.0" });
  console.log(`✅ app ready: ${address}`);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
