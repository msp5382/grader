import React, { useCallback, useEffect, useRef, useState } from "react";
import { run, pingServer } from "../services/repl";
import dynamic from "next/dynamic";
import Wrap from "../components/Wrap";
import Toolbar from "../components/Toolbar";

const XTerm = dynamic(() => import("../components/XTerm"), { ssr: false });
const Ace = dynamic(() => import("../components/Ace"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-800 text-white p-5 text-center">
      Loading code editor...
    </div>
  ),
});
const Testcase = ({ idx, input, output }) => (
  <div className="flex">
    <div className="border-gray-500 border-r border-t border-b w-12">{idx}</div>
    <div className="border-gray-500 border-r border-t border-b w-full">
      {input}
    </div>
    <div className="border-gray-500 border-t border-b w-full">{output}</div>
  </div>
);

const TestcaseAddingModal = () => {
  return (
    <div className="absolute w-screen h-screen flex flex-col">
      <div className="z-50 h-3/6 m-auto max-w-lg rounded-lg w-11/12 border-gray-700 border-2 bg-gray-900 text-green-700">
        <div className="flex p-3  justify-between">
          <div className="font-bold">Edit Testcases</div>
          <div className="text">
            <ion-icon size="xl" name="close"></ion-icon>
          </div>
        </div>
        <hr className="border-gray-600 border-1" />
        <div className="p-3 text-gray-300 text-xs">
          Write testcases you want or import from pdf
        </div>
        <div className="flex p-3 text-gray-400">
          <div className="w-12">#1</div>
          <div className="w-full h-full border-t border-l border-b border-gray-400">
            <span onChange={console.log} role="textbox" contenteditable="true">
              aaaaaaa
            </span>
          </div>
          <div className="w-full h-full border border-gray-400">a</div>
        </div>
        <div className="justify-end flex pr-3">
          <button className="font-bold">[add]</button>
        </div>
      </div>
      <div className="z-40 w-screen h-screen fixed backdrop-blur-xl"></div>
    </div>
  );
};

export default function Home() {
  const starterCode = `#เขียนโค้ดเลย!
print("Hello",input("name?"))`;
  const xtermRef = React.useRef(null);
  let input = useRef(() => {});
  let feeder = useRef(() => {});
  let clearTerminal = useRef(() => {});
  const [isShowModal, setIsShowModal] = useState(false);
  const [code, setCode] = useState(starterCode);
  const [testcases, setTestcases] = useState([
    { idx: 1, input: "aaaa", output: "bbbb" },
  ]);
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
    console.log("send", data);
    input.current(data + "\n");
  };

  const registerToTerminal = (_feeder) => {
    console.log("feeder", feeder);
    feeder.current = _feeder;
  };
  return (
    <>
      {/* <TestcaseAddingModal></TestcaseAddingModal> */}
      <Wrap
        isShowModal={isShowModal}
        TestcaseBottomDisp={testcases.map((testcase) => (
          <div className={`text-green-600 font-bold mr-1`}>#{testcase.idx}</div>
        ))}
        TestcaseDisp={testcases.map((props) => (
          <Testcase {...props} />
        ))}
        isConnected={connectionStatus}
        addTestcase={() => {}}
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
