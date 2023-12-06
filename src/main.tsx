import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

//-------------- Code for Database connection --------------//
// import {
//   storageListBuckets,
//   storageListBucketFiles,
// } from "./database/storageFunctions.tsx";

// // Bucket name
// const bucketName = "testBucket";

// storageListBuckets();

// storageListBucketFiles(bucketName);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
