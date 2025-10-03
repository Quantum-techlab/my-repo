let selectedFile = null;

const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");
const previewContainer = document.getElementById("previewContainer");
const imagePreview = document.getElementById("imagePreview");
const removeImageBtn = document.getElementById("removeImage");
const submitBtn = document.getElementById("submitBtn");
const copyBtn = document.getElementById("copyBtn");
const output = document.getElementById("output");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const toggleModeBtn = document.getElementById("toggleModeBtn");

function showImagePreview(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    imagePreview.src = e.target.result;
    previewContainer.style.display = "block";
    uploadArea.style.display = "none";
  };
  reader.readAsDataURL(file);
}

function resetUploadArea() {
  selectedFile = null;
  previewContainer.style.display = "none";
  uploadArea.style.display = "block";
  imagePreview.src = "";
  progressContainer.style.display = "none";
  progressBar.style.width = "0%";
  progressPercent.textContent = "0%";
}

function showEmptyState() {
  output.innerHTML = `
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <p>Your extracted text will appear here</p>
    </div>
  `;
  copyBtn.style.display = "none";
}

imageInput.addEventListener("change", function (event) {
  selectedFile = event.target.files[0];
  if (selectedFile) {
    showImagePreview(selectedFile);
  }
});

removeImageBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  resetUploadArea();
  imageInput.value = "";
});

uploadArea.addEventListener("click", () => {
  imageInput.click();
});

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadArea.classList.remove("dragover");

  const files = event.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith("image/")) {
    selectedFile = files[0];
    imageInput.files = files;
    showImagePreview(selectedFile);
  }
});

submitBtn.addEventListener("click", function () {
  if (!selectedFile) {
    output.innerHTML = `<div class="empty-state"><p style="color: var(--color-text-primary);">Please select an image first</p></div>`;
    return;
  }

  submitBtn.disabled = true;
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressPercent.textContent = "0%";
  copyBtn.style.display = "none";

  output.innerHTML = `<div class="empty-state"><p style="color: var(--color-text-primary);">Processing your image...</p></div>`;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      Tesseract.recognize(img.src, "eng", {
        logger: (info) => {
          if (info.status === "recognizing text") {
            const progress = Math.round(info.progress * 100);
            progressBar.style.width = progress + "%";
            progressPercent.textContent = progress + "%";
          }
        },
      })
        .then(({ data: { text } }) => {
          progressBar.style.width = "100%";
          progressPercent.textContent = "100%";

          if (text && text.trim()) {
            output.textContent = text;
            copyBtn.style.display = "flex";
          } else {
            output.innerHTML = `<div class="empty-state"><p style="color: var(--color-text-primary);">No text found in the image</p></div>`;
          }

          submitBtn.disabled = false;
          setTimeout(() => {
            progressContainer.style.display = "none";
          }, 1000);
        })
        .catch((error) => {
          output.innerHTML = `<div class="empty-state"><p style="color: #ef4444;">Error: ${error.message}</p></div>`;
          progressBar.style.width = "0%";
          progressPercent.textContent = "0%";
          submitBtn.disabled = false;
          progressContainer.style.display = "none";
        });
    };
  };
  reader.readAsDataURL(selectedFile);
});

copyBtn.addEventListener("click", async function () {
  const text = output.textContent;

  try {
    await navigator.clipboard.writeText(text);

    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;

    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
});

toggleModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
});

const savedDarkMode = localStorage.getItem("darkMode");
if (savedDarkMode === "true") {
  document.body.classList.add("dark-mode");
}
