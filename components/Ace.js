import React from "react";
import dynamic from "next/dynamic";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";

export default function Editor({ onChange, code }) {
  return (
    <AceEditor
      style={{
        fontFamily: "Fira Code",
        width: "100%",
        height: window.innerHeight - 100,
      }}
      defaultValue={code}
      fontSize={14}
      mode="python"
      theme="dracula"
      onChange={onChange}
      name="code"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        selectionStyle: "line",
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}
