let selectedFile = null;

// File input change handler
document.getElementById("imageInput").addEventListener("change", function (event) {
  selectedFile = event.target.files[0];
  if (selectedFile) {
    const uploadArea = document.getElementById("uploadArea");
    uploadArea.querySelector('h2').textContent = "Image Selected: " + selectedFile.name;
    uploadArea.style.borderColor = '#28a745';
    uploadArea.style.backgroundColor = '#d4edda';
  }
});

// Extract text button handler
document.getElementById("submitBtn").addEventListener("click", function () {
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;
      img.onload = function () {
        document.getElementById("output").textContent = "Processing image...";
        Tesseract.recognize(img.src, "eng", {
          logger: (info) => {
            console.log(info);
            if (info.status === "recognizing text") {
              const progress = Math.round(info.progress * 100);
              document.getElementById("progressBar").style.width = progress + "%";
            }
          },
        })
          .then(({ data: { text } }) => {
            document.getElementById("output").textContent = text || "No text found in the image.";
            document.getElementById("progressBar").style.width = "100%";
          })
          .catch((error) => {
            document.getElementById("output").textContent = "Error: " + error.message;
            document.getElementById("progressBar").style.width = "0%";
          });
      };
    };
    reader.readAsDataURL(selectedFile);
  } else {
    document.getElementById("output").textContent = "Please select an image first.";
  }
});

// Toggle Dark Mode
document.getElementById("toggleModeBtn").addEventListener("click", function () {
  const body = document.body;
  const modeIcon = document.getElementById("modeIcon");
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    modeIcon.textContent = "🌙"; // Moon icon for dark mode
  } else {
    modeIcon.textContent = "🌞"; // Sun icon for light mode
  }
});

// Copy Text Functionality
document.getElementById("copyBtn").addEventListener("click", function () {
  const outputText = document.getElementById("output").textContent;
  if (outputText.trim() !== "" && outputText !== "Your extracted text will appear here..." && outputText !== "Please select an image first." && outputText !== "Processing image...") {
    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy text: " + err);
      });
  } else {
    alert("No text to copy!");
  }
});

const uploadArea = document.getElementById("uploadArea");
const imageInput = document.getElementById("imageInput");

// Open file manager when the upload area is clicked
uploadArea.addEventListener("click", () => {
  imageInput.click();
});

// Highlight the upload area when a file is dragged over it
uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("dragover");
});

// Remove highlight when the file is dragged out
uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

// Handle file drop
uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadArea.classList.remove("dragover");

  const files = event.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    selectedFile = files[0];
    uploadArea.querySelector('h2').textContent = "Image Selected: " + selectedFile.name;
    uploadArea.style.borderColor = '#28a745';
    uploadArea.style.backgroundColor = '#d4edda';
  } else if (files.length > 0) {
    alert("Please drop an image file!");
  }
});
