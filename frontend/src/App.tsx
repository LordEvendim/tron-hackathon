import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
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
import { useHashconnect } from "./stores/useHashconnect";
import { useUserData } from "./stores/useUserData";

const App: React.FC<{}> = () => {
  const status = useApplicationInitialization();
  const hashconnect = useHashconnect((state) => state.hashconenct);
  const login = useUserData((state) => state.login);
  const saveData = useHashconnect((state) => state.data);
  const SetSavedata = useHashconnect((state) => state.setData);

  useEffect(() => {
    const saveDataInLocalstorage = async () => {
      let data = JSON.stringify(saveData);

      localStorage.setItem("hashconnectData", data);
    };

    hashconnect.pairingEvent.once((pairingData) => {
      pairingData.accountIds.forEach((id) => {
        console.log(id);
        login(id);
        saveDataInLocalstorage();
        SetSavedata({ ...saveData, pairedAccounts: [id] });
      });
    });
  }, [hashconnect, login, SetSavedata]);

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
