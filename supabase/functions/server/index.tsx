import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Enable logger
app.use('*', logger(console.log));

// Health check endpoint
app.get("/make-server-791d0b68/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint
app.post("/make-server-791d0b68/signup", async (c) => {
  const { email, password } = await c.req.json();
  
  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return c.json({ error: "Server Configuration Error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Signup error:", error);
    return c.json({ error: error.message }, 400);
  }

  return c.json({ data });
});

// Save Menu endpoint
app.post("/make-server-791d0b68/menus", async (c) => {
  let accessToken = c.req.header('X-User-Token');
  if (!accessToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader) accessToken = authHeader.split(' ')[1];
  }

  if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: "Server Configuration Error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: `Unauthorized: ${error?.message || 'User not found'}` }, 401);
  }

  try {
    const body = await c.req.json();
    const { menu } = body;
    
    if (!menu || !menu.id) {
      return c.json({ error: 'Menu data with ID required' }, 400);
    }

    const key = `user:${user.id}:menu:${menu.id}`;
    await kv.set(key, menu);
    return c.json({ success: true });
  } catch (err: any) {
    console.error("KV Error:", err);
    return c.json({ error: `Server Error: ${err.message}` }, 500);
  }
});

// List Menus endpoint
app.get("/make-server-791d0b68/menus", async (c) => {
  let accessToken = c.req.header('X-User-Token');
  if (!accessToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader) accessToken = authHeader.split(' ')[1];
  }

  if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: "Configuration Error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: `Unauthorized: ${error?.message || 'User not found'}` }, 401);
  }

  const prefix = `user:${user.id}:menu:`;
  
  try {
    const menus = await kv.getByPrefix(prefix);
    return c.json({ menus });
  } catch (err: any) {
    console.error("KV Error:", err);
    return c.json({ error: `Server Error: ${err.message}` }, 500);
  }
});

// Get Single Menu endpoint
app.get("/make-server-791d0b68/menus/:id", async (c) => {
  let accessToken = c.req.header('X-User-Token');
  if (!accessToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader) accessToken = authHeader.split(' ')[1];
  }

  if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: "Configuration Error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: `Unauthorized: ${error?.message || 'User not found'}` }, 401);
  }

  const menuId = c.req.param('id');
  const key = `user:${user.id}:menu:${menuId}`;
  
  try {
    const menu = await kv.get(key);
    if (!menu) {
      return c.json({ error: 'Menu not found' }, 404);
    }
    return c.json({ menu });
  } catch (err: any) {
    console.error("KV Error:", err);
    return c.json({ error: err.message }, 500);
  }
});


// Delete Menu endpoint
app.delete("/make-server-791d0b68/menus/:id", async (c) => {
  let accessToken = c.req.header('X-User-Token');
  if (!accessToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader) accessToken = authHeader.split(' ')[1];
  }

  if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: "Configuration Error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: `Unauthorized: ${error?.message || 'User not found'}` }, 401);
  }

  const menuId = c.req.param('id');
  const key = `user:${user.id}:menu:${menuId}`;
  
  try {
    await kv.del(key);
    return c.json({ success: true });
  } catch (err: any) {
    console.error("KV Error:", err);
    return c.json({ error: err.message }, 500);
  }
});

// Get Library endpoint
app.get("/make-server-791d0b68/library", async (c) => {
  let accessToken = c.req.header('X-User-Token');
  if (!accessToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader) accessToken = authHeader.split(' ')[1];
  }

  if (!accessToken) return c.json({ error: 'Unauthorized' }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: "Configuration Error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

  const key = `user:${user.id}:library`;
  try {
    const library = await kv.get(key);
    // Return null if not found, instead of empty object
    // This allows client to distinguish between "no data saved" and "saved empty data"
    return c.json({ library: library || null });
  } catch (err: any) {
    console.error("KV Error:", err);
    return c.json({ error: err.message }, 500);
  }
});

// Save Library endpoint
app.post("/make-server-791d0b68/library", async (c) => {
  let accessToken = c.req.header('X-User-Token');
  if (!accessToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader) accessToken = authHeader.split(' ')[1];
  }

  if (!accessToken) return c.json({ error: 'Unauthorized: No access token' }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: "Configuration Error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
      return c.json({ error: `Unauthorized: ${error?.message}` }, 401);
  }

  try {
      const body = await c.req.json();
      const { categories, drills } = body;
      
      // Allow saving empty arrays
      if (!Array.isArray(categories) || !Array.isArray(drills)) {
          return c.json({ error: "Invalid data format" }, 400);
      }

      const key = `user:${user.id}:library`;
      await kv.set(key, { categories, drills });
      return c.json({ success: true });
  } catch (err: any) {
    console.error("KV Error:", err);
    return c.json({ error: `Server Error: ${err.message}` }, 500);
  }
});

Deno.serve(app.fetch);