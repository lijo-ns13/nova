import { connectDB } from "./shared/config/db.config";
import app from "./app";

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("Server is running ", PORT);
  });
})();
