function deleteField(e) {
  const fieldContainer = document.querySelectorAll(".schedule-item")
  if(fieldContainer.length > 1){
    e.closest(".schedule-item").remove()
  }
}