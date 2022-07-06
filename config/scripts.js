async function changePage(page){

    console.log("LOOKING ON PAGE "+page);
    for(i=0;i<document.querySelectorAll('[data-pageresults]').length;i++){
        document.querySelectorAll('[data-pageresults]')[i].style.display="none"
    }
    document.querySelectorAll(`[data-pageresults="${page}"]`).forEach(div => {
        div.style.display="block"
    });
}

function addImgModal(id,user){
    if(user!="2"){
        document.getElementById('hotelIDForAddImg').innerHTML=id
        document.getElementById('avatar_url2').value=""
        document.getElementById('mainModal3').classList.remove("hideMe")
        document.getElementById('subModal3').classList.remove("hideMe")
        document.getElementById('mainModal3').classList.add("showMe")
    document    .getElementById('subModal3').classList.add("showMe")
    } else {
        document.getElementById('mainModal3').classList.remove("hideMe")
        document.getElementById('subModal3').classList.remove("hideMe")
        document.getElementById('mainModal3').classList.add("showMe")
        document.getElementById('subModal3').classList.add("showMe")
    }
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
function hideModal() {
    document.getElementById('mainModal').classList.remove("showMe")
    document.getElementById('mainModal').classList.add("hideMe")
    document.getElementById('subModal').classList.remove("showMe")
    document.getElementById('subModal').classList.add("hideMe")
}
function hideModal2() {
    document.getElementById('mainModal2').classList.remove("showMe")
    document.getElementById('mainModal2').classList.add("hideMe")
    document.getElementById('subModal2').classList.remove("showMe")
    document.getElementById('subModal2').classList.add("hideMe")
}
function hideModal3() {
    document.getElementById('mainModal3').classList.remove("showMe")
    document.getElementById('mainModal3').classList.add("hideMe")
    document.getElementById('subModal3').classList.remove("showMe")
    document.getElementById('subModal3').classList.add("hideMe")
}
async function openAddMarkModal2(hotelID,uzer) {
        document.getElementById('mainModal2').classList.remove("hideMe")
        document.getElementById('subModal2').classList.remove("hideMe")
        document.getElementById('mainModal2').classList.add("showMe")
        document.getElementById('subModal2').classList.add("showMe")
        if(String(uzer) == "1"){
            document.getElementById('hotelID').innerText = hotelID 
            await getSpacesAvailable(hotelID,String(new Date().toISOString().slice(0, 10)).replace("-","").replace("-","").substring(2))
            await getHotelPics(hotelID,"carrDiv")
        }
        

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
    var modal2 = document.getElementById('mainModal2').classList
    var modal3 = document.getElementById('mainModal3').classList
    if(e.key == "Escape"){
        if( modal == "mainModal"){
            hideModal()
        }
        if( modal2 == "mainModal2"){
            hideModal2()
        }
        if( modal3 == "mainModal3"){
            hideModal3()
        }
    }
    if(e.target.id == "mainModal"){
        hideModal()
    };
    if(e.target.id == "mainModal2"){
        hideModal2()
    };
    if(e.target.id == "mainModal3"){
        hideModal3()
    };

}
document.addEventListener("click", checkAndHideModal);
document.addEventListener("keydown", checkAndHideModal);

