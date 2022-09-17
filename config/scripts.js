
function hideFilters(){
    // 
    // 
    if(divOpen == 1){
        document.getElementById('search').style.transform="translate(-24px,0px)";
        document.getElementById('menuButton').innerHTML=`<ion-icon class="collapsebtn act" name="caret-back-outline"></ion-icon>`
        divOpen = 2;
    } else {
        document.getElementById('search').style.transform="translate(-286px,0px)";
        document.getElementById('menuButton').innerHTML=`<ion-icon class="collapsebtn" name="caret-forward-outline"></ion-icon>`
        divOpen = 1;
    }
}
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
    document.getElementById('dateOfBooking').value= String(calendar.date.today.toISOString()).substring(0,10).replace("-","").replace("-","").substring(2)
    setTimeout(addToCalendarClass(), 1111)
}
function addToCalendarClass(){
    document.querySelector('.vanilla-calendar-day_today').classList.add('vanilla-calendar-day_selected')
}
async function changePage(page){
    document.querySelectorAll('[data-page]').forEach(element => {
        element.classList.remove('active')
    });

    if(document.querySelector(`[data-page="${page}"]`) != null){
        document.querySelector(`[data-page="${page}"]`).classList.add('active')
    }

    for(i=0;i<document.querySelectorAll('[data-pageresults]').length;i++){
        document.querySelectorAll('[data-pageresults]')[i].style.display="none"
    }
    document.querySelectorAll(`[data-pageresults="${page}"]`).forEach(div => {
        div.style.display="block"
    });
    $("#results").animate({ scrollTop: 0 }, "slow");
    
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

function openAddMarkModal(lat, lon, checkAdmin) {
    if(checkAdmin == 1){
        document.getElementById('mainModal1').classList.remove("hideMe")
        document.getElementById('subModal1').classList.remove("hideMe")
        document.getElementById('mainModal1').classList.add("showMe")
        document.getElementById('subModal1').classList.add("showMe")
    
        document.getElementById('modalCoordsLat').innerText = lat 
        document.getElementById('modalCoordsLon').innerText = lon
        document.getElementById('avatar_url').innerText = "" 
        document.getElementById('modalName').innerText = "" 
        document.getElementById('modalMessageInput').innerText = "" 
    } else {
        document.getElementById('popupMessages').innerHTML = `<div class="alert alert-danger alert-dismissible fade show p-5 text-center" role="alert">
                                                                                <br><br> 401 Unauthorized <br><br>Admin privileges required.<br>
                                                                        <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                            <span aria-hidden="true"></span>
                                                                        </button>
                                                                    </div>`
    }
    
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
            await getHotelPics(hotelID,"carrDiv",uzer)
        }
}
function openUserModal(no) {
    document.getElementById(`mainModal${no}`).classList.remove("hideMe")
    document.getElementById(`subModal${no}`).classList.remove("hideMe")
    document.getElementById(`mainModal${no}`).classList.add("showMe")
    document.getElementById(`subModal${no}`).classList.add("showMe")
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

    if(e.key == "Escape"){
            hideModal(1)
            hideModal(2)
            hideModal(3)
            hideModal(4)
            hideModal(5)
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
    if(e.target.id == "mainModal5"){
        hideModal(5)
    };

}
document.addEventListener("click", checkAndHideModal);
document.addEventListener("keydown", checkAndHideModal);