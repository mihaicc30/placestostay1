function numberOfUsers(someNumber){
    let maxNumber= String(document.getElementById('numberOfPeopleAVAILABLE').innerHTML).substring(0,2)
    if(parseInt(document.getElementById('numberOfPeople').value) + parseInt(someNumber) != parseInt(0) &&
    parseInt(document.getElementById('numberOfPeople').value) + parseInt(someNumber) <= parseInt(maxNumber)
    ){
        document.getElementById('numberOfPeople').value = parseInt(document.getElementById('numberOfPeople').value) + parseInt(someNumber)
    }
}

async function initCalendar(){
    const calendar = new VanillaCalendar('#calendar',{ date: {min: String(new Date().toISOString().slice(0, 10))},actions: {clickDay(e) {
        getSpacesAvailable(document.getElementById("hotelID").innerHTML,String(e.target.dataset.calendarDay).replace("-","").replace("-","").substring(2));
        document.getElementById('dateOfBooking').value= String(e.target.dataset.calendarDay).replace("-","").replace("-","").substring(2)

    }} });
    await calendar.init();
    calendar.settings.iso8601 = true;
    let todaysDate = new Date().toISOString().substring(0,10);
    // calendar.date.today = todaysDate.toISOString()
    console.log(todaysDate);
    document.getElementById('dateOfBooking').value= String(calendar.date.today.toISOString()).substring(0,10).replace("-","").replace("-","").substring(2)
}
async function changePage(page){
    //  for(i=1;i<document.querySelectorAll('[data-page]').length;i++){
    //     if(document.querySelector(`[data-page="${i}"]`).classList.contains('active')){
    //         document.querySelector(`[data-page="${i}"]`).classList.remove('active')
    //     }
    // }
    document.querySelector(`[data-page="${page}"]`).classList.add('active')

    for(i=0;i<document.querySelectorAll('[data-pageresults]').length;i++){
        document.querySelectorAll('[data-pageresults]')[i].style.display="none"
    }
    document.querySelectorAll(`[data-pageresults="${page}"]`).forEach(div => {
        div.style.display="block"
    });
}

function showPaymentDiv(n) {
    document.getElementById(`mainModal${n}`).classList.remove("hideMe")
    document.getElementById(`subModal${n}`).classList.remove("hideMe")
    document.getElementById(`mainModal${n}`).classList.add("showMe")
    document.getElementById(`subModal${n}`).classList.add("showMe")
}

function addImgModal(id,user){
    if(user!="2"){
        document.getElementById('hotelIDForAddImg').innerHTML=id
        document.getElementById('avatar_url2').value=""
        document.getElementById('mainModal3').classList.remove("hideMe")
        document.getElementById('subModal3').classList.remove("hideMe")
        document.getElementById('mainModal3').classList.add("showMe")
        document.getElementById('subModal3').classList.add("showMe")
    } else {
        document.getElementById('mainModal3').classList.remove("hideMe")
        document.getElementById('subModal3').classList.remove("hideMe")
        document.getElementById('mainModal3').classList.add("showMe")
        document.getElementById('subModal3').classList.add("showMe")
    }
}

function openAddMarkModal(lat, lon) {
        document.getElementById('mainModal1').classList.remove("hideMe")
        document.getElementById('subModal1').classList.remove("hideMe")
        document.getElementById('mainModal1').classList.add("showMe")
        document.getElementById('subModal1').classList.add("showMe")

        document.getElementById('modalCoordsLat').innerText = lat 
        document.getElementById('modalCoordsLon').innerText = lon
        document.getElementById('avatar_url').innerText = "" 
        document.getElementById('modalName').innerText = "" 
        document.getElementById('modalMessageInput').innerText = "" 
}
function hideModal(n) {
    document.getElementById(`mainModal${n}`).classList.remove("showMe")
    document.getElementById(`mainModal${n}`).classList.add("hideMe")
    document.getElementById(`subModal${n}`).classList.remove("showMe")
    document.getElementById(`subModal${n}`).classList.add("hideMe")
}

async function openAddMarkModal2(hotelID,uzer) {
        document.getElementById('mainModal2').classList.remove("hideMe")
        document.getElementById('subModal2').classList.remove("hideMe")
        document.getElementById('mainModal2').classList.add("showMe")
        document.getElementById('subModal2').classList.add("showMe")
        if(String(uzer) == "1"){
            document.getElementById('hotelID').innerText = hotelID 
            initCalendar()
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

    if(e.key == "Escape"){
            hideModal(1)
            hideModal(2)
            hideModal(3)
            hideModal(4)
    }
    if(e.target.id == "mainModal1"){
        hideModal(1)
    };
    if(e.target.id == "mainModal2"){
        hideModal(2)
    };
    if(e.target.id == "mainModal3"){
        hideModal(3)
    };
    if(e.target.id == "mainModal4"){
        hideModal(4)
    };

}
document.addEventListener("click", checkAndHideModal);
document.addEventListener("keydown", checkAndHideModal);

