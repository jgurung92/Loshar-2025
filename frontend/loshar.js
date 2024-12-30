// script.js
const form = document.getElementById('applicationForm');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const category = document.getElementById('category').value;
  const names = document.getElementById('names').value.split(',').map(name => name.trim());
  const mediaFile = document.getElementById('mediaUpload').files[0];
  const mediaLink = document.getElementById('mediaLink').value;

  // Validate names count
  if (names.length > 10) {
    responseMessage.textContent = "You can only add up to 10 names.";
    return;
  }

  // Create form data for media upload
  const formData = new FormData();
  formData.append('category', category);
  formData.append('names', JSON.stringify(names));
  if (mediaFile) formData.append('media', mediaFile);
  if (mediaLink) formData.append('mediaLink', mediaLink);

  // Send data to the backend
  try {
    const response = await fetch('http://localhost:3000/apply', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      responseMessage.textContent = "Application submitted successfully!";
      form.reset();
    } else {
      responseMessage.textContent = result.message || "Something went wrong!";
    }
  } catch (error) {
    responseMessage.textContent = "Error submitting the form.";
  }
});
