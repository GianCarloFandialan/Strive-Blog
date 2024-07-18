import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new Schema(
  {
    // CAMPO 'NAME' DI TIPO STRING OBBLIGATORIO (REQUIRED)
    nome: {
      type: String,
      required: true,
    },
    // CAMPO 'SURNAME' DI TIPO STRING OBBLIGATORIO (REQUIRED)
    cognome: {
      type: String,
      required: true,
    },
    // CAMPO 'EMAIL' DI TIPO STRING OBBLIGATORIO E UNICO (UNIQUE)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // CAMPO 'DATA DI NASCITA' DI TIPO STRING OBBLIGATORIO
    dataDiNascita: {
      type: String,
    },
    // CAMPO 'AVATAR' DI TIPO STRING OBBLIGATORIO
    avatar: {
      type: String,
    },
    //CAMPO 'PASSWORD' DI TIPO STRINGA OBBLIGATORIO
    password: { 
      type: String, 
    },
    //CAMPO PER L'ID GOOGLE DI TIPO STRINGA
    googleId: { 
      type: String 
    },
  },
  {
    timestamps: true,
    collection: "authors",
  }
);

// METODO PER CONFRONTARE LE PASSWORD
authorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// HASHING DELLE PASSWORD PRIMA DEL SALVATAGGIO
// L'HASHING È UNA FUNZIONE UNIDIREZIONALE PER CODIFICARE I DATI: PRENDE IL TESTO LEGGIBILE E LO TRASFORMA IN UNA STRINGA DI CARATTERI COMPLETAMENTE DIVERSA CON UNA LUNGHEZZA IMPOSTATA.
authorSchema.pre("save", async function (next) {
  
  // ESEGUI L'HASHING SOLO SE LA PASSWORD È STATA MODIFICATA (O È NUOVA)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); //IL SALT È UNA SEQUENZA CASUALE DI BIT AGGIUNTA ALLA PASSWORD PRIMA CHE VENGA SOTTOPOSTA ALL'ALGORITMO DI HASHING. IN QUESTO CASO IL SALTING VIENE ESEGUITO 10 VOLTE
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


const Author = model("Author", authorSchema)
export default Author;
