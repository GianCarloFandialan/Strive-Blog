import React, { useContext, useEffect, useState } from "react";
import { Container, Navbar, NavDropdown  } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";
import { CurrentPageContext, IsSearchingContext, LoggedInContext, LoggedUserDataContext, SearchTextContext } from "../../data/Context";
import LoginButton from "../login/LoginButton";
import SearchBar from "../searchbar/Searchbar";
import { getUserData } from "../../data/apiAxios";
import AccountDropdown from "./navbar-components/AccountDropdown";


const NavBar = props => {

  //USO IL CONTEXT
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext)
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)
  const { searchText, setSearchText } = useContext(SearchTextContext)
  const { isSearching, setIsSearching } = useContext(IsSearchingContext)

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //FUNZIONE PER OTTENERE I DATI DELL'UTENTE ATTUALMENTE AUTENTICATO
  const fetchUser = async () => {
    try {
      const userData = await getUserData();
      console.log(userData);
      setUserLogged(userData)
    } catch (error) {
      console.error("Errore nel recupero dei dati utente:", error);
    }
  };  

  //AL CARICAMENTO DEL COMPONENTE
  useEffect(() => {

    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };


    checkLoginStatus();

    if (isLoggedIn) {
      fetchUser()
      navigate("/")
    } else {
      navigate("/login")
    }

    //EVENT LISTENER PER CONTROLLARE LO STATO DI LOGIN
    window.addEventListener("storage", checkLoginStatus);

    //RIMUOVO L'EVENT LISTENER QUANDO IL COMPONENTE VIENE SMONTATO
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };


  }, [isLoggedIn]);

  //FUNZIONE CHE GESTISCE IL CLICK DELLA NAVBAR
  const handleLogoClick = () => {
    setCurrentPage(1);
    setSearchText('');
    setIsSearching(false)
  }

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className=" justify-content-between row-gap-3">
        {isLoggedIn ? 
          <Navbar.Brand as={Link} to="/" onClick={handleLogoClick}>
            <img className="blog-navbar-brand" alt="logo" src={logo} />
          </Navbar.Brand> 
          : 
          <Navbar.Brand>
            <img className="blog-navbar-brand" alt="logo" src={logo} />
          </Navbar.Brand>
          }
        

        <Container className="w-50 d-none d-md-flex">
          {isLoggedIn && <SearchBar/>}
        </Container>

        {isLoggedIn ?
          <AccountDropdown/> 
          : 
          <LoginButton />
          }

        <Container className="w-100 d-flex d-md-none px-0">
          {isLoggedIn && <SearchBar/>}
        </Container>

      </Container>
    </Navbar>
  );
};

export default NavBar;
