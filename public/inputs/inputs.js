const imageInput = document.getElementById('images');
imageInput.addEventListener('change', loadImageOnChange);

async function loadImageOnChange(event) {
  const display = document.getElementById('displayed-images');
  const files = event.target.files;
  display.innerHTML = '';
  for (let i = 0; i < files.length; i++) {
    const image = document.createElement('img');
    image.src = URL.createObjectURL(files[i]);
    display.appendChild(image);
  }
}
