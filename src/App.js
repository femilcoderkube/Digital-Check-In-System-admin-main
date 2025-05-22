import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, startTransition, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { routes } from "./routes/routes";
import "../src/assets/css/selectedStyles.css";
const Loader = lazy(() => import("./components/loader/Loader"));
const MainRoute = lazy(() => import("./components/mainRoute/MainRoute"));
const PublicRoute = lazy(() => import("./routes/publicRoute/PublicRoute"));
const LostConnection = lazy(() =>
  import("./components/lostConnection/LostConnection")
);

const checkSession = () => {
  const expiryTime = localStorage.getItem("expiryTime");
  return expiryTime && Date.now() > expiryTime;
};

const App = () => {
  // const isLoading = useSelector((state) => state.loader?.isLoading);

  // useEffect(() => {
  //   if (checkSession()) {
  //     startTransition(() => {
  //       dispatch(logoutAction());
  //     });
  //   }
  // }, [dispatch]);

  return (
    <div>
      {/* {isLoading && <Loader />} */}
      <Toaster position="top-right" />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {routes.map(({ path, component, isPublic }) => {
              const Component = lazy(() => import(`./pages/${component}`));
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    isPublic ? (
                      <PublicRoute>
                        <Component />
                      </PublicRoute>
                    ) : (
                      <MainRoute>
                        <Component />
                      </MainRoute>
                    )
                  }
                />
              );
            })}
            <Route path="*" element={<LostConnection />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;
