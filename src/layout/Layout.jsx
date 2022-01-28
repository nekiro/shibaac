import React from 'react';
import Head from './Head';
import Navigation from './NavBar';
import SideBar from './SideBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div id="container">
      <Head />
      <div className="header" />
      <Navigation />
      <SideBar />
      <div className="content">
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
