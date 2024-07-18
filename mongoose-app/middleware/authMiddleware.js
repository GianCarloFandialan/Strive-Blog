import { verifyJWT } from "../utils/jwt.js";
import Author from "../models/Author.js";

// MIDDLEWARE per l'AUTENTICAZIONE
export const authMiddleware = async (req, res, next) => {

  try {
    // ESTRAI IL TOKEN DALL'HEADER AUTHORIZATION
    // L'OPERATORE ?. (OPTIONAL CHAINING) PREVIENE ERRORI SE AUTHORIZATION È UNDEFINED
    // REPLACE('Bearer ', '') RIMUOVE IL PREFISSO 'Bearer ' DAL TOKEN
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send("Token mancante");
    }

    // COSTANTE CHE CONTERRÀ IL PAYLOAD DEL TOKEN 
    const decoded = await verifyJWT(token);

    // USA L'ID DELL'AUTORE DAL TOKEN PER TROVARE L'AUTORE NEL DATABASE
    // .select('-password') ESCLUDE IL CAMPO PASSWORD DAI DATI RESTITUITI
    const author = await Author.findById(decoded.id).select("-password");

    if (!author) {
      return res.status(401).send("Autore non trovato");
    }

    req.author = author;

    next();
  } catch (error) {

    res.status(401).send("Token non valido");
  }
};