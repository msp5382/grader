import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
export default (props) => {
  const [height, setHeight] = useState(600);
  useEffect(() => {
    if (process.browser) setHeight(window.innerHeight - 100);
  }, [process.browser]);
  return (
    <div className="max-w-5xl mx-auto my-auto">
      <div className={props.blur ? "blur-lg filter" : ""}>
        <div className="flex flex-col min-h-screen justify-center">
          <div className="flex flex-row justify-center">
            <div className="w-1/2">{props.children[1]}</div>
            <div className="w-1/2">
              <div className="bg-gray-900 flex flex-col" style={{ height }}>
                <div className="w-full border-b text-sm border-gray-500 text-gray-400 flex justify-between">
                  {props.children[0]}
                </div>
                {props.isShowModal && (
                  <>
                    <div className="bg-gray-200 pt-2 text-xs h-72 overflow-scroll no-scrollbar">
                      <b className="px-1">
                        TESTCASE LIST{" "}
                        <span
                          onClick={props.addTestcase}
                          className="text-green-800 underline cursor-pointer"
                        >
                          [add]
                        </span>
                      </b>
                      {props.TestcaseDisp}
                    </div>
                  </>
                )}
                <div className="h-full text-sm pb-1 overflow-scroll text-gray-200">
                  {props.children[2]}
                </div>
                <div className="bg-gray-800 text-white text-xs flex p-2">
                  <div className="w-32">
                    <b className="px-1">RESULTS :</b>
                  </div>

                  <div className="w-full flex overflow-scroll no-scrollbar">
                    {props.TestcaseBottomDisp}
                  </div>
                  <div className="w-3 mt-0.5">
                    <div
                      data-tip
                      data-for="serverTip"
                      className={`w-3 h-3 ${
                        props.isConnected ? "bg-green-800" : "bg-red-800"
                      } rounded-full`}
                    ></div>
                  </div>
                  <ReactTooltip id="serverTip" place="right" effect="solid">
                    {props.isConnected ? "Connected" : "Can't connect"} to
                    server บ้อก #1 🐶
                  </ReactTooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="text-gray-500 text-center mt-3 text-xs">
            grader made with 💖 by{" "}
            <a className="underline" href="http://github.com/msp5382">
              meen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
