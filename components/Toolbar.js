const Toolbar = ({ runPython, toggleTestcase }) => {
  return (
    <>
      <div className="flex">
        <button className="p-2 text-green-600 flex" onClick={runPython}>
          <div className=" mt-0.5 mr-1">
            <ion-icon name="play"></ion-icon>
          </div>
          RUN CODE
        </button>
        <div className="h-full w-0 border-l-2 border-gray-700"></div>
        <button className="p-2 text-green-600 flex">
          <div className=" mt-0.5 mr-1">
            <ion-icon name="play"></ion-icon>
          </div>
          RUN TEST
        </button>
        <div className="h-full w-0 border-l-2 border-gray-700"></div>
      </div>
      <button className="p-2 text-gray-400 flex" onClick={toggleTestcase}>
        <div className="mt-0.5 mr-1">
          <ion-icon name="settings"></ion-icon>
        </div>
        SETTINGS
      </button>
    </>
  );
};

export default Toolbar;
