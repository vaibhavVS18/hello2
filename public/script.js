const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultText = document.getElementById("result");

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Webcam access denied", err));

async function captureAndScan() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/png"); // Convert to base64

    const response = await fetch("/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image })
    });

    const { text, foundNumber } = await response.json();
    resultText.innerText = foundNumber ? `Found: ${foundNumber}` : `Scanning...\n${text}`;

    if (!foundNumber) {
        setTimeout(captureAndScan, 1000); // Continue scanning every second
    } else {
        video.srcObject.getTracks().forEach(track => track.stop()); // Stop webcam
    }
}

video.addEventListener("playing", () => captureAndScan());
