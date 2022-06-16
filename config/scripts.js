function hideModal() {
    document.getElementById('mainModal').classList.remove("show")
    document.getElementById('subModal').classList.remove("show")
    document.getElementById('mainModal').classList.add("hide")
    document.getElementById('subModal').classList.add("hide")
}
function openAddMarkModal(lat, lon) {
    document.getElementById('mainModal').classList.remove("hide")
    document.getElementById('subModal').classList.remove("hide")
    document.getElementById('mainModal').classList.add("show")
    document.getElementById('subModal').classList.add("show")

    document.getElementById('modalCoords').innerText = lat + "," + lon
    console.log(lat, lon);
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