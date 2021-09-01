import React, { useContext, useEffect, useRef, useState } from "react";
import { run, pingServer } from "../services/repl";
import dynamic from "next/dynamic";
import Context from "../services/store";
import Wrap from "../components/Wrap";
import Toolbar from "../components/Toolbar";
import TestcaseModal from "../components/TestcaseModal";
import Testcase from "../components/Testcase";
const XTerm = dynamic(() => import("../components/XTerm"), { ssr: false });
const Ace = dynamic(() => import("../components/Ace"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-800 text-white p-5 text-center">
      Loading code editor...
    </div>
  ),
});

export default function Home() {
  const starterCode = `#เขียนโค้ดเลย!
print("Hello",input("name?"))`;
  const xtermRef = React.useRef(null);
  let input = useRef(() => {});
  let feeder = useRef(() => {});
  let clearTerminal = useRef(() => {});
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowTestcaseModal, setIsShowTestcaseModal] = useState(false);
  const [code, setCode] = useState(starterCode);
  const { testcases, setTestcases } = useContext(Context);

  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    if (xtermRef.current) {
      console.log(xtermRef.current);
    }
  }, [xtermRef]);

  useEffect(() => {
    (async () => {
      try {
        setConnectionStatus(await pingServer());
      } catch (error) {
        setConnectionStatus(false);
      }
    })();
  }, []);

  const runPython = async () => {
    clearTerminal.current();
    await run(
      code,
      (c) => {},
      (o) => {
        clearTerminal.current(true);
        feeder.current(o.out);
      },
      (_input) => (input.current = _input)
    );
  };

  const sendData = (data) => {
    input.current(data + "\n");
  };

  const registerToTerminal = (_feeder) => {
    feeder.current = _feeder;
  };
  return (
    <>
      {isShowTestcaseModal && (
        <TestcaseModal {...{ setIsShowTestcaseModal }}></TestcaseModal>
      )}

      <Wrap
        isShowModal={isShowModal}
        TestcaseBottomDisp={testcases.map((testcase) => (
          <div className={`text-green-600 font-bold mr-1`}>#{testcase.idx}</div>
        ))}
        TestcaseDisp={testcases.map((props) => (
          <Testcase {...props} />
        ))}
        isConnected={connectionStatus}
        addTestcase={() => setIsShowTestcaseModal(true)}
        blur={false}
      >
        <Toolbar
          runPython={runPython}
          toggleTestcase={() => setIsShowModal(!isShowModal)}
        />
        <Ace code={code} onChange={setCode} />
        <XTerm
          ref={xtermRef}
          registerToTerminal={registerToTerminal}
          enteredData={sendData}
          clear={(_clear) => {
            clearTerminal.current = _clear;
          }}
        />
      </Wrap>
    </>
  );
}
