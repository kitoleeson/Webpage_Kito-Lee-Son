const list = document.getElementById('blog_list');

fillBlogList();

async function fillBlogList() {
  const response = await fetch('/posts?type=Blog');
  const post_data = await response.json();
  console.log(post_data);

  post_data.forEach((post) => {
    const paragraphs = post.post.split('\n\n');
    addPost(post.title, post.location, post.date, paragraphs);
  });
}

function addPost(title, location, date, paragraphs) {
  let content = '';
  paragraphs.forEach((p) => {
    content += `<p>\n${p}\n</p>\n`;
  });

  const post = document.createElement('div');
  post.className = 'blog_post';
  post.innerHTML = `
    <div class="blog_title">
        <div class="location">
        <img
            src="images/location-pin.png"
            alt="location pin symbol"
            width="30"
            height="30"
        />
        <h3>${location}</h3>
        </div>

        <h2>${title}</h2>
        <h3>${date}</h3>
    </div>

    ${content}
  `;

  list.appendChild(post);
}
