import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./Style.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    
    code ? <Dashboard className="root" code={code} /> : <Login />
    

  )
}

export default App;
