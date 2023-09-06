document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportForm");
  const reportList = document.getElementById("reportList");
  const confirmSubmit = document.getElementById("confirmSubmit");
  const emailInput = document.getElementById("email");
  const scratchImages = document.getElementById("scratchImages");
  const fuelKilometers = document.getElementById("fuelKilometers");
  const fuelPicture = document.getElementById("fuelPicture");
  const kilometersInput = document.getElementById("kilometersInput");
  const availableKilometers = document.getElementById("availableKilometers");
  const pictureInput = document.getElementById("pictureInput");
  const fuelLevelPicture = document.getElementById("fuelLevelPicture");
  const imageContainer = document.getElementById("imageContainer");
  const canvasElement = document.getElementById("canvasElement");
  const videoElement = document.createElement("video");
  const takePictureButton = document.getElementById("takePicture");
  const selectPictureButton = document.getElementById("selectPicture");
  const pictureButtonsContainer = document.getElementById(
    "pictureButtonsContainer"
  );
  const sendEmailButton = document.getElementById("sendEmail");
  const generatePDFButton = document.getElementById("generatePDFButton");

  // Toggle display of fuel input options based on radio button selection
  fuelKilometers.addEventListener("change", () => {
    if (fuelKilometers.checked) {
      kilometersInput.style.display = "block";
      pictureInput.style.display = "none"; // Hide the picture buttons container
    }
  });

  fuelPicture.addEventListener("change", () => {
    if (fuelPicture.checked) {
      kilometersInput.style.display = "none";
      pictureInput.style.display = "block"; // Show the picture buttons container
    }
  });

  takePictureButton.addEventListener("click", async () => {
    try {
      // Access the device camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Assign the camera stream to the video element
      videoElement.srcObject = stream;
      videoElement.play();

      // Wait for a moment to ensure the camera is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set the canvas dimensions to match the video stream
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Draw the current frame from the video stream onto the canvas
      const canvasContext = canvasElement.getContext("2d");
      canvasContext.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Stop the camera stream
      stream.getTracks().forEach((track) => track.stop());

      // Convert the captured image on the canvas to a data URL
      const imageDataURL = canvasElement.toDataURL("image/jpeg"); // You can change the format if needed

      // Use the imageDataURL as the image source
      const img = document.createElement("img");
      img.src = imageDataURL;
      img.alt = "Captured Scratch Image";
      img.classList.add("scratch-image"); // Add a class for styling

      // Append the captured image to the image container
      imageContainer.appendChild(img);

      // Show the "Send Email" button
      sendEmailButton.style.display = "block";

      // Hide the picture buttons container
      pictureButtonsContainer.style.display = "none";
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  });

  selectPictureButton.addEventListener("click", () => {
    // Trigger the file input click event when "Επιλογή Φωτογραφίας" is clicked
    fuelLevelPicture.click();
  });

  scratchImages.addEventListener("change", () => {
    // Handle selected scratch images
    const selectedImages = scratchImages.files;

    if (selectedImages.length > 0) {
      // Clear any previously displayed images
      imageContainer.innerHTML = "";

      // Loop through selected images and display them
      for (const image of selectedImages) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(image);
        img.alt = "Scratch Image";
        img.classList.add("scratch-image"); // Add a class for styling

        // Append the image to the image container
        imageContainer.appendChild(img);
      }

      // Show the "Send Email" button
      sendEmailButton.style.display = "block";
    }
  });

  confirmSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission for now

    // Collect form data
    const userName = document.getElementById("userName").value;
    const rentalDate = document.getElementById("rentalDate").value;
    const returnDate = document.getElementById("returnDate").value;
    const email = emailInput.value;

    // Add logic to handle user's choice (captured picture or selected images)
    let fuelInfo;
    if (takePictureButton.style.display === "block") {
      // The user chose to capture a picture
      // Implement logic to handle the captured picture
      fuelInfo = `Φωτογραφία Επιπέδου Καυσίμου (Captured): [URL_TO_IMAGE]`;
    } else {
      // The user chose to select images from local storage
      // Implement logic to handle the selected images (scratchImages.files)
      fuelInfo = `Φωτογραφία Επιπέδου Καυσίμου (Selected): [URL_TO_IMAGE]`;
    }

    // Create the report and show it
    createReport(userName, rentalDate, returnDate, fuelInfo);
    // Show the "Send Email" button
    sendEmailButton.style.display = "block";
  });

  function createReport(userName, rentalDate, returnDate, fuelInfo) {
    // Create a new report element
    const reportElement = document.createElement("div");
    reportElement.classList.add("report");

    // Create an element to display the user's name and other information
    const userInfo = document.createElement("p");
    userInfo.textContent = `Όνομα Χρήστη: ${userName}, Ημερομηνία Ενοικίασης: ${rentalDate}, Ημερομηνία Επιστροφής: ${returnDate}, ${fuelInfo}`;

    // Append the user info to the report element
    reportElement.appendChild(userInfo);

    // Add the report to the reportList
    reportList.appendChild(reportElement);
  }

  // Function to handle sending the email (to be implemented)
  function sendReportEmail() {
    const recipientEmail = emailInput.value;
    const reportContent = reportList.innerHTML;

    // Implement email sending logic (replace with actual code)
    if (recipientEmail && reportContent) {
      // Example: Send the email
      alert(
        `Email sent to ${recipientEmail} with the report:\n\n${reportContent}`
      );
    } else {
      alert(
        "Please enter a valid email address and ensure a report is generated."
      );
    }
  }

  // Attach an event listener to the "Send Email" button
  sendEmailButton.addEventListener("click", sendReportEmail);

  // Function to generate the PDF report
  function generatePDF() {
    const pdfOptions = {
      margin: 10, // Adjust the margin as needed
      filename: "report.pdf", // Specify the PDF filename
      image: { type: "jpeg", quality: 0.98 }, // Image format and quality
      html2canvas: { scale: 2 }, // Scale for rendering
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" } // PDF format and orientation
    };

    html2pdf()
      .from(reportList) // Change to the element containing your report data
      .set(pdfOptions)
      .outputPdf((pdf) => {
        // To send the PDF as an email attachment, you need to implement backend logic
        // Here, you can open the PDF in a new window for testing purposes
        // Create a Blob containing the PDF data
        const pdfBlob = pdf.output("blob");

        // Create a URL for the Blob
        const pdfURL = URL.createObjectURL(pdfBlob);

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.textContent = "Download PDF";
        downloadLink.href = pdfURL;
        downloadLink.download = "report.pdf"; // Set the desired file name

        document.body.appendChild(downloadLink);
      });
  }

  // Attach an event listener to the "Generate PDF" button
  generatePDFButton.addEventListener("click", generatePDF);
});
