/** @format */

executeProcesses();

let slideIndex = [];
let slideId = [];
let slides = [];

async function executeProcesses() {
	const posts = await fillBlogList();
	let slide_num = 0;
	for (let i in posts)
		if (posts[i].filenames.length > 1) {
			slides.push(new Slideshow(slide_num));
			slide_num++;
		}
	initializeMarqueeScroll();
}

function initializeMarqueeScroll() {
	const tracks = document.querySelectorAll(".scroll-track");
	const speeds = Array.from(tracks).map(() => {
		const speed = Math.random() * 0.8 + 0.2;
		const direction = Math.random() < 0.5 ? 1 : -1;
		return speed * direction;
	});

	window.addEventListener("scroll", () => {
		const scrollY = window.scrollY;
		tracks.forEach((track, index) => {
			const speed = speeds[index];
			const offset = scrollY * speed;
			track.style.transform = `translateX(calc(-50% + ${-offset}px))`;
		});
	});

	tracks.forEach((track) => {
		const original = track.innerHTML;
		while (track.scrollWidth < window.innerWidth * tracks.length) {
			track.innerHTML += original;
		}
	});
}

function updateSlides(n, i) {
	// updates current index of slide in slideIndex[]
	if (n > 0) slides[i].next();
	else slides[i].prev();
}

async function fillBlogList() {
	const response = await fetch("/posts?type=Dandelion");
	const post_data = await response.json();
	console.log("post data:", post_data);

	let slide = 0;
	post_data.forEach((post, index) => {
		const paragraphs = post.description.split("\r\n\r\n");
		addPost(slide, index, post.title, post.artist, post.date, post.filenames, paragraphs);
		if (post.filenames.length > 1) slide++;
	});
	return post_data;
}

function addPost(slide, index, title, artist, date, filenames, paragraphs) {
	const list = document.getElementById("blog_list");
	// slideshow heavily inspired from:
	// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_slideshow_multiple

	// construct spacer band
	const band = document.createElement("div");
	band.className = "scroll-marquee";
	const track = document.createElement("div");
	track.className = "scroll-track";
	track.innerHTML = `
	<span>i created project dandelion to connect and inspire those who follow me on instagram. it is a way to make the
		app feel more personal, relatable, and true to myself.</span>
	`;
	band.appendChild(track);
	const clone = band.cloneNode(true);

	// construct image/slideshow
	let image_content = "";
	if (filenames.length > 1) {
		image_content += `<div class="slideshow-container">`;
		filenames.forEach((n) => {
			image_content += `<div class="slideshow${slide}" style="display: none">\n<img src="images/posts/${n}" alt="album cover or corresponding content" width="300px">\n</div>\n`;
		});
		image_content += `<a class="prev" onclick="updateSlides(-1, ${slide})">&#10094;</a>\n<a class="next" onclick="updateSlides(1, ${slide})">&#10095;</a>\n<div class="dots">\n`;
		filenames.forEach((n) => {
			image_content += `<span class="dot"></span>\n`;
		});
		image_content += "</div>\n</div>";
	} else if (filenames.length == 1)
		image_content += `<img src="images/posts/${filenames[0]}" alt="album cover" width="300px" />`;

	// construct description
	let description_content = "";
	paragraphs.forEach((p) => {
		description_content += `<p>\n${p}\n</p>\n`;
	});

	// construct combo of image and description
	let combo;
	if (index % 2 == 0)
		combo = `
    ${image_content}
    <div class="songdescription">
      ${description_content}
    </div>
  `;
	else
		combo = `
    <div class="songdescription">
      ${description_content}
    </div>
    ${image_content}
  `;

	const post = document.createElement("div");
	post.className = "blog_post";
	post.innerHTML = `
    <div class="blog_title">
      <div class="artist">
        <img
          src="images/music-note.png"
          alt="artist symbol"
          width="23"
          height="23"
        />
        <h3>${artist}</h3>
      </div>

      <h2>${title}</h2>
      <h3>${date}</h3>
    </div>

    <div class="combo">
      ${combo}
    </div>
  `;

	list.appendChild(band);
	list.appendChild(clone);
	list.appendChild(post);
}

class Slideshow {
	constructor(i) {
		this.index = i;
		this.slides = document.getElementsByClassName(`slideshow${i}`);
		this.dots = document.getElementsByClassName("dots")[i].children;
		this.max = this.dots.length - 1;
		this.current_slide = 0;
		this.changeSlide(0); // initialize active dot
	}

	next = () => this.changeSlide(1);

	prev = () => this.changeSlide(-1);

	changeSlide(n) {
		this.dots[this.current_slide].className = "dot";
		this.slides[this.current_slide].style.display = "none";
		this.current_slide += n;
		if (this.current_slide > this.max) this.current_slide = 0;
		if (this.current_slide < 0) this.current_slide = this.max;
		this.dots[this.current_slide].className = "dot dot-active";
		this.slides[this.current_slide].style.display = "block";
		// if (n > 0) console.log(`slide ${this.index} :: ${this.current_slide}`);
		// else console.log(`slide ${this.index} :: ${this.current_slide}`);
	}
}
