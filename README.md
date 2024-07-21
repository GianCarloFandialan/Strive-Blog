# STRIVE BLOG
**Questo progetto è stato deployato al link:**
**https://strive-blog-seven.vercel.app/**
Questo progetto rappresenta un blog con varie funzionalità inserite, 

 - La possibilità di fare l'accesso sia tramite registrazine normale sia tramite google oppure github
 -  La possibilità di vedere e leggere i post creati precedentemente altre persone con la possibilità di variare l'impaginazione di essi
 - La possibilità di poter modificare il post se si è l'autori di esso, quindi sia l'immagine di copertina che il suo contenuto e titolo, tramite 'hover' con il mouse oppure premendo sull'immagine
 - La possibilità di poter commentare i post
 - La possibilità di poter cancellare oppure modificare un proprio post scritto precedentemente
 - Anche i commenti sono impaginati
 - C'è la possiblità di poter cancellare/modificare i propri commenti
 - Si possono effettuare anche le modifiche al proprio profilo come la modifica dell'avatar, nominativo e data di nascita
 - Si può visualizzare la pagina del profilo di ciascun utente e vedere i suoi relativi post

# FRONTEND
Il progetto è strutturato, lato frontend tramite vite ed usufruisce del framweork React:

Presenta 3 cartelle principali:

 1. **"views"** in cui sono presenti in componenti principali, quindi le strutture delle pagine del progetto
 2. **"data"** in cui ci sono contenuti i file per il context, ed il file axios in cui sono state create le varie funzioni per esegure chiamate all'api
 3. **"components"** in cui ci sono i componenti dei componenti delle pagine principali, in questa cartella si possono trovare anche il footer e la barra di navigazioni

# BACKEND
Il backend è costruito tramite express js, mongo db e mongoose con vari tools per le varie funzionalità

Presenta varie cartelle:

 1. **"config"** in cui ci sono i file che configurano i tools scaricati
 2. **"middleware"**  in cui ci sono appunti i file per i middlware
 3. **"models"** in cui ci sono i models scheme che vengono usufruiti da mongo
 4. **"routes "** in cui ci sono i vari file usati per definire le rotte al backend
 5. **"services"** in cui c'è il file che ci serve per configurare l'invio delle email
 6. è Presente anche un file per generare delle chiavi che posdsiamo usare come key per il backend
 7. Il file **"server.js "** in cui è configurato il server
