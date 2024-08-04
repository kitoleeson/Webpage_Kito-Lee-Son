const sb = require('./server_blog');
const sc = require('./server_coords');

const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');
const multer = require('multer');
const sort = require('sort-array');
const chalk = require('chalk');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();
initializeApp(app);

/* COORDINATE DATABASE API */
const coordinate_base = new Datastore('coord_data.db');
coordinate_base.loadDatabase();
const coord_args = {
  ch: chalk,
  db: coordinate_base,
  st: sort,
};

app.post('/coords', (request, response) => {
  sc.post_coords(request, response, coord_args);
}); // add new coordinates
app.get('/coords', (request, response) => {
  sc.get_coords(request, response, coord_args);
}); // get all coordinates

/* BLOG DATABASE API */
const blog_base = new Datastore('blogs_data.db');
blog_base.loadDatabase();
const blog_args = {
  ch: chalk,
  db: blog_base,
  st: sort,
};

let post_count = 0;
app.post('/new_post', (request, response) => {
  let filenames = [];
  const data = request.body;
  data.type = data.location ? 'Blog' : 'Dandelion';

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (data.type == 'Blog')
        cb(null, path.join(__dirname, '/public/trinidad_blog/images/posts'));
      else
        cb(
          null,
          path.join(__dirname, '/public/project_dandelion/images/posts')
        );
    },
    filename: function (req, file, cb) {
      req.body.date = req.body.date.replaceAll('-', '.');
      const name = `${req.body.date}_${post_count}-${filenames.length}.jpg`;
      filenames.push(name);
      cb(null, name);
    },
  });
  const upload = multer({ storage: storage });

  upload.array('images')(request, response, (error) => {
    if (error) return response.status(500).json(error);
    blog_args.filenames = filenames;
    sb.new_post(request, response, blog_args);
    post_count++;
  });
}); // add new post
app.get('/posts', (request, response) => {
  sb.get_post(request, response, blog_args);
}); // get all posts

// make a "my community" page where people can talk amongst themselves
// and it will have a map which plots every place someone has accessed the website

// fix the server for the blog posts

function initializeApp(app) {
  app.listen(port, () =>
    console.log(chalk.green.bold(`>> Listening at ${port}`))
  );
  app.use(express.static('public'));
  app.use(cors()); // allow incoming requests from any IP
  app.use(express.json({ limit: '1mb' }));
}
