import Sidebar from './components/Sidebar';

function App() {
    return (
        <div className="App">
          <div className="wrapper">
            <nav id="sidebar">
                <Sidebar/>
            </nav>
            <div id="content">
            </div>
          </div>
        </div>
  );
}

export default App;
