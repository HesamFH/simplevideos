const submitBtn = document.getElementById("submit-btn"),
  video = document.getElementById("video"),
  title = document.getElementById("title"),
  thumbnail = document.getElementById("thumbnail"),
  progressBar = document.getElementById("progressBar"),
  progressDiv = document.getElementById("progressDiv"),
  errorsDiv = document.getElementById("errors"),
  videoDesc = document.getElementById("videoDesc"),
  successDiv = document.getElementById("successDiv");

//! Uploads the video to the server
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!video.files[0]) {
    document.getElementById("no-video").innerText = "ویدیویی انتخاب نشده است";
  } else {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 201) {
          video.value = "";
          successDiv.style.display = "block";
          successDiv.innerHTML = JSON.parse(this.responseText).message;
        }
        if (this.status == 400) {
          const res = JSON.parse(this.responseText);
          showErrors(res.message);
        }
      }
    };

    xhttp.open("POST", "/users/uploadvideo");

    xhttp.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        let result = Math.round((e.loaded / e.total) * 100);

        if (result !== 100) {
          progressBar.innerHTML = result.toString() + "%";
          progressBar.style.width = result.toString() + "%";
          progressBar.setAttribute("aria-valuenow", result.toString());
        } else {
          progressDiv.style.display = "none";
        }
      }
    };

    let formData = new FormData();

    progressDiv.style.display = "block";
    formData.append("video", video.files[0]);
    formData.append("title", title.value);
    formData.append("thumbnail", thumbnail.files[0]);
    formData.append("description", videoDesc.value);

    xhttp.send(formData);
  }
});

//! If there is an error while uploading the video, this function renders the error
function showErrors(errors) {
  errors.forEach((err) => {
    const conDiv = document.createElement("div");
    const errorP = document.createElement("p");
    const closeBtn = document.createElement("button");
    const span = document.createElement("span");

    conDiv.className = "alert alert-danger alert-dismissible fade show";
    conDiv.setAttribute("role", "alert");

    errorP.innerHTML = err;

    closeBtn.setAttribute("type", "button");
    closeBtn.setAttribute("class", "close");
    closeBtn.setAttribute("data-dismiss", "alert");
    closeBtn.setAttribute("aria-label", "Close");

    span.setAttribute("aria-hidden", "true");
    span.innerHTML = "&times;";

    conDiv.appendChild(errorP);
    conDiv.appendChild(closeBtn);

    closeBtn.appendChild(span);

    errorsDiv.appendChild(conDiv);
  });
}

/*<div class="alert alert-danger alert-dismissible fade show" role="alert">
  <p><%= error %></p>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
*/
