import express from "express";
import http from "http";

const app = express();
const port = 4000;
(async () => {
  app.use("/", express.static("."));
  app.use("/js", express.static("js/"));
  app.use("/ts", express.static("ts/"));

  app.use(express.json());
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Jeu démarré : http://localhost:${port}`);
  });
})();
