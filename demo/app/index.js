import './styles.scss';

import React, { Component } from 'react';

import { HashRouter as Router, Route, Link, useLocation, Routes, Outlet } from 'react-router-dom';

const demos = {
  main: require('./demo-main').default,
  performance: require('./demo-performance').default,
  treeGroups: require('./demo-tree-groups').default,
  linkedTimelines: require('./demo-linked-timelines').default,
  elementResize: require('./demo-element-resize').default,
  renderers: require('./demo-renderers').default,
  verticalClasses: require('./demo-vertical-classes').default,
  customItems: require('./demo-custom-items').default,
  customHeaders: require('./demo-headers').default,
  customInfoLabel: require('./demo-custom-info-label').default,
  controledSelect: require('./demo-controlled-select').default,
  controlledScrolling: require('./demo-controlled-scrolling').default,
};

const Menu = () => {
  const location = useLocation();
  let pathname = location?.pathname;

  if (!pathname || pathname === '/') {
    pathname = `/${Object.keys(demos)[0]}`;
  }

  return (
    <div className={`demo-row${pathname.indexOf('sticky') >= 0 ? ' sticky' : ''}`}>
      Choose the demo:
      {Object.keys(demos).map((key) => (
        <Link key={key} className={pathname === `/${key}` ? 'selected' : ''} to={`/${key}`}>
          {key}
        </Link>
      ))}
    </div>
  );
};

const Wrapper = () => {
  return (
    <div>
      <Menu />
      <div className="demo-demo">
        <Outlet />
      </div>
    </div>
  );
};

class App extends Component {
  render() {
    const DefaultComp = demos[Object.keys(demos)[0]];
    return (
      <Router>
        <Routes>
          <Route element={<Wrapper />}>
            <Route path="/" exact element={<DefaultComp />} />
            {Object.keys(demos).map((key) => {
              const Comp = demos[key];
              return <Route key={key} path={`/${key}`} element={<Comp />} />;
            })}
          </Route>
        </Routes>
      </Router>
    );
  }
}

export default App;
