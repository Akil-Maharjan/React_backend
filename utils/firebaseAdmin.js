import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "images-serving",
  private_key_id: "a50aecb52fbbb21bee1fc8d29db574bb057a8ad9",
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgvruy8Ip8q2f/\neOjBknU6z+FTmyIC20iDGSo4mUse/Xn090zxt3IdKRef02d2Zkgs/IGP2jYgA8e4\nq0ScwqBsCMBYEqtm5LJXpEvRPbj3XZtC6ruqsa4E003thh6r1qBqh+gp5Lg77jIW\nFGdHdfJ+UoqlzHS+iDyK9eW3Lc8SWWnwZx53gL0FrjTlS92eeijL10vAhxkIKymC\nXSf4J/oLYwL2/TNXPoJHqHJlzoQ44PHEjwkz+OkP82Kb4I6HhmzOf4jWFMK9HVmD\n8CdCwluSq0CBFotUFSOm/IdfBFBkmwpC4y1CUt01hJ1xzNP1GwGH3IQnI4CqiHKn\nMPL35hMPAgMBAAECggEAAmcHYCPHNhjLu54/gFEjjmb3+6toZTmIymjQYDsuS77H\nGVmu3Tf8LSJll35t3++kaYO2ngNJZs4XqJNquZsREbxJv6c7x5Roc/XhKjXtc0kD\nXosqleEE9E6CLigggjn5eM4iMqoX9NFZD0prxr4lCy1JpDO7lPNtUDhfoA6/twr4\nAIE3lZ38cDIp25Gaw772Y2RzqiV/ndSP9ikl8xV6YtAXHpnDW7dCsmjG2yBKuZU5\npGs5XDzB/wJruhvyitXMTA8NHM8IDrt92edjNdD8Ge9a6toqbEeNCtz7Uk/IOVE1\nctJy4FJ/XUElqiY5iN4YTk9/iVjV08wS5MFggxKTXQKBgQDSa7JUPfzTXGkwR+1c\np9SwxrRIuf4+7SaGiF/rbnjHjRJPCPok+OzUgLwkcytWILyNqo/U36/PjtoMOMEy\nQFEHY4YqR59gAdNzHix58ueKsCHa4ux1Oz5opjusJSSiiZ8+jCh8Iv6+c47tNjWI\n1DabAoIPKVHfF9tu5uTTXh18wwKBgQDDkGj5DRDmm6cDYL53M50zc5otFBUh5Jvi\n820zEXqKoCrS2cmRcePM9wUQbGQ7U1pNdNqKlmDSec17XIsAE17q4OLZCgsMSKug\nQBECVKOPb4z2v3c+4hdVGIfVAeqEJJLKh5S+QAgEKfonErenXRnu+XKKuYHfFo6E\nQNCP3fmbxQKBgCYWto4HNnev9550tqOaAacKIOI1QK91UA70KqC8O4Krp4/E6Tq+\nEGia8POMIWESxe7C3AxFfVaN3ixuLZKCD+jNfCC1HEVNr0/cO2LLtFvnbAlqIDFM\nSwy4Yn7TrmD5lmjFCCMIVqJ02n9X27Lr7wJ6Hr7N1PMUJ3VYuD0GgUHvAoGANhRa\nIvzs/ohuj+2R3g7E2vSN3wddrKi2PvVH7kZYF7ug+/vD1NekwgpROTBwK0Oqhh7Z\nTFe3YJzUKNf3jEbPCa60rIYtdfEmnML6sSVMsZ6MYbOiux30i9Cjx1CnVHF0slL5\n2/6C+PvOtD1l0f9Z647JkPkpo9JuCL6PrikZHG0CgYAGoMU2rXN7FqPa/DkW8YL0\nPEtSpkch7bEWyE5xmHEmYA0tbqQ/TSW6vDiyfT1ltt1wwZ40IdJYwD8dznuL43tS\nzA9k4Vr/vJ3BCZvHc1LfgzcfL908IO/QLd2vSlO7c0Lh6XsD8yc0SRn4j14nKi+f\n8k99f0dcfYOybzG+BONrXw==
-----END PRIVATE KEY-----\n`,
  client_email: "firebase-adminsdk-fbsvc@images-serving.iam.gserviceaccount.com",
  client_id: "117416970675586555890",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40images-serving.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};
const FIREBASE_STORAGE_BUCKET = "images-serving.appspot.com";
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: FIREBASE_STORAGE_BUCKET
  });
}

const bucket = admin.storage().bucket();
export default bucket;
