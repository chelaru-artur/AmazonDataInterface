var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://104.131.139.167/AmazonScraper', function(err, db){
      if(err) throw err;
      console.log('\033[96m + \033[39m connected to mongodb');

      collection = db.collection('cosmetics');
      database = db;

    }
);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/postQuery',function(req,res){
  var query = req.body;

  collection.find(generateSearchQuery(query),{_id:0}).toArray(function(err,data){
      console.log(generateSearchQuery(query));
      console.log("Recieved: ", data.length," results");
      res.send(data);
      res.end();
  });

});

function generateSearchQuery(query){
    var generatedQuery = {};
    for (prop in query) {
        if (!query.hasOwnProperty(prop)) {
            //The current property is not a direct property of p
            continue;
        }

        if(query[prop] != null && (query[prop].length > 0 || query[prop] != 0 )){
            generatedQuery[prop]= query[prop];
            console.log(prop," : ", query[prop]);
        }
    }
    var searchQuery = {};

    if(generatedQuery.hasOwnProperty('searchText')){
        searchQuery["$text"] = {$search : generatedQuery["searchText"]};
        delete generatedQuery["searchQuery"];
    }
    // append other properties to search query

    for (prop in generatedQuery) {
        if (!generatedQuery.hasOwnProperty(prop)) {
            //The current property is not a direct property of p
            continue;
        }
        searchQuery[prop] = generatedQuery[prop];
    }

    return searchQuery;
}

router.get('/getTypes',function(req,res){
  collection.distinct('type',function(err,docs){
    res.send(docs);
  });
});

module.exports = router;
