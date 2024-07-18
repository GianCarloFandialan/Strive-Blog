import express from "express";
import endpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authorRoutes from "./routes/authorRoutes.js";
import blogPostRoutes from "./routes/blogPostRoutes.js";
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import authorizationRoutes from "./routes/authorizationRoutes.js";
import session from "express-session";
import passport from "./config/passportConfig.js";

import { badRequestHandler,
   unauthorizedHandler, 
   notFoundHandler, 
   genericErrorHandler 
} from './middleware/errorHandlers.js';

dotenv.config(); // PORTO DENTRO VARIABILI DEFINITE IN .ENV

const app = express(); // INIZIALIZZO APP

app.use(express.json()); //MIDDLEWARE PER TRASFORMARE IL CORPO DELLA RICHIESTA IN JSON

//BONUS
app.use(cors());

app.use(
  session({
    // IL 'SECRET' È USATO PER FIRMARE IL COOKIE DI SESSIONE
    // È IMPORTANTE CHE SIA UNA STRINGA LUNGA, UNICA E SEGRETA
    secret: process.env.SESSION_SECRET,

    // 'RESAVE: FALSE' DICE AL GESTORE DELLE SESSIONI DI NON
    // SALVARE LA SESSIONE SE NON È STATA MODIFICATA
    resave: false,

    // 'saveUninitialized: false' DICE AL GESTORE DELLE SESSIONI DI NON
    // CREARE UNA SESSIONE FINCHÉ NON MEMORIZZIAMO QUALCOSA
    // AIUTA A IMPLEMENTARE LE "LOGIN SESSIONS" E RIDUCE L'USO DEL SERVER DI MEMORIZZAZIONE
    saveUninitialized: false,
  })
);

// INIZIALIZZAZIONE DI PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//CONNESSIONE AL DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNESSO"))
  .catch((err => console.error("MONGODB: ERRORE-", err)))

//ROTTA DI BASE
app.use("/auth", authorizationRoutes);
app.use("/authors", authorRoutes)
app.use("/blogPosts", blogPostRoutes)


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(PORT, () => {
  console.log(`Server acceso sulla porta ${PORT}`);
  console.log("Sono disponibili i seguenti endpoints");
  console.table(endpoints(app));
})