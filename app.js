const http = require("http");
const user = require("./user");
const port = process.env.PORT || 3000;

//Function to get Data in Array format 
const getReqData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let postData = "";
      req.on("data", (chunk) => {
        postData += chunk;
      });
      req.on("end", () => {
        resolve(JSON.parse(postData));
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Creating server
const server = http.createServer(async (req, res) => {
  if (req.url === "/login" && req.method === "POST") {
    let data = await getReqData(req);
    if (!data) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end("<h1>INVALID DATA</h1>");
    }
    const validUser = user.login(data);
    if (validUser.status) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(`<h1>Login Successfull</h1>`);
    } else {
      res.statusCode = 401;
      res.setHeader("Content-Type", "text/html");
      res.end(`<h1>${validUser.message}</h1>`);
    }
  } else if (req.url === "/register" && req.method === "POST") {
    let data = await getReqData(req);
    if (!data) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end("<h1>INVALID DATA</h1>");
    }
    const registerUser = user.register(data);
    if(registerUser.status)
    {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(`<h1>Welcome ${data.name}</h1>`);
    }
    else
    {
      res.statusCode = registerUser.statusCode;
      res.setHeader("Content-Type", "text/html");
      res.end(`<h1>${registerUser.message}</h1>`);
    }

  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write("404 ERROR PAGE. PAGE DOESN't EXIT");
    res.end();
  }
});

//Listing Server
server.listen(port, () => {
  console.log(`Listening To Port No.: ${port}`);
});
