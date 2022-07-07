import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Center } from "@chakra-ui/react";

import { NavigationBar } from "./components/NavigationBar";
import { About } from "./components/pages/About";
import { Contracts } from "./components/pages/Contracts";
import { Dashboard } from "./components/pages/Dashboard";
import { Mainpage } from "./components/pages/Mainpage";
import { useApplicationInitialization } from "./modules/initialization/useApplicationInitialization";
import { Create } from "./components/pages/Create";
import { DepositNft } from "./components/pages/DepositNft";
import { Deposit } from "./components/pages/Deposit";
import { useUserData } from "./stores/useUserData";

const App: React.FC<{}> = () => {
  const status = useApplicationInitialization();

  switch (status.status) {
    case "failed":
      return <div>Failed to initalize application</div>;
    case "loading":
      return <div>Loading...</div>;
    case "succeeded":
      return (
        <>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/create" element={<Create />} />
            <Route path="/deposit-nft" element={<DepositNft />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </>
      );
    default:
      return <Center>Application has failed!</Center>;
  }
};

export default App;
