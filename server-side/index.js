const express = require("express");
const expressWebSocket = require("express-ws");
const spawn = require("child_process").spawn;
const exec = require("child_process").exec;
const fs = require("fs");

const terminateAfter = 60000;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "*");

  next();
});

const createDir = (dir) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, resolve);
    }
  });
};

const getJobID = () => {
  return "job_" + Math.round(Math.random() * 100000);
};

const createPythonInteractiveJob = (code, jobId) => {
  return new Promise(async (resolve, reject) => {
    await createDir(jobId);
    fs.writeFile(jobId + "/main.py", code, (e) => {
      console.log("creating python");
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });
};

const createPythonTestJob = async (code, jobId, inputs) => {
  await new Promise(async (resolve, reject) => {
    await createDir(jobId);
    fs.writeFile(jobId + "/main.py", code, (e) => {
      console.log("creating python");
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });
  await Promise.all(
    inputs.map((input, i) => {
      return new Promise(async (resolve, reject) => {
        fs.writeFile(jobId + "/in_" + i, input, (e) => {
          console.log("creating python");
          if (e) {
            reject(e);
          } else {
            resolve();
          }
        });
      });
    })
  );
  return;
};

const endPythonInteractiveJob = (jobId) => {
  fs.rmdirSync(jobId, { recursive: true });
  return;
};
const spawnWithJobId = (jobId) => spawn("python3", [jobId + "/main.py"]);
const spawnWithInput = (jobId, i) =>
  exec(
    "python3 " +
      jobId +
      "/main.py " +
      "< " +
      jobId +
      "/in_" +
      i +
      " > " +
      jobId +
      "/out_" +
      i
  );

expressWebSocket(app, null, {
  perMessageDeflate: false,
});

const sendWithWs = (status, code, out) => JSON.stringify({ status, code, out });

app.post("/create", async (req, res) => {
  const jobId = getJobID();
  await createPythonInteractiveJob(req.body.code, jobId);
  res.send({ status: "success", jobId });
});

app.post("/test", async (req, res) => {
  const jobId = getJobID();
  const { code, inputs } = req.body;
  createPythonTestJob(code, jobId, inputs);
  await Promise.all(
    inputs.map((input, i) => {
      console.log("run", i);
      return spawnWithInput(jobId, i);
    })
  );
  res.send({ status: "success", jobId });
});

app.get("/ping", async (req, res) => {
  res.send({ status: "pong" });
});

app.ws("/connect", async (ws, req) => {
  const jobId = req.query.jobId;
  const job = spawnWithJobId(jobId);
  setTimeout(() => {
    ws.send(sendWithWs("session_end", 0, ""));
    ws.close();
    job.kill();
    endPythonInteractiveJob(jobId);
    console.log("terminate");
  }, terminateAfter);

  ws.on("message", function (msg) {
    console.log(job);
    job.stdin.write(msg);
  });

  job.stdout.on("data", function (data) {
    let stdout = data.toString();
    ws.send(sendWithWs("stdout", 0, stdout));
  });

  job.stderr.on("data", function (data) {
    let stderr = data.toString();
    ws.send(sendWithWs("stderr", 0, stderr));
  });

  job.on("exit", async function (code) {
    endPythonInteractiveJob(jobId);
    ws.send(sendWithWs("exit", code, ""));
    ws.close();
  });

  job.on("error", function (e) {
    console.log("error: " + e.message);
  });
});

app.listen(5200);
console.log("started");
