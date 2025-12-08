import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";
import "./App.css";
// import { ThemeSwitcher } from "./components/ThemeSwitcher";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
        }}
      />
      {/* <ThemeSwitcher /> */}
      <AppRouter />
    </>
  );
}

export default App;
