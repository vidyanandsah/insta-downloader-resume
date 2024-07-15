async function downloadInstagramContent() {
    const link = document.getElementById('link').value;
    if (!link) {
        alert('Please provide a link.');
        return;
    }

    try {
        const response = await fetch('/download-instagram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ link })
        });

        if (!response.ok) {
            const data = await response.json();
            alert('Error: ' + data.error);
            return;
        }

        const contentType = response.headers.get('Content-Type');
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'instagram_content';

        if (contentDisposition && contentDisposition.includes('attachment')) {
            const matches = /filename="(.+?)"/.exec(contentDisposition);
            if (matches && matches[1]) {
                filename = matches[1];
            }
        }

        if (contentType.includes('video/mp4')) {
            filename += '.mp4';
        } else if (contentType.includes('image/jpg')) {
            filename += '.jpg';
        } else if (contentType.includes('application/zip')) {
            filename += '.zip';
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred: ' + error.message);
    }
}
