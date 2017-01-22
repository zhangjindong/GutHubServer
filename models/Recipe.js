var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var RecipeSchema;
RecipeSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    publish: Date,
    create_date: {
        type: Date,
        default: Date.now
    },
    ingredients: [{
        amount: String,
        amountUnits: String,
        ingredientName: String,
    }],
    instructions: String
});
var Recipe = mongodb.mongoose.model("Recipe", RecipeSchema);
var RecipeDAO = function () {
};
module.exports = new RecipeDAO();

RecipeDAO.prototype.save = function (obj, callback) {

    var instance = new Recipe(obj);
    instance.save(function (err) {
        callback(err);
    });
};
RecipeDAO.prototype.findById = function (query, callback) {
    Recipe.findOne(query, function (err, obj) {
        callback(err, obj);
    });
};

RecipeDAO.prototype.removeById = function (query, callback) {
    Recipe.remove(query, function (err, obj) {
        callback(err);
    });
};
RecipeDAO.prototype.updateById = function (obj, callback) {
    var objC = Object.assign({}, obj);
    var _id = objC._id;
    delete objC._id;
    Recipe.update({_id: _id}, objC, function (err) {
        callback(err)
    })
    // console.info(obj);
    // var objSet = {
    //     $set: []
    // };
    // for (var key in obj) {
    //     objSet.$set.push({
    //         key: obj[key]
    //     })
    // }
    // console.info(objSet);
    // Recipe.update({
    //     _id: _id
    // }, {
    //     $set: {
    //         name: 'MDragon'
    //     }
    // }, function(err) {});
};
//代码片段
// limit:5，每页限制5条记录
// num:1，查询的页面
// pageCount，一共有多少页
// size，当前页面有多少条记录
// numberOf，分页用几个标签显示
RecipeDAO.prototype.findPagination = function (obj, callback) {
    var q = obj.search || {};
    var col = obj.columns;

    var pageNumber = obj.page.num || 1;
    var resultsPerPage = obj.page.limit || 10;

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    // console.info(q);
    var query = Recipe.find(q, col).sort('create_date').skip(skipFrom).limit(resultsPerPage);

    query.exec(function (error, results) {
        if (error) {
            callback(error, null, null);
        } else {
            Recipe.count(q, function (error, count) {
                // console.log('----count begin');
                // console.log(count);
                // console.info(results);

                if (error) {
                    callback(error, null, null);
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, pageCount, results);
                }
            });
        }
    });
};