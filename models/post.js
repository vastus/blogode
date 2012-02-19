var nano = require('nano')('http://veto:lamourettes@vastus.iriscouch.com/');

db = nano.use('mydb');

function find(id, post) {
  db.get(id, function(err, data) {
    if (err) { throw err; }
    if (typeof data === 'object') {
      return data;
    } else {
      console.log("Something went wrong when getting data.");
      return;
    }
  });
}

module.exports.find = find;
