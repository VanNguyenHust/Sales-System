// serve.mjs
import serve from "serve";

serve("dist", {
  port: 3002,
  single: true,
});
