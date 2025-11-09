import express, { Request } from "express";
import cors from "cors";
import { api } from "./routes/api.routes";
import morgan from "morgan";
import { errorHandler } from "./errorHandler/errorHandler";
import { log, LogLevel } from "./lib/logger";

const app = express();

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

morgan.token("body", (req: Request, res) => JSON.stringify(req.body, null, 2));

app.use(
  morgan(`:date[iso] :response-time ms :method :status :url`, {
    stream: {
      write: (message: string) => {
        log(message.trim(), LogLevel.INFO);
        // Also log to console as before
        process.stdout.write(message);
      },
    },
  })
);

app.use(`/api/v1`, api);

//express custom error handler
app.use(errorHandler);

export { app };
