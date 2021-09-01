import React, { useEffect, useRef, useState } from "react";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
export default ({
  registerToTerminal = () => {},
  enteredData = () => {},
  clear = () => {},
}) => {
  const ref = useRef();
  const data = useRef("");
  useEffect(() => {
    if (ref.current) {
      const term = new Terminal({
        fontFamily: "Fira Code",
        theme: {
          background: "#111827",
        },
      });
      term.open(ref.current, false);
      const write = (k) => {
        data.current += k;
        term.write(k);
        console.log("cur", data.current);
      };
      const feedData = (line) => {
        const clean = line.replace(/\n/g, "\r\n");
        term.write(clean);
      };
      term.onKey((e) => {
        if (e.domEvent.key === "Enter") {
          enteredData(data.current);
          write("\r\n");
        }
        if (e.domEvent.key === "Backspace") {
          data.current = data.current.slice(0, -1);
          term.write("\b \b");
          console.log("cur", data.current);
        }
      });
      term.onData((e) => {
        write(e);
      });
      registerToTerminal(feedData);
      clear((isOnlyData) => {
        if (isOnlyData) {
          data.current = "";
        } else {
          term.clear();
          data.current = "";
          console.log("clear", data.current);
        }
      });
    }
  }, [ref, data]);
  return <div ref={ref}></div>;
};
// export default React.forwardRef((props, ref) => <XTerm {...props} ref={ref} />);
