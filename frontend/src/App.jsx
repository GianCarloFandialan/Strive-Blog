import React, { useState } from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CurrentPageContext, HomeLoadingContext, IsSearchingContext, LoggedInContext, LoggedUserDataContext, PostsContext, SearchTextContext } from "./data/Context";
import Register from "./views/register/Register";
import Login from "./views/login/Login";
import Author from "./views/author/Author";
import AuthorDetails from "./views/author-details/AuthorDetails";

function App() {

  //CREO LO STATO PER POTERMI GESTIRE I POST CHE RICHIAMERO DALL'API
  const [posts, setPosts] = useState([])

  // CREO UNO STATO PER GESTIRMI LA PAGINAZIONE IN MODO GLOBALE
  const [currentPage, setCurrentPage] = useState(1); 

  //CREO LO STATO PER POTERMI GESTIRE IL VALORE DELLA BARRA DI RICERCA IN MODO GLOBALE
  const [searchText, setSearchText] = useState("")

  //CREO UNO STATO PER POTERMI GESTIRE IL FATTO CHE CI SIA UN UTENTE LOGGATO OPPURE NO
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //STATO IN CUI "SALVARMI" I DATI DELL'UTENTE LOGGATO
  const [userLogged, setUserLogged] = useState("");

  //CREO LO STATO PER POTERMI GESTIRE I VARI SPINNER DA INSERIRE MENTRE LA PAGINA STA CARICANDO
  const [isLoading, setIsLoading] = useState(true)

  //CREO LO STATO PER POTERMI GESTIRE I VARI SPINNER DA INSERIRE MENTRE LA PAGINA STA CARICANDO
  const [isSearching, setIsSearching] = useState(false)

  return (
    <PostsContext.Provider value = { { posts, setPosts } }>
      <CurrentPageContext.Provider value = { { currentPage, setCurrentPage } }>
        <SearchTextContext.Provider value = { { searchText, setSearchText } }>
          <HomeLoadingContext.Provider value = { { isLoading, setIsLoading } }>
            <IsSearchingContext.Provider value = { { isSearching, setIsSearching } }>
              <LoggedInContext.Provider value = { { isLoggedIn, setIsLoggedIn } }>
                <LoggedUserDataContext.Provider value = { { userLogged, setUserLogged } }>
                  <Router>
                    <NavBar />
                    <Routes>
                      <Route path="/" exact element={<Home />} />
                      <Route path="/blog/:id" element={<Blog />} />
                      <Route path="/new" element={<NewBlogPost />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/registration" element={<Register />} />
                      <Route path="/author/:id" element={<Author />} />
                      <Route path="/authorDetails/:id" element={<AuthorDetails />} />
                    </Routes>
                    <Footer />
                  </Router>
                </LoggedUserDataContext.Provider>
              </LoggedInContext.Provider>
            </IsSearchingContext.Provider>
          </HomeLoadingContext.Provider>
        </SearchTextContext.Provider>
      </CurrentPageContext.Provider>
    </PostsContext.Provider>
  );
}

export default App;
