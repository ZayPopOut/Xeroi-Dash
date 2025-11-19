import express from "express";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET: Command creator form
app.get("/commands/new", (req, res) => {
  res.render("command_form", { error: null, success: null });
});

// POST: Insert command into supabase
app.post("/commands/new", async (req, res) => {
  const { name, description, category, permission } = req.body;

  const { error } = await supabase
    .from("bot_commands")
    .insert([
      {
        name,
        description,
        category,
        permission
      }
    ]);

  if (error) {
    return res.render("command_form", {
      error: error.message,
      success: null
    });
  }

  return res.render("command_form", {
    error: null,
    success: "Command created successfully!"
  });
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
