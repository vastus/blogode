var express = require('express'),
        app = express.createServer(),
    request = require('request'),
       nano = require('nano')('http://testos:secretos@vastus.iriscouch.com/'),
         db = nano.use('mydb');

// configuration
app.configure(function() {
	app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser()); // form parsing
  app.use(express.methodOverride()); // for restful actions overriding post to put in update etc..
});

// development
app.configure('development', function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.get('/', function(req, res) {
  db.list({include_docs: true}, function(err, data) {
    res.render('index.jade', {
      title: "hah",
      posts: data.rows
    });
  });
  // res.render('index.jade', { 
  //   title: "Express.js tryout",
  //   posts: posts
  // });
});

app.get('/posts/new', function(req, res) {
  request.get({url: 'http://testos:secretos@vastus.iriscouch.com/mydb', json: true}, function(err, response, body) {
    if (err) throw err;

    res.render('posts/new.jade', { 
      title: "Express.js tryout || Write a new post",
      post: { id: (body.doc_count + 1) }
    });
  });
});

app.post('/posts', function(req, res) {
  post = req.body.post;
  db.insert(post, post.id, function(err, body, headers) {
    if (err) {
      console.log("Something went wrong. Error: " + err);
      res.render('posts/new.jade', { 
        title: "Express.js tryout || Write a new post", 
        post: post 
      });
    }

    res.redirect('/posts/' + post.id, {
      title: post.title,
      post: post
    });
  });
});

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

app.listen(3000);

