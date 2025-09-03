
import express from "express";
import cors from "cors";
import routes from "../../routes/mobile/mobileUserRoutes"; 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});


