import jwt from "jsonwebtoken";

// FUNZIONE PER GENERARE UN TOKEN JWT
//UTILIZZATA NELLE CHIAMATE API DI LOGIN
export const generateJWT = (payload) => {

  return new Promise((resolve, reject) =>

    // UTILIZZA IL METODO SIGN (DI JWT) PER CREARE UN NUOVO TOKEN
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    jwt.sign(
      payload, //DATI CHE POSSONO ESSERE : OBJECT LITERAL, BUFFER OR STRINGHE RAPPRESENTANTI JSON VALIDI
      process.env.JWT_SECRET, //TOKEN NEL FILE .ENV
      { expiresIn: "1 day" }, //SCADENZA DEL TOKEN
      (err, token) => {
        
        if (err) reject(err); 
        else resolve(token); 
      }
    )
  );
};

//FUNZIONE CHE VERIFICA UN TOKEN JWT
//UTILIZZATA NEL MIDDLEWARE DI AUTENTICAZIONE
export const verifyJWT = (token) => {
  
  return new Promise((resolve, reject) =>
    // UTILIZZA IL METODO VERIFY DI JWT PER DECODIFICARE E VERIFICARE IL TOKEN
    //.verify(token, secretOrPublicKey, [options, callback])
    jwt.verify(
      token, //È LA STRINGA JSONWEBTOKEN
      process.env.JWT_SECRET, //TOKEN NEL FILE .ENV
      (err, decoded) => {

      if (err) reject(err);
      else resolve(decoded); 
      }
    )
  );
};