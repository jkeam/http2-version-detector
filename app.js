const http = require('http');
const url = require('url');
const PORT = 8080; 
const DEBUG = false;

handleRequest = (request, response) => {
  const website = url.parse(request.url, true).query['website'];
  if (!website) {
    response.end('{error: "Missing website"}');
    return;
  }

  const methods = [];
  const spawn = require('child_process').spawn;
  const curl = spawn('./http2.sh', [website]);

  curl.stdout.on('data', (data) => {
    data.toString().split('\n').forEach((line) => {
      if (line.indexOf('HTTP/') > -1) {
        methods.push(line.trim());
      }
    });
  });

  // curl.stderr.on('data', (data) => {
  //   console.log(`stderr: ${data}`);
  // });

  curl.on('close', (code) => {
    if (DEBUG) {
      console.log(`child process exited with code ${code} on ${new Date()}`);
    }
    response.end(JSON.stringify({methods}));
    return;
  });
};

const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log("Server listening on: http://localhost:%s", PORT);
});
