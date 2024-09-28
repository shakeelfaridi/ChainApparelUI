import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';
// hooks
import useResponsive from '../hooks/useResponsive';

// local storage
import { localStorageHas, localStorageGet, localStorageSave } from '../helpers/LocalStorage';

// ----------------------------------------------------------------------

const initialState = {
  collapseClick: false,
  collapseHover: false,
  onToggleCollapse: () => {},
  onHoverEnter: () => {},
  onHoverLeave: () => {},
};

const CollapseDrawerContext = createContext(initialState);

// ----------------------------------------------------------------------

CollapseDrawerProvider.propTypes = {
  children: PropTypes.node,
};

function CollapseDrawerProvider({ children }) {
  const isDesktop = useResponsive('up', 'lg');

  const [collapse, setCollapse] = useState({
    click: false,
    hover: false,
  });

  useEffect(() => {
    if (!isDesktop) {
      setCollapse({
        click: false,
        hover: false,
      });
    }else{
      if(localStorageHas('[global]-adminbar')){
        setCollapse(localStorageGet('[global]-adminbar'));
      }else{
        setCollapse({
          click: false,
          hover: false,
        });
      }
    }
  }, [isDesktop]);

  const handleToggleCollapse = () => {
    setCollapse({ ...collapse, click: !collapse.click });
    localStorageSave('[global]-adminbar', collapse);
  };

  const handleHoverEnter = () => {
    if (collapse.click) {
      setCollapse({ ...collapse, hover: true });
      localStorageSave('[global]-adminbar', collapse);
    }
  };

  const handleHoverLeave = () => {
    setCollapse({ ...collapse, hover: false });
    localStorageSave('[global]-adminbar', collapse);
  };

  return (
    <CollapseDrawerContext.Provider
      value={{
        isCollapse: collapse.click && !collapse.hover,
        collapseClick: collapse.click,
        collapseHover: collapse.hover,
        onToggleCollapse: handleToggleCollapse,
        onHoverEnter: handleHoverEnter,
        onHoverLeave: handleHoverLeave,
      }}
    >
      {children}
    </CollapseDrawerContext.Provider>
  );
}

export { CollapseDrawerProvider, CollapseDrawerContext };
