import { LinearProgress } from '@mui/material';
import AuthLogo from './AuthLogo';
import '../../theme/login/Login.scss';
import '../../theme/EwiseTheme';
import { ThemeSwitcher } from '../../helpers';

const LoadingAuthPage = () => {
  ThemeSwitcher();
  return (
    <div id="dialog-signin-loading" data-test="signin-loading">
      <LinearProgress/>
      <div className="loading_logo">
        <AuthLogo />
      </div>
    </div>
  );
};

export default LoadingAuthPage;