// add new coordinates to database
function post_coords(request, response, options) {
  console.log(options.ch.magenta(`>> New Post Request :: Location`));

  const data = request.body;
  data.timestamp = Date.now();

  options.db.insert(data);
  data.status = 'in database';
  response.json(data);
}

// read all coordinates in database
function get_coords(request, response, options) {
  console.log(options.ch.magenta('>> New Page Request :: Location'));
  // empty object argument searches for everything
  options.db.find({}, (error, data) => {
    if (error) {
      response.end();
      return;
    }
    response.json(data);
  });
}

module.exports = { post_coords, get_coords };
