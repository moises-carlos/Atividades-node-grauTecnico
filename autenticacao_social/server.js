require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile); 
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((user, done) => {
  done(null, user);
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Você precisa estar logado!");
}

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    res.redirect("/auth/profile");
  }
);

app.get("/auth/failure", (req, res) => {
  res.send("Erro ao autenticar com Google.");
});

app.get("/auth/profile", ensureAuth, (req, res) => {
  res.send(`
    <h1>Perfil do usuário</h1>
    <p>Nome: ${req.user.displayName}</p>
    <p>Email: ${req.user.emails[0].value}</p>
    <form action="/auth/logout" method="POST">
      <button>Sair</button>
    </form>
  `);
});

app.post("/auth/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.send("Logout realizado com sucesso.");
  });
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Login com Google</h1>
    <a href="/auth/google">Login</a>
  `);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
