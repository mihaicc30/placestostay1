function hideModal() {
    document.getElementById('mainModal').classList.remove("show")
    document.getElementById('mainModal').classList.add("hide")
    document.getElementById('subModal').classList.remove("show")
    document.getElementById('subModal').classList.add("hide")
}
function openAddMarkModal(lat, lon) {
        document.getElementById('mainModal').classList.remove("hide")
        document.getElementById('subModal').classList.remove("hide")
        document.getElementById('mainModal').classList.add("show")
        document.getElementById('subModal').classList.add("show")
        document.getElementById('modalCoords').innerText = lat + "," + lon
}
function showColorChange() {
    var borderColor = document.getElementById('circleColor').value
    var circleRadius = document.getElementById('circleRadius').value
    var fillColorOpacity = document.getElementById('circleOpacity').value
    var fillColor = document.getElementById('circleFillColor').value

    var colorReferance = document.getElementById('span').style

    colorReferance.border = `thick solid ${borderColor}`
    colorReferance.backgroundColor = fillColor;
    colorReferance.opacity = fillColorOpacity
    colorReferance.transform = `scale(${circleRadius / 40})`
}
function checkAndHideModal(e){
    // for ajax management calls   -> script_ajax_calls.js
    var currentTarget = e.target
    if(
        (String(currentTarget).startsWith("[object HTMLImageElement]") || String(currentTarget).startsWith("[object SVGPathElement]")) 
        && String(currentTarget.classList).startsWith("leaflet")
     ){
        if(document.querySelectorAll('#current_target').length > 0 ){
            var beforeTarget = document.getElementById('current_target')
            beforeTarget.removeAttribute("id")
        }
        currentTarget.setAttribute("id", "current_target")
    };
    //

    var modal =document.getElementById('mainModal').classList

    if(e.key == "Escape"){
        if( modal == "mainModal show"){
            hideModal()
        }
    }
    if(e.target.id == "mainModal"){
        hideModal()
    };

}
document.addEventListener("click", checkAndHideModal);
document.addEventListener("keydown", checkAndHideModal);
