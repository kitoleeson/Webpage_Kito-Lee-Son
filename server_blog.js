// add new dandelion/blog post to database
function new_post(request, response, options) {
  const data = request.body;
  data.type = data.location ? 'Blog' : 'Dandelion';

  console.log(options.ch.magentaBright(`>> New Post Request :: ${data.type}`));

  data.filenames = options.filenames;
  data.timestamp = Date.now();
  options.db.insert(data);
  data.status = 'in database';
  data.date = data.date.replaceAll('-', '.');
  console.log(data);
  if (data.type == 'Blog') response.redirect('/trinidad_blog');
  else response.redirect('/project_dandelion');
}

// read dandelion/blog posts from database
function get_post(request, response, options) {
  const type = request.query.type;

  console.log(options.ch.magentaBright(`>> New Page Request :: ${type}`));

  options.db.find({ type: type }, (error, data) => {
    if (error) {
      response.end();
      return;
    }

    if (type == 'Blog') options.st(data, { by: 'date', order: 'asc' });
    else options.st(data, { by: 'date', order: 'desc' });
    response.json(data);
  });
}

module.exports = { new_post, get_post };
