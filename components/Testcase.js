const Testcase = ({ idx, input, output }) => (
  <div className="flex">
    <div className="border-gray-500 border-r border-t border-b w-12">{idx}</div>
    <div className="border-gray-500 border-r border-t border-b w-full">
      {input}
    </div>
    <div className="border-gray-500 border-t border-b w-full">{output}</div>
  </div>
);

export default Testcase;
