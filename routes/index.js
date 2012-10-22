
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log("index controller");
  res.render('index', { title: 'Express' });
};
