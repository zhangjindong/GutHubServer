var express = require('express');
var Recipe = require('./../models/Recipe.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    //获取列表
    var search = {};
    var page = {
        limit: 15,
        num: 1
    };
    //查看哪页
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    if (req.query.jqName) {
        req.query.jqName != "" ? search['name'] = '' + req.query.jqName + '' : ''
    }
    if (req.query.mhName) {
        // 模糊匹配通过正则表达式实现，
        // 这里构建正则表达式只能通过new RegExp
        req.query.mhName != "" ? search['name'] = new RegExp(req.query.mhName) : ''
    }
    if (req.query.mhType) {
        req.query.mhType != "" ? search['mhType'] = req.query.mhType : ''
    }
    var model = {
        search: search,
        columns: 'id title description instructions',
        page: page
    };
    // console.log("---------- Recipe.findPagination");
    Recipe.findPagination(model, function (err, pageCount, list) {
        return res.json(list);
    });
});

router.get('/:id', function (req, res) {
    //根据ID获取数据
    Recipe.findById({
        id: req.body.id
    }, function (err, obj) {
        res.json(obj);
    });

}).post('/', function (req, res) {

    //新建
    if (req.body.id) { //update
        console.log("update");
    } else {
        Recipe.save(req.body, function (err) {
            if (err) {
                res.json({
                    'success': false,
                    'err': err
                });
            } else {
                var recipe = Recipe.findById(req.body)
                res.json(recipe);
            }
        });
    }
//    根据ID修改数据
}).put('/:id', postFunction).post('/:id', postFunction).delete('/:id', function (req, res) {
    //删除数据
    Recipe.removeById({
        id: req.param('id'),
    }, function (err) {
        if (err) {
            res.json({
                'success': false
            });
        } else {
            res.json({
                'success': true
            });
        }
    });
})
function postFunction(req, res) {
    // console.info('postFunction')
    //修改数据
    if (req.body._id) { //update

        Recipe.updateById(req.body, function (err) {
            if (err) {
                res.json({
                    'success': false,
                    'err': err
                });
            } else {
                var recipe = Recipe.findById({_id: req.body._id})
                res.json(recipe);

            }
        });
    }
}
module.exports = router;
