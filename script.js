import { createWorker } from 'tesseract.js';

let selectedFile = null;
let worker = null;

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

submitBtn.addEventListener("click", async function () {
  if (!selectedFile) {
    output.innerHTML = `<div class="empty-state processing"><p style="color: var(--color-text-primary);">Please select an image first</p></div>`;
    setTimeout(() => {
      output.classList.remove('processing');
    }, 2000);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
    Processing...
  `;
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressPercent.textContent = "0%";
  copyBtn.style.display = "none";

  output.innerHTML = `<div class="empty-state processing"><p style="color: var(--color-text-primary);">Processing your image...</p></div>`;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  if (!document.querySelector('style[data-animations]')) {
    style.setAttribute('data-animations', 'true');
    document.head.appendChild(style);
  }

  try {
    if (!worker) {
      worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            progressBar.style.width = progress + "%";
            progressPercent.textContent = progress + "%";
          }
        }
      });
    }

    const { data: { text } } = await worker.recognize(selectedFile);

    progressBar.style.width = "100%";
    progressPercent.textContent = "100%";

    if (text && text.trim()) {
      output.textContent = text;
      output.style.animation = 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      copyBtn.style.display = "flex";
    } else {
      output.innerHTML = `<div class="empty-state"><p style="color: var(--color-text-primary);">No text found in the image</p></div>`;
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Extract Text
    `;
    setTimeout(() => {
      progressContainer.style.display = "none";
    }, 1000);
  } catch (error) {
    output.innerHTML = `<div class="empty-state"><p style="color: var(--color-error);">Error: ${error.message}</p></div>`;
    progressBar.style.width = "0%";
    progressPercent.textContent = "0%";
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Extract Text
    `;
    progressContainer.style.display = "none";
  }
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
    copyBtn.style.background = 'var(--color-success)';
    copyBtn.style.color = 'white';
    copyBtn.style.borderColor = 'var(--color-success)';

    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.style.background = '';
      copyBtn.style.color = '';
      copyBtn.style.borderColor = '';
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      Failed
    `;
    copyBtn.style.background = 'var(--color-error)';
    copyBtn.style.color = 'white';
    copyBtn.style.borderColor = 'var(--color-error)';
    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.style.background = '';
      copyBtn.style.color = '';
      copyBtn.style.borderColor = '';
    }, 2000);
  }
});

toggleModeBtn.addEventListener("click", function () {
  const willBeDark = !document.body.classList.contains("dark-mode");

  if (willBeDark) {
    toggleModeBtn.classList.add("falling");
  } else {
    toggleModeBtn.classList.add("rising");
  }

  setTimeout(() => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
  }, 400);

  setTimeout(() => {
    toggleModeBtn.classList.remove("falling", "rising");
  }, 800);
});

const savedDarkMode = localStorage.getItem("darkMode");
if (savedDarkMode === "true") {
  document.body.classList.add("dark-mode");
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.upload-section, .results-section').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  observer.observe(el);
});

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
