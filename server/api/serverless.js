import express from "express";
import * as dotenv from "dotenv";
import init from "../app.js";

dotenv.config();

const app = express();

app.use("/", init);

app.get("/", async (request, reply) => {
  reply.send({ message: "Hello from ficition-logs api" });
});

export default async (req, res) => {
  app(req, res);
};
