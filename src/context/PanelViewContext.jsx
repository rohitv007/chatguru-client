import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const PanelViewContext = createContext({
  isShowPanel: false,
  width: 0,
  viewPanel: () => {},
  hidePanel: () => {},
});

export const PanelViewContextProvider = ({ children }) => {
  const [isShowPanel, setIsShowPanel] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);

  const viewPanel = () => setIsShowPanel(true);
  const hidePanel = () => setIsShowPanel(false);

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (width < 480) setIsShowPanel(false);
    else setIsShowPanel(true);
  }, [width]);

  return (
    <PanelViewContext.Provider
      value={{ isShowPanel, width, viewPanel, hidePanel }}
    >
      {children}
    </PanelViewContext.Provider>
  );
};

PanelViewContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
