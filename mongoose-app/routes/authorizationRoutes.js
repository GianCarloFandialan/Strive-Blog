import express from "express";
import Author from "../models/Author.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

// POST CHE RESTITUISCE IL TOKEN DI ACCESSO
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // VERIFICO LA PASSWORD USANDO IL METODO COMPAREPASSWORD DEFINITO NELL'AUTHOR MODEL
    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // GENERO UN TOKEN JWT CON LA FUNZIONE IMPORTATA DA JWT.JS
    const token = await generateJWT({ id: author._id });

    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore del server" });
  }
});

// GET CHE MI RESTITUISCE L'AUTORE COLLEGATO AL TOKEN DI ACCESSO
// authMiddleware VERIFICA IL TOKEN E AGGIUNGE I DATI DELL'AUTORE A req.author(RIGA 28 DI authMiddleware.js)
router.get("/me", authMiddleware, (req, res) => {

  // CONVERTE IL DOCUMENTO MONGOOSE IN UN OGGETTO JAVASCRIPT SEMPLICE
  const authorData = req.author.toObject();

  // SI RIMUOVE IL CAMPO PASSWORD PER SICUREZZA
  delete authorData.password;

  res.json(authorData);
});

// ROTTA PER INIZIARE IL PROCESSO DI AUTENTICAZIONE GOOGLE
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// QUESTO ENDPOINT INIZIA IL FLUSSO DI AUTENTICAZIONE OAUTH CON GOOGLE
// 'google' SI RIFERISCE ALLA STRATEGIA GOOGLESTRATEGY CONFIGURATA IN passportConfig.js
// SCOPE: SPECIFICA LE INFORMAZIONI RICHIEDIAMO A GOOGLE (PROFILO E EMAIL)

// ROTTA DI CALLBACK PER L'AUTENTICAZIONE GOOGLE
router.get(
  "/google/callback",
  // PASSPORT TENTA DI AUTENTICARE L'UTENTE CON LE CREDENZIALI GOOGLE
  passport.authenticate("google", { failureRedirect: "/login" }),
  // SE L'AUTENTICAZIONE FALLISCE, L'UTENTE VIENE REINDIRIZZATO ALLA PAGINA DI LOGIN

  async (req, res) => {
    try {
      // A QUESTO PUNTO, L'UTENTE È AUTENTICATO CON SUCCESSO
      // req.user CONTIENE I DATI DELL'UTENTE FORNITI DA PASSPORT

      // GENERA UN JWT (JSON WEB TOKEN) PER L'UTENTE AUTENTICATO
      // USIAMO L'ID DELL'UTENTE DAL DATABASE COME PAYLOAD DEL TOKEN
      const token = await generateJWT({ id: req.user._id });

      // REINDIRIZZA L'UTENTE AL FRONTEND, PASSANDO IL TOKEN COME PARAMETRO URL
      // IL FRONTEND PUÒ QUINDI SALVARE QUESTO TOKEN E USARLO PER LE RICHIESTE AUTENTICATE
      res.redirect(`http://localhost:5173/login?token=${token}`);
    } catch (error) {
      console.error("Errore nella generazione del token:", error);
      // REINDIRIZZIAMO L'UTENTE ALLA PAGINA DI LOGIN CON UN MESSAGGIO DI ERRORE
      res.redirect("/login?error=auth_failed");
    }
  }
);

export default router;