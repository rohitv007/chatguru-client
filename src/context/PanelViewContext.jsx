import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

export const PanelViewContext = createContext({
  isShowPanel: false,
  width: 0,
  viewPanel: () => {},
  hidePanel: () => {}
});

export const PanelViewContextProvider = ({ children }) => {
  const [isShowPanel, setIsShowPanel] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);

  const viewPanel = () => setIsShowPanel(true);
  const hidePanel = () => setIsShowPanel(false);

  useEffect(() => {
    const handleResize = debounce(() => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setIsShowPanel(newWidth >= 480);
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => {
      handleResize.cancel(); // Clean up debounce
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <PanelViewContext.Provider
      value={{ isShowPanel, width, viewPanel, hidePanel }}
    >
      {children}
    </PanelViewContext.Provider>
  );
};

PanelViewContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
