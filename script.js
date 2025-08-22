 let selectedFile = null;

      document
        .getElementById("imageInput")
        .addEventListener("change", function (event) {
          selectedFile = event.target.files[0];
        });

      document
        .getElementById("submitBtn")
        .addEventListener("click", function () {
          if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
              const img = new Image();
              img.src = e.target.result;
              img.onload = function () {
                Tesseract.recognize(img.src, "eng", {
                  logger: (info) => {
                    console.log(info);
                    if (info.status === "recognizing text") {
                      const progress = Math.round(info.progress * 100);
                      document.getElementById("progressBar").style.width =
                        progress + "%";
                    }
                  },
                })
                  .then(({ data: { text } }) => {
                    document.getElementById("output").textContent = text;
                    document.getElementById("progressBar").style.width = "100%";
                  })
                  .catch((error) => {
                    document.getElementById("output").textContent =
                      "Error: " + error.message;
                  });
              };
            };
            reader.readAsDataURL(selectedFile);
          } else {
            document.getElementById("output").textContent =
              "Please select an image first.";
          }
        });

      // Toggle Dark Mode
      document
        .getElementById("toggleModeBtn")
        .addEventListener("click", function () {
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
        if (outputText.trim() !== "") {
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
        if (files.length > 0) {
          imageInput.files = files; // Assign dropped files to the input element
          const changeEvent = new Event("change");
          imageInput.dispatchEvent(changeEvent); // Trigger the change event
        }
      });
