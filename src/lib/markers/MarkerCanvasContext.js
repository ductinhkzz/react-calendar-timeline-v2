import React from 'react';

/* eslint-disable no-console */
const defaultContextState = {
  subscribeToMouseOver: () => {
    console.warn('"subscribeToMouseOver" default func is being used');
  },
};
/* eslint-enable */

const MarkerCanvasContext = React.createContext(defaultContextState);

export const MarkerCanvasProvider = MarkerCanvasContext.Provider;
export const MarkerCanvasConsumer = MarkerCanvasContext.Consumer;
