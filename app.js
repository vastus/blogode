var express = require('express'),
        app = express.createServer(),
       nano = require('nano')('http://testos:secretos@vastus.iriscouch.com/'),
         db = nano.use('mydb');

// configuration
app.configure(function() {
	app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser()); // form parsing
  app.use(express.methodOverride()); // for restful actions overriding post to put in update etc..
});

app.configure('development', function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.get('/', function(req, res) {
  res.render('index.jade');
});

// posts
app.get('/posts/:id', function(req, res) {
  db.get(req.params.id, function(err, data) {
    if (err) {
      console.log("ERRORS: ", err);
      res.render('shared/404.jade', { title: "404 Not found" });
    }
    post = data
    res.render('posts/show.jade', { title: post.title, post: post });
  });
});

app.get('/posts/new', function(req, res) {
  res.render('posts/new.jade');
});

app.post('/posts', function(req, res) {
  console.log(req.body.post);
});

app.listen(3000);

