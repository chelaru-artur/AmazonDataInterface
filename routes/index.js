var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://104.131.139.167/AmazonScraper', function(err, db) {
    if (err) throw err;
    console.log('\033[96m + \033[39m connected to mongodb');

    collection = db.collection('cosmetics');
    database = db;

});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

router.post('/postQuery', function(req, res) {
    var reqObj = req.body;
    var query = reqObj['query'];
    var sortBy = reqObj['sortBy'];
    console.log(generateSearchQuery(query));

    var cursor =   collection.find(generateSearchQuery(query), {
        _id: 0
    }).limit(1000);

    if(sortBy['sortBy'] != "" ){
        var obj = {};
        obj[sortBy['sortBy']] = parseInt(sortBy['sortOrder']);
        cursor = cursor.sort(obj);
    }

    cursor.toArray(function(err, data) {
            console.log("Recieved: ", data.length, " results");
            res.send(data);
            res.end();
        });

});

function generateSearchQuery(query) {
    var generatedQuery = {};
    // leave only properties that are not empty
    for (prop in query) {
        if (!query.hasOwnProperty(prop)) {
            //The current property is not a direct property of p
            continue;
        }

        if (query[prop] != null && (query[prop].length > 0 || query[prop] != 0)) {
            generatedQuery[prop] = query[prop];
        }
    }
    var searchQuery = {};
    /// add specific fields
    if (generatedQuery.hasOwnProperty('searchText')) {
        searchQuery["$text"] = {
            $search: generatedQuery["searchText"]
        };
    }

    if (generatedQuery.hasOwnProperty('type')) {

        searchQuery["type"] = generatedQuery["type"];
    }

    if (generatedQuery.hasOwnProperty('priceOperand')) {
        if (generatedQuery["priceOperand"] == "between") {
            searchQuery["price"] = {
                '$gt': generatedQuery["price"][0],
                '$lt': generatedQuery["price"][1]
            };
        } else {
            var op = convertToMongoOperators(generatedQuery["priceOperand"]);
            var obj = {};
            obj[op] = generatedQuery["price"];
            searchQuery["price"] = obj;
        }
    }

    if (generatedQuery.hasOwnProperty('ratingOperand')) {
        if (generatedQuery["ratingOperand"] == "between") {
            searchQuery["rating"] = {
                '$gt': generatedQuery["rating"][0],
                '$lt': generatedQuery["rating"][1]
            };
        } else {
            var op = convertToMongoOperators(generatedQuery["ratingOperand"]);
            var obj = {};
            obj[op] = generatedQuery["rating"];
            searchQuery["rating"] = obj;
        }
    }



    return searchQuery;
}

function convertToMongoOperators(operand) {
    switch (operand) {
        case '=':
            return '$eq';
        case '>':
            return '$gt';
        case '<':
            return '$lt';
        case '<=':
            return '$lte';
        case '>=':
            return '$gte';
    }
}

router.get('/getTypes', function(req, res) {
    collection.distinct('type', function(err, docs) {
        res.send(docs);
    });
});

module.exports = router;