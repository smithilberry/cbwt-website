const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const redirectSSL = require("redirect-ssl");
const nodeMailer = require("nodemailer");
const Bundler = require("parcel-bundler");
const Path = require("path");

const isDev = process.env.NODE_ENV !== 'production';

const file = Path.join(__dirname, "./html/index.html"); // Pass an absolute path to the entrypoint here
const options = {
  outDir: "./dist", // The out directory to put the build files in, defaults to dist
  outFile: "index.html", // The name of the outputFile
  publicUrl: "/", // The url to serve on, defaults to '/'
  watch: isDev, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: "browser", // Browser/node/electron, defaults to browser
  bundleNodeModules: false, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
  hmr: isDev, // Enable or disable HMR while watching
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  autoInstall: true // Enable or disable auto install of missing dependencies found during bundling
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(redirectSSL);

app.get("/api", function(req, res, next) {
  res.send({
    status: 200
  });
});

app.post("/api/mailer", function(req, res, next) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  if (transporter) {
    let mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: process.env.EMAIL_ADDRESS,
      subject: "New signup from campbikewinetour.com!",
      text: `Someone signed up for CBWT updates.

      Name: ${req.body.name}
      Email: (${req.body.email})`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.send({
          formDidFail: true
        });
      } else {
        res.send({
          formDidFail: false
        });
      }
    });
  }
});

// Initialize a new bundler using a file and options
const bundler = new Bundler(file, options);
// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

// Serve static files for heroku?
app.use(express.static("./html"));
app.use(express.static("./dist"));

// Export the server middleware
app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port https://localhost:${process.env.PORT}`)
);
