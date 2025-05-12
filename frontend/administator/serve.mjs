// serve.mjs
import serve from "serve";

serve("dist", {
  port: 3001,
  single: true,
});
