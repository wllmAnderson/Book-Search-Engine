const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const graphqlHTTP = require("express-graphql")
const buildSchema = require("graphql")

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
var schema = buildSchema(`
  type Query {
    ip: String
  }
`)

const loggingMiddleware = (req, res, next) => {
  console.log("ip:", req.ip)
  next()
}

var root = {
  ip: function (args, request) {
    return request.ip
  },
}


app.use(loggingMiddleware)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at localhost:4000/graphql")

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

//





