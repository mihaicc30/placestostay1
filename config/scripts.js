function hideOrShowModalElements(){
    if(document.getElementById('modalTypeMenu').value == "marker"){
        document.getElementById('modalIcon').classList.remove("hideMe")
        document.getElementById('circleColor').classList.add("hideMe")
        document.getElementById('circleFillColor').classList.add("hideMe")
        document.getElementById('circleOpacity').classList.add("hideMe")
        document.getElementById('circleRadius').classList.add("hideMe")
    }
    if(document.getElementById('modalTypeMenu').value == "circle"){
        document.getElementById('modalIcon').classList.add("hideMe")
        document.getElementById('circleColor').classList.remove("hideMe")
        document.getElementById('circleFillColor').classList.remove("hideMe")
        document.getElementById('circleOpacity').classList.remove("hideMe")
        document.getElementById('circleRadius').classList.remove("hideMe")
    }
} 
function hideModal() {
    document.getElementById('mainModal').classList.remove("showMe")
    document.getElementById('mainModal').classList.add("hideMe")
    document.getElementById('subModal').classList.remove("showMe")
    document.getElementById('subModal').classList.add("hideMe")
}
function openAddMarkModal(lat, lon) {
        document.getElementById('mainModal').classList.remove("hideMe")
        document.getElementById('subModal').classList.remove("hideMe")
        document.getElementById('mainModal').classList.add("showMe")
        document.getElementById('subModal').classList.add("showMe")
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

var baseIcon = L.icon({
    iconUrl: './img/temp.png',
    iconSize: [35, 35],
    iconAnchor: [5, 5],
    popupAnchor: [5, -5]
});

var baseIcon = L.icon({
    iconUrl: './img/test.gif',
    iconSize: [35, 35],
    iconAnchor: [5, 5],
    popupAnchor: [5, -5]
});


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
    if(currentTarget.id == "insertSpecialButton"){
        var type = document.getElementById('modalTypeMenu').value
        var coords = document.getElementById('modalCoords').innerHTML
        var alt = document.getElementById('modalMessageInput').value,
        //
        ccolor = document.getElementById('circleColor').value,
        cfill = document.getElementById('circleFillColor').value,
        copacity = document.getElementById('circleOpacity').value,
        cradius = document.getElementById('circleRadius').value,
        //
        coords = coords.split(",")

        if(type == "marker"){
            L.marker([coords[0],coords[1]], { "icon": baseIcon, "alt": `marker999, ${alt}` }).addTo(map)
        }
        if(type == "circle"){
            L.marker([coords[0],coords[1]], { "icon": baseIcon }).addTo(map)
            L.circle([coords[0],coords[1]], { color: ccolor, fillColor: cfill, fillOpacity: copacity, radius: cradius }).addTo(map)
        }
    }
    //

    var modal =document.getElementById('mainModal').classList

    if(e.key == "Escape"){
        if( modal == "mainModal Me"){
            hideModal()
        }
    }
    if(e.target.id == "mainModal"){
        hideModal()
    };

}
document.addEventListener("click", checkAndHideModal);
document.addEventListener("keydown", checkAndHideModal);
