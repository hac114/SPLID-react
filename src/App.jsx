import "./App.css";
import Header from "./components/common/Header";
import GroupManager from "./components/groups/GroupManager";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <GroupManager />
      </main>
    </div>
  );
}

export default App;