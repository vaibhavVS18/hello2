let currentRollNo;              // making it globally to be used in submitDestination fn.(in script.js)
function openPopup(rollNo) {
    currentRollNo = rollNo;
    // document.getElementById('dest').textContent = "block";
    document.getElementById('topPopup').style.display = "block";
  }

function closePopup() {
    document.getElementById('topPopup').style.display = "none";
  }


// function dataURItoBlob(dataURI) {
//     const byteString = atob(dataURI.split(',')[1]);
//     const arrayBuffer = new ArrayBuffer(byteString.length);
//     const uintArray = new Uint8Array(arrayBuffer);
//     for (let i = 0; i < byteString.length; i++) {
//         uintArray[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([arrayBuffer], { type: 'image/jpeg' });
// }

async function submitDestination() {
    // closePopup();
    let destination = document.getElementById("destination").value;
    // let otherDestination = document.getElementById("otherDestination").value;
    // let finalDestination = destination === "Other" ? otherDestination : destination;
    try {
        let entry =await fetch("/camera", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roll_no: currentRollNo, destination: destination })
        });

        window.location.href = '/camera';

    } catch (error) {
        console.error("Error:", error);
    }
}
async function setupWebcam() {
    const video = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block';  // Show video when scanning starts
}

function captureFrame() {
    const video = document.getElementById('webcam');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
}


async function startScanning() {
    document.getElementById('result').textContent = 'Scanning for Roll No...';

    if (!document.getElementById('webcam').srcObject) {
        await setupWebcam();
    }

    scannerInterval = setInterval(async () => {
        const capturedImage = captureFrame(); // Gets Base64 image directly

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: capturedImage })  // ✅ Send Base64 directly
            });

            const result = await response.text();
            document.getElementById('result').textContent = result;

            if (result.includes('Roll No found')) {
                clearInterval(scannerInterval);

                const rollNo = Number(result.slice(-5));
                const putResponse = await fetch('/camera', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roll_no: rollNo }),
                });

                let entryResponse = await putResponse.json();

                if (entryResponse.requireDestination) {
                    openPopup(rollNo); // Show popup if destination is needed
                } else if (putResponse.ok) {
                    if (entryResponse.message === "Entry already exists") {
                        document.getElementById("result").textContent = "Entry already exists for this roll no.";
                        window.location.href = '/camera';
                    }
                }
            }
        } 
        catch (error) {
            document.getElementById('result').textContent = 'Error: ' + error.message;
        }
    }, 1400);
}



// // let scannerInterval;
// async function startScanning() {
//     document.getElementById('result').textContent = 'Scanning for Roll No...';

//     if (!document.getElementById('webcam').srcObject) {
//         await setupWebcam();
//     }

//     let scannerInterval = setInterval(async () => {
//         const capturedImage = captureFrame();


//         const formData = new FormData();
//         formData.append('image', dataURItoBlob(capturedImage));

        
//         try {
//             const response = await fetch('/upload', {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.text();
//             document.getElementById('result').textContent = result;

//             if (result.includes('Roll No found')) {
//                 clearInterval(scannerInterval);


//             }

//         } catch (error) {
//             document.getElementById('result').textContent = 'Error: ' + error.message;
//         }
//     }, 5000);
// }


// const axios = require('axios');
// const FormData = require('form-data');

// // Load environment variables
// require('dotenv').config();

// const apiKey = process.env.OCR_API_KEY;
// const apiUrl = process.env.OCR_API_URL;

// const processImage = async (imageBuffer, fileExtension) => {
//   try {
//     // Create form data for the OCR API
//     const formData = new FormData();
//     formData.append('apikey', apiKey);
//     formData.append('file', imageBuffer, `image${fileExtension}`);

//     // Send image to OCR API
//     const response = await axios.post(apiUrl, formData, {
//       headers: formData.getHeaders(),
//     });

//     const result = response.data;

//     // Handle OCR API response
//     if (result.IsErroredOnProcessing) {
//       throw new Error(result.ErrorMessage.join(' '));
//     }

//     return result.ParsedResults[0].ParsedText;
//   } 
//   catch (error) {
//     console.error('OCR Error:', error.message);
//     throw error;
//   }
// };


// async function startScanning() {
//     document.getElementById('result').textContent = 'Scanning for Roll No...';

//     if (!document.getElementById('webcam').srcObject) {
//         await setupWebcam();
//     }

//     let scannerInterval = setInterval(async () => {
//         const capturedImage = captureFrame();
//         const imageBlob = dataURItoBlob(capturedImage);
//         const fileReader = new FileReader();

//         fileReader.readAsArrayBuffer(imageBlob);
//         fileReader.onloadend = async () => {
//             try {
//                 const imageBuffer = new Uint8Array(fileReader.result); // Use Uint8Array instead of Buffer
//                 const extractedText = await processImage(imageBuffer, '.jpg');

//                 console.log(extractedText);
//                 // Extract roll number from OCR result
//                 const lines = extractedText.split('\n');
//                 const cleanedLines = lines.map(line => line.replace('\r', ''));
//                 const output = cleanedLines.find(line => line.length === 5 && line.startsWith('2'));

//                 if (output) {
//                     clearInterval(scannerInterval);
//                     document.getElementById('result').textContent = `Roll no. Found: ${output}`;
//                 } else {
//                     document.getElementById('result').textContent = `!! Roll no. not found..`;
//                 }

//             } catch (error) {
                
//                 document.getElementById('result').textContent = 'Error: ' + error.message;
//             }
//         };
//     }, 5000);
// }
