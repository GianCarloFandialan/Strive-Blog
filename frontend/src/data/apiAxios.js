import axios from "axios"

const API_URL = "https://strive-blog-p5r2.onrender.com/"

const api = axios.create({ baseURL: API_URL});

// Aggiungi un interceptor per includere il token in tutte le richieste
api.interceptors.request.use(
  (config) => {
    // Recupera il token dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token); // Log del token inviato per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  }
);


//FUNZIONI RIGUARDANTI I POSTS
export const getPosts = () => api.get('/blogPosts');
export const getPostsHomepage = (currentPage, limit) => api.get(`/blogPosts?page=${currentPage}&limit=${limit}`);
export const getSinglePost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) => api.post("/blogPosts", postData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const updatePost = (id, postData) => api.put(`/blogPosts/${id}`, postData);
export const updatePostCover = (id, postData) => api.patch(`/blogPosts/${id}/cover`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);
export const searchPost = (searchText)=> api.get(`/blogPosts?title=${searchText}`)


//FUNZIONI RIGUARDANTI GLI AUTORI
export const getAuthors = () => api.get('/authors');
export const getSingleAuthor = (id) => api.get(`/authors/${id}`);
export const getAuthorPosts = (id, currentPage, limit) => api.get(`/authors/${id}/blogPosts?page=${currentPage}&limit=${limit}`);
export const updateAuthor = (id, postData) => api.put(`/authors/${id}`, postData);
export const updateAuthorAvatar = (id, postData) => api.patch(`/authors/${id}/avatar`, postData);

//FUNZIONI RIGUARDANTI I COMMENTI DI UN POST SPECIFICO
export const getComments = (id) => api.get(`/blogPosts/${id}/comments`);
export const createComment = (id, postData) => api.post(`/blogPosts/${id}/comments`, postData);
export const updateComment = (id, commentId, postData) => api.put(`/blogPosts/${id}/comments/${commentId}`, postData);
export const deleteComment = (id, commentId) => api.delete(`/blogPosts/${id}/comments/${commentId}`);


//FUNZIONI RIGUARDANTI L'AUTENTICAZIONE
//FUNZIONE PER REGISTRARE L'UTENTE
export const registerUser = (userData) => api.post("/authors", userData);

//FUNZIONE PER EFFETTUARE IL LOGIN
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); 
    console.log("Risposta API login:", response.data); 
    return response.data; 
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); 
    throw error; 
  }
};

//FUNZIONE PER OTTENERE I DATI DELL'UTENTE ATTUALMENTE AUTENTICATO
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);

//FUNZIONE PER OTTENERE I DATI DELL'UTENTE ATTUALMENTE AUTENTICATO
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data; 
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error); 
    throw error; 
  }
};