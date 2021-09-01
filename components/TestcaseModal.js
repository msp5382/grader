import { useContext, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Context from "../services/store";
const focus = (p) => {
  p.focus();

  if (p.hasChildNodes()) {
    let s = window.getSelection();
    let r = document.createRange();
    let e = p.childElementCount > 0 ? p.lastChild : p;
    r.setStart(e, 1);
    r.setEnd(e, 1);
    s.removeAllRanges();
    s.addRange(r);
  }
};

const Testcase = ({ idx, input, output, setTestcases }) => {
  return (
    <div className="flex px-3 py-1  text-gray-400">
      <div className="w-12">#{idx}</div>
      <div className="w-full h-full border border-gray-400">
        <TextareaAutosize
          className="w-full h-full resize-none bg-transparent outline-none"
          value={input}
          onChange={(e) => {
            setTestcases((prev) =>
              prev.map((t) =>
                t.idx === idx ? { ...t, input: e.target.value } : t
              )
            );
          }}
        ></TextareaAutosize>
      </div>
      <div className="w-full h-full min-h-full border border-gray-400">
        <TextareaAutosize
          className="w-full h-full resize-none bg-transparent outline-none"
          value={output}
          onChange={(e) => {
            setTestcases((prev) =>
              prev.map((t) =>
                t.idx === idx ? { ...t, output: e.target.value } : t
              )
            );
          }}
        ></TextareaAutosize>
      </div>
    </div>
  );
};
const TestcaseAddingModal = ({ setIsShowTestcaseModal }) => {
  const { testcases, setTestcases } = useContext(Context);
  return (
    <div className="absolute w-screen h-screen flex flex-col">
      <div className="z-50 h-4/6 flex flex-col m-auto max-w-lg rounded-lg w-11/12 border-gray-700 border-2 bg-gray-900 text-green-700">
        <div className="flex p-3  justify-between">
          <div className="font-bold">Edit Testcases</div>
          <div
            onClick={() => setIsShowTestcaseModal(false)}
            className="cursor-pointer"
          >
            <ion-icon size="xl" name="close"></ion-icon>
          </div>
        </div>
        <hr className="border-gray-600 border-1" />

        <div className="overflow-scroll no-scrollbar h-full pb-3 text-sm">
          <div className="p-3 text-gray-300 text-xs">
            Write testcases you want or{" "}
            <a className="text-indigo-500 cursor-pointer hover:underline">
              import from pdf
            </a>
          </div>
          {testcases.map(({ idx, input, output }) => (
            <Testcase {...{ idx, input, output, setTestcases }} />
          ))}

          <div className="justify-end flex pr-3">
            <button
              onClick={() =>
                setTestcases([
                  ...testcases,
                  {
                    idx: testcases[testcases.length - 1].idx + 1,
                    input: "",
                    output: "",
                  },
                ])
              }
              className="font-bold"
            >
              [add]
            </button>
          </div>
        </div>
      </div>
      <div className="z-40 w-screen h-screen fixed backdrop-blur-xl"></div>
    </div>
  );
};

export default TestcaseAddingModal;
