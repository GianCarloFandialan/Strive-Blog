//CREO IL CONTEXT
import { createContext } from "react";

//CONTEXT CHE MI GESTIRÀ I POST NELLA PAGINA
export const PostsContext = createContext(null);

//CONTEXT CHE MI GESTIRÀ IL LOADER DELLA HOME
export const HomeLoadingContext = createContext(null)

//CONTEXT CHE MI GESTIRÀ IL LOADER DELLA HOME
export const IsSearchingContext = createContext(null)

//CONTEXT CHE MI GESTIRÀ IIL NUMERO DELLA PAGINA DELLA HOMEPAGE
export const CurrentPageContext = createContext(null);

//CONTEXT CHE MI GESTIRÀ IL TESTO DELLA SEARCHBAR
export const SearchTextContext = createContext(null);

//CONTEXT CHE MI GESTIRÀ I COMMENTI DI UN POST SPECIFICO
export const CommentsContext = createContext(null);

//CONTEXT CHE MI GESTIRÀ I LOADERS DEI COMMENTI DI UN POST SPECIFICO
export const CommentsLoadingContext = createContext(null);

//CONTEXT CHE MI GESTIRÀ IL FATTO CHE CI SIA UN UTENTE LOGGATO O NO
export const LoggedInContext = createContext(null);

//CONTEXT CHE MI GESTIRÀ IDATI DELL'UTENTE NEL CASO CI SIA UN UTENTE LOGGATO
export const LoggedUserDataContext = createContext(null);


