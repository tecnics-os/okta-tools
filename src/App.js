import Sidebar from "./components/Sidebar";
import logo from "./assets/technicsLogo.png";

function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <header className="navbar navbar-expand-lg navbar-light bg-light header-border">
        <div className="container-fluid">
          <div>
            <a className="nav-link fs-3" href="/">
              <strong>Okta Tools</strong>
            </a>
          </div>
          <a className="navbar-brand" href="https://tecnics.com/">
            <img src={logo} alt="technics-logo" height="20" />
          </a>
        </div>
      </header>
      <div className="container-fluid flex-grow-1">
        <Sidebar />
      </div>
      <footer id="footer" className="footer mt-auto bg-light footer-border">
        <div className="container-fluid d-flex justify-content-center align-items-center mt-3">
          <p className="text-secondary">© 2021, OktaTools made by Tecnics</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
