// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import LoadingAuthPage from "./components/authorize/LoadingAuthPage";
import { ProgressBarStyle } from "./components/ProgressBar";
import OauthProvider from "./components/providers/OauthProvider";
import ScrollToTop from "./components/ScrollToTop";
import NotistackProvider from "./components/NotistackProvider";


// ----------------------------------------------------------------------
export default function App() {
  return (
    <OauthProvider LoaderComponent={LoadingAuthPage}>
      <MotionLazyContainer>
        <ThemeProvider>
          {/* <ThemeSettings> */}
            <NotistackProvider>
              <ProgressBarStyle />
              <ScrollToTop />
              <Router />
            </NotistackProvider>
          {/* </ThemeSettings> */}
        </ThemeProvider>
      </MotionLazyContainer>
    </OauthProvider>
  );
}
