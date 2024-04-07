import React from 'react';
import SurveyNavbar from "../../../components/SurveyNavbar";

const SurveyLayout = ({ children }) => {
  
  return (
    <div>
      <SurveyNavbar />
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
};

export default SurveyLayout;