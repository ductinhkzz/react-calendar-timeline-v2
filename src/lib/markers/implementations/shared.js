import React from 'react';

export const createMarkerStylesWithLeftOffset = (leftOffset) => ({
  left: leftOffset,
});

export const createDefaultRenderer = (dataTestidValue) => {
  return function DefaultMarkerRenderer({ styles }) {
    return <div className="rct-today-line" style={styles} data-testid={dataTestidValue} />;
  };
};
