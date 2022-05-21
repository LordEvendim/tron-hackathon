import { appMetadata } from "../../constants/appMetadata";
import { useHashconnect } from "../../stores/useHashconnect";
import { useUserData } from "../../stores/useUserData";

export const initalizeHashconnect = async (): Promise<[boolean, string]> => {
  const hashconnect = useHashconnect.getState().hashconenct;
  const setSaveData = useHashconnect.getState().setData;
  const login = useUserData.getState().login;

  let saveData = {
    topic: "",
    pairingString: "",
    privateKey: "",
    pairedWalletData: undefined,
    pairedAccounts: [],
  };

  const loadLocalData = (): boolean => {
    let foundData = localStorage.getItem("hashconnectData");

    if (foundData) {
      saveData = JSON.parse(foundData);
      return true;
    } else return false;
  };

  if (!loadLocalData()) {
    //first init and store the private for later
    let initData = await hashconnect.init(appMetadata);
    saveData.privateKey = initData.privKey;

    console.log(initData.privKey);

    //then connect, storing the new topic for later
    const state = await hashconnect.connect();
    saveData.topic = state.topic;

    //generate a pairing string, which you can display and generate a QR code from
    saveData.pairingString = hashconnect.generatePairingString(
      state,
      "testnet",
      true
    );

    console.log(saveData.pairingString);

    setSaveData(saveData);

    return [true, saveData.pairingString];
  } else {
    //use loaded data for initialization + connection
    console.log("Connecting with local storage data");

    await hashconnect.init(appMetadata, saveData.privateKey);
    await hashconnect.connect(saveData.topic, saveData.pairedWalletData);

    console.log(saveData);
    login(saveData.pairedAccounts[0]);
    return [false, ""];
  }
};
