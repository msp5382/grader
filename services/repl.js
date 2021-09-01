import axios from "axios";

const base = `localhost:5200`;

export const run = async (code, connection, out, input) => {
  const res = await axios.post(`http://${base}/create/`, { code: code });
  const webSocket = new WebSocket(
    `ws://${base}/connect?jobId=${res.data.jobId}`
  );
  webSocket.onopen = function (event) {
    connection("connected");
  };
  webSocket.onmessage = async function (event) {
    console.log("ws out", event.data);
    out(JSON.parse(event.data));
  };
  input((data) => {
    console.log("use ws send", data);
    webSocket.send(data);
  });
};

export const pingServer = async () => {
  const res = await axios.get(`http://${base}/ping`);
  if (res.data.status == "pong") return true;
  else return false;
};
