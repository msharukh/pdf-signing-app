document.getElementById('upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('file-upload');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const data = await response.json();
        const signedPdfUrl = data.url;
        
        // Show the signed PDF link
        document.getElementById('signed-pdf-link').href = signedPdfUrl;
        document.getElementById('signed-pdf-container').classList.remove('hidden');
    } else {
        alert('Error uploading the PDF.');
    }
});
