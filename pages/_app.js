import "tailwindcss/tailwind.css";
import "./style.css";
import Context from "../services/store";
import { useState } from "react";
function MyApp({ Component, pageProps }) {
  const [testcases, setTestcases] = useState([
    { idx: 1, input: "aaaa", output: "bbbb" },
  ]);
  return (
    <>
      <Context.Provider value={{ testcases, setTestcases }}>
        <Component {...pageProps} />
      </Context.Provider>
    </>
  );
}

export default MyApp;
