// async function submitDestination() {
//     // closePopup();
//     let destination = document.getElementById("destination").value;
//     // let otherDestination = document.getElementById("otherDestination").value;
//     // let finalDestination = destination === "Other" ? otherDestination : destination;
//     try {
//         let entry =await fetch("/camera", {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ roll_no: currentRollNo, destination: destination })
//         });

//         window.location.href = '/camera';

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }



// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()