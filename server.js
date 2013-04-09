var Percolator = require('Percolator').Percolator;

var config = {
  staticDir : __dirname + '/angularjs',
  resourcePath : 'api'
};


var todoDB = ["build a nice api"];


var root = {
    GET : function(req, res){
      res.object({"hello" : "api"})
        .link('browser', req.uri.child('browser'))
        .link('todolist', req.uri.child('todolist'))
        .send();
    }
};

var todolist = {
    GET : function(req, res){
      res.collection(todoDB)
        .link("upsert", req.uri, {method : "PUT", schema : {}})
        .send();
    },
    PUT : function(req, res){
      req.onJson(function(err, obj){
        todoDB = obj._items;
        res.collection(todoDB)
          .link("upsert", req.uri, {method : "PUT", schema : {}})
          .send();
      });
    }
};


var server = new Percolator(config);
server.listen(function(err){
  server.route('/api', root);
  server.route('/api/todolist', todolist);
  console.log('server is listening on port ', server.port);
});

