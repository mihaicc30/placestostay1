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

        document.getElementById('modalCoordsLat').innerText = lat 
        document.getElementById('modalCoordsLon').innerText = lon
        document.getElementById('avatar_url').innerText = "" 
        document.getElementById('modalName').innerText = "" 
        document.getElementById('modalMessageInput').innerText = "" 
}

function hideModal2() {
    document.getElementById('mainModal2').classList.remove("showMe")
    document.getElementById('mainModal2').classList.add("hideMe")
    document.getElementById('subModal2').classList.remove("showMe")
    document.getElementById('subModal2').classList.add("hideMe")
}
function openAddMarkModal2(hotelID) {
        document.getElementById('mainModal2').classList.remove("hideMe")
        document.getElementById('subModal2').classList.remove("hideMe")
        document.getElementById('mainModal2').classList.add("showMe")
        document.getElementById('subModal2').classList.add("showMe")
        document.getElementById('hotelID').innerText = hotelID 
        

}
var baseIcon = L.icon({
    iconUrl: './img/temp.png',
    iconSize: [35, 35],
    iconAnchor: [5, 5],
    popupAnchor: [5, -5]
})


function checkAndHideModal(e){
    // for ajax management calls   -> script_ajax_calls.js
    var currentTarget = e.target
    if( (String(currentTarget).startsWith("[object HTMLImageElement]") || String(currentTarget).startsWith("[object SVGPathElement]")) 
        && String(currentTarget.classList).startsWith("leaflet")){
        if(document.querySelectorAll('#current_target').length > 0 ){
            var beforeTarget = document.getElementById('current_target')
            beforeTarget.removeAttribute("id")
        }
        currentTarget.setAttribute("id", "current_target")
    };
    // if(currentTarget.id == "insertSpecialButton"){
    //     // var type = document.getElementById('modalTypeMenu').value
    //     var coordslat = document.getElementById('modalCoordsLat').innerHTML
    //     var coordslon = document.getElementById('modalCoordsLon').innerHTML
    //     var alt = document.getElementById('modalMessageInput').value

    //     L.marker([coordslat,coordslon], { "icon": baseIcon, "alt": `marker999, ${alt}` }).addTo(map)
    // }
    //

    var modal = document.getElementById('mainModal').classList

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
