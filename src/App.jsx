import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { restoreSession } from "./redux/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
