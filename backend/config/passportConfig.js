import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import Author from "../models/Author.js";

// CONFIGURO LA STRATEGIA DI AUTENTICAZIONE GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // L'URL A CUI GOOGLE REINDIZZERÀ DOPO L'AUTENTICAZIONE
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
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

// CONFIGURO LA STRATEGIA DI AUTENTICAZIONE GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Author.findOne({ githubId: profile.id });

        if (!author) {
          const [nome, ...cognomeParts] = (
            profile.displayName ||
            profile.username ||
            ""
          ).split(" ");
          const cognome = cognomeParts.join(" ");

          // GESTIONE DELL'EMAIL
          let email;
          if (profile.emails && profile.emails.length > 0) {
            // CERCHIAMO PRIMA L'EMAIL PRIMARIA O VERIFICATA
            email = profile.emails.find((e) => e.primary || e.verified)?.value;
            // SE NON TROVIAMO UN'EMAIL PRIMARIA O VERIFICATA, PRENDIAMO LA PRIMA DISPONIBILE
            if (!email) email = profile.emails[0].value;
          }

          // SE ANCORA NON ABBIAMO UN'EMAIL, USIAMO UN FALLBACK
          if (!email) {
            email = `${profile.id}@github.com`;
            console.warn(
              `Email non disponibile per l'utente GitHub ${profile.id}. Usando email di fallback.`
            );
          }

          author = new Author({
            githubId: profile.id,
            nome: nome || "GitHub User",
            cognome: cognome,
            email: email,
          });
          await author.save();
        }

        done(null, author);
      } catch (error) {
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