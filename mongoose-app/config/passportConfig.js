import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";

// CONFIGURO LA STRATEGIA DI AUTENTICAZIONE GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // L'URL A CUI GOOGLE REINDIZZERÀ DOPO L'AUTENTICAZIONE
      callbackURL: "/auth/google/callback",
    },

    // QUESTA FUNZIONE VIENE CHIAMATA QUANDO L'AUTENTICAZIONE GOOGLE HA SUCCESSO
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        let author = await Author.findOne({ googleId: profile.id });

        if (!author) {
          author = new Author({
            googleId: profile.id, // ID UNIVOCO FORNITO DA GOOGLE
            nome: profile.name.givenName, // NOME DELL'UTENTE
            cognome: profile.name.familyName, // COGNOME DELL'UTENTE
            email: profile.emails[0].value, // EMAIL PRINCIPALE DELL'UTENTE
            // NOTA: LA DATA DI NASCITA NON È FORNITA DA GOOGLE, QUINDI LA IMPOSTIAMO A NULL
            dataDiNascita: null,
          });
          await author.save();
        }

        // PASSIAMO L'AUTORE AL MIDDLEWARE DI PASSPORT
        // IL PRIMO ARGOMENTO NULL INDICA CHE NON CI SONO ERRORI
        done(null, author);
      } catch (error) {
        // SE SI VERIFICA UN ERRORE, LO PASSIAMO A PASSPORT
        done(error, null);
      }
    }
  )
);

// SERIALIZZAZIONE DELL'UTENTE PER LA SESSIONE
// QUESTA FUNZIONE DETERMINA QUALI DATI DELL'UTENTE DEVONO ESSERE MEMORIZZATI NELLA SESSIONE
passport.serializeUser((user, done) => {
  // MEMORIZZIAMO SOLO L'ID DELL'UTENTE NELLA SESSIONE
  done(null, user.id);
});

// DESERIALIZZAZIONE DELL'UTENTE DALLA SESSIONE
// QUESTA FUNZIONE VIENE USATA PER RECUPERARE L'INTERO OGGETTO UTENTE BASANDOSI SULL'ID MEMORIZZATO
passport.deserializeUser(async (id, done) => {
  try {

    const user = await Author.findById(id);

    // PASSIAMO L'UTENTE COMPLETO AL MIDDLEWARE DI PASSPORT
    done(null, user);
  } catch (error) {
    // SE SI VERIFICA UN ERRORE DURANTE LA RICERCA, LO PASSIAMO A PASSPORT
    done(error, null);
  }
});

export default passport;