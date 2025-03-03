import React, { createContext, useState, useContext, useEffect } from "react";

//context valor
const WebViewDataContext = createContext();

// provider
export const WebViewDataProvider = ({ children }) => {
  const [webViewData, setWebViewData] = useState(() => {
    // Try to get data from sessionStorage on initial load
    const savedData = localStorage.getItem("webViewData");
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    const handleMessage = (event) => {
      console.log("📩 Mensaje recibido:", event.data);

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        setWebViewData(data);

        // Store in sessionStorage
        sessionStorage.setItem("webViewData", JSON.stringify(data));
      } catch (error) {
        console.error("❌ Error al recibir datos desde la WebView:", error);
      }
    };

    // ✅ Works for Android
    window.addEventListener("message", handleMessage);

    // ✅ Required for iOS WebView
    document.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <WebViewDataContext.Provider value={{ webViewData, setWebViewData }}>
      {children}
    </WebViewDataContext.Provider>
  );
};

// Custom Hook to use the context
export const useWebViewData = () => {
  const context = useContext(WebViewDataContext);
  if (!context) {
    throw new Error("useWebViewData must be used within a WebViewDataProvider");
  }
  return context;
};
