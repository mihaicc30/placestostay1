function addSpaces(hotelID, number, dater){
    if(hotelID!="" && number!="" && dater!="" ){
        $.ajax({
            type: "POST",
            url: "/addspaces",
            crossDomain: true,
            data: {
                "hotelID": hotelID,
                "number": number,
                "dater": dater
            },
            success: document.getElementById('popupMessages').innerHTML = `<div class="alert alert-success alert-dismissible fade show p-5 text-center" role="alert">
                                                                                                Spaces set! 😇
                                                                                        <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                            <span aria-hidden="true"></span>
                                                                                        </button>
                                                                                    </div>`
        })
        
        if(number == "0") {
            document.getElementById('numberOfPeopleAVAILABLE').innerText = "No spaces available."
        }
        else {
            document.getElementById('numberOfPeopleAVAILABLE').innerText=`${number} Spaces available!`
        }
    } else {
        document.getElementById('popupMessages').innerHTML = `<div class="alert alert-danger alert-dismissible fade show p-5 text-center" role="alert">
                                                                                                Date is not selected or input field is empty!
                                                                                        <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                            <span aria-hidden="true"></span>
                                                                                        </button>
                                                                                    </div>`
    }
}




function ajaxProfileDelete(oldUsername){
    $.ajax({
        type: "DELETE",
        url: "/myprofile_delete",
        crossDomain: true,
        data: {
            "oldUsername": oldUsername
        },
        success: document.getElementById('popupMessages').innerHTML = `<div class="alert alert-danger alert-dismissible fade show p-5 text-center" role="alert">
                                                                                            Profile Deleted! 😢
                                                                                    <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                        <span aria-hidden="true"></span>
                                                                                    </button>
                                                                                </div>`
    })
}
function ajaxProfileUpdate(oldUsername){
    var newUsername = document.getElementById("uzer").value
    var pass = document.getElementById("pass").value

    $.ajax({
        type: "POST",
        url: "/myprofile_save",
        crossDomain: true,
        data: {
            "oldUsername": oldUsername,
            "pass": pass,
            "newUsername": newUsername
        },
        success: document.getElementById('popupMessages').innerHTML = `<div class="alert alert-success alert-dismissible fade show p-5 text-center" role="alert">
                                                                                            Profile Updated! 🌞
                                                                                    <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                        <span aria-hidden="true"></span>
                                                                                    </button>
                                                                                </div>`
    })
}

function completeBookingStep1() {
    let n_peps = document.getElementById('numberOfPeople').value
    let n_maxPeps = parseInt(String(document.getElementById('numberOfPeopleAVAILABLE').innerHTML).substring(0, 2))
    if (n_peps <= n_maxPeps && n_peps != "0") {
        completeBookingStep2() // show payment div
    }
}

function completeBookingStep2() {
    const payButton = document.querySelector('#paymentButton') 
    const loader = document.querySelector('#paymentButtonLoader') 
    payButton.innerHTML=`<button class="btn btn-primary" id="paymentButton" onclick="completeBookingStep3()">💳Pay</button>`
    loader.innerHTML=""

    document.getElementById('name').value = ""
    document.getElementById('cardnumber').value = ""
    document.getElementById('expirationdate').value = ""
    document.getElementById('securitycode').value = ""
    showPaymentDiv(4)
}

async function completeBookingStep3() {

    const payButton = document.querySelector('#paymentButton') 
    const loader = document.querySelector('#paymentButtonLoader') 
    
     

    let name = document.getElementById('name').value
    let cardnumber = document.getElementById('cardnumber').value
    let expirationdate = String(document.getElementById('expirationdate').value).replace("/", "")
    let securitycode = document.getElementById('securitycode').value

    if (name == "" || cardnumber == "" || expirationdate == "" || securitycode == "") {
        const checkName             = name == ""            ? document.getElementById('name').style.border = "2px solid red"            
                                                            : document.getElementById('name').style.border = "none"
        const checkCardNumber       = cardnumber == ""      ? document.getElementById('cardnumber').style.border = "2px solid red"      
                                                            : document.getElementById('cardnumber').style.border = "none"
        const checkExpirationDate   = expirationdate == ""  ? document.getElementById('expirationdate').style.border = "2px solid red"  
                                                            : document.getElementById('expirationdate').style.border = "none"
        const checkSecurityCode     = securitycode == ""    ? document.getElementById('securitycode').style.border = "2px solid red"    
                                                            : document.getElementById('securitycode').style.border = "none"
    } else {
        payButton.innerHTML=""
        loader.innerHTML=`<div class="loader"></div>`
        setTimeout(async() => {
            let validateThisCard = await fetch(`/api/validatecard/${cardnumber}/${name}/${expirationdate}/${securitycode}`)
            let ajaxResponse = await validateThisCard.json();
            if (ajaxResponse == "card valid") {
                $.ajax({
                    type: "POST",
                    url: "/book",
                    crossDomain: true,
                    data: {
                        "accID": document.getElementById('hotelID').innerHTML,
                        "thedate": document.getElementById('dateOfBooking').value,
                        "username": document.getElementById('bookingUser').innerHTML,
                        "npeople": document.getElementById('numberOfPeople').value,
                    },
                    success: document.getElementById('popupMessages').innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show p-5 text-center" role="alert">
                                        🙌🥳🥂🙌<br><br>
                                Your booking has been completed.<br><br>
                                Have a safe journey!🚙🌴<br>
                                <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true"></span>
                                </button>
                            </div>`
                })
                hideModal(2); hideModal(3); hideModal(4);
            } else {
                payButton.innerHTML=`<button class="btn btn-primary" id="paymentButton" onclick="completeBookingStep3()">💳Pay</button>`
                loader.innerHTML=""
                console.log("card is not valid"); 
                document.getElementById('name').style.border = "2px solid red"
                document.getElementById('cardnumber').style.border = "2px solid red"
                document.getElementById('expirationdate').style.border = "2px solid red"
                document.getElementById('securitycode').style.border = "2px solid red"

                document.getElementById('popupMessages').innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show p-5 text-center" role="alert">
                                👎 <br><br> CARD IS NOT VALID!<br><br>📃Check again your details.<br>
                        <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true"></span>
                        </button>
                    </div>`
            }
        }, 3333);
        
    }



}

async function getSpacesAvailable(hotelID, bookingDate) {
    try {
        const ajaxResponse = await fetch(`/api/availability/${bookingDate}/${hotelID}`)
        const filteredResults = await ajaxResponse.json();

        if (filteredResults == "Fully booked on this date!") {
            document.getElementById('numberOfPeopleAVAILABLE').innerHTML = "Fully booked on this date!"
            document.getElementById('numberOfPeople').min = filteredResults
            document.getElementById('numberOfPeople').value = filteredResults
            document.getElementById('numberOfPeople').style.display = "none"
            document.getElementById('calendarDiv').style.visibility = "hidden"
            document.getElementById('insertSpecialButton2').disabled = true
        } else {
            document.getElementById('numberOfPeopleAVAILABLE').innerHTML = filteredResults + " Spaces available! "
            document.getElementById('numberOfPeople').style.display = "initial"
            document.getElementById('numberOfPeople').min = "1"
            document.getElementById('numberOfPeople').value = "1"
            document.getElementById('numberOfPeople').max = filteredResults
            document.getElementById('insertSpecialButton2').disabled = false
            document.getElementById('calendarDiv').style.visibility = "initial"
        }
    } catch (e) {
        alert(`There was an error: ${e}`);
    }
}
async function ajaxChangeMainImg(hotelID, isAdmin) {
    if(isAdmin===1){
        applyFilter(1,1)
        $.ajax({
            type: "POST",
            url: `/makeMainAccImage`,
            crossDomain: true,
            data: {
                "IDD": hotelID,
                "photoo": document.getElementsByClassName("carousel-item carouselImg active")[0].childNodes[1].src,
                "userAdmin": isAdmin
            },
                   
            })
        setTimeout(() => {
            document.getElementById('popupMessages').innerHTML=""
        }, 2222);
        document.getElementById('popupMessages').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                                                                Main accommodation image changed.
                                                                                <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                    <span aria-hidden="true"></span>
                                                                                </button>
                                                                            </div>`
    }else{
        document.getElementById('popupMessages').innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                                                Error 401 Unauthorized<br>
                                                                                Admin priviledges required.
                                                                                <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                    <span aria-hidden="true"></span>
                                                                                </button>
                                                                            </div>`
    }   
    

}


async function addImg(id, img, user) {
    if (user == "1") {
        $.ajax({
            type: "POST",
            url: `/api/insertIMG`,
            crossDomain: true,
            data: {
                "IDD": document.getElementById('hotelIDForAddImg').innerHTML,
                "photoo": document.getElementById('avatar_url2').value
            },
            success: document.getElementById('popupMessages').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                Photo successfully added.
                                <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true"></span>
                                </button>
                            </div>`
        })
        hideModal(3)
    }
}

async function applyFilter(user, isAdmin) {
    let pic="booknow"
    if(String(isAdmin) === "1"){ pic="manageAcc" }
    
    await resolveAfterMSeconds(500) // reduce the number of queries on the server
    var f1L = document.getElementById('filterName').value.length,
        f2L = document.getElementById('filterCounty').value.length,
        f3L = document.getElementById('filterType').value.length,
        f4L = document.getElementById('lowGBPAmount').innerHTML.length,
        f5L = document.getElementById('highGBPAmount').innerHTML.length,
        f1 = document.getElementById('filterName').value,
        f2 = document.getElementById('filterCounty').value,
        f3 = document.getElementById('filterType').value,
        f4 = document.getElementById('lowGBPAmount').innerHTML.substring(1),
        f5 = document.getElementById('highGBPAmount').innerHTML.substring(1)
    // console.log(f1L,f2L,f3L,f4L,f5L);  // test double checking console output

    try {
        const ajaxResponse = await fetch(`api/acc`);
        const filteredResults = await ajaxResponse.json();
        let results = "";
        let navStart = `<nav aria-label="pagination" style="width:80vw"> <ul class="pagination justify-content-center">`
        let page = "";
        let navEnd = `</ul></nav>`;
        let someCounter = 6;
        let divNo = 0;

        if (filteredResults.length > 0) {
            await filteredResults.forEach(place => {
                // this is for the results when the user wants very specific accommodation :)
                // filtering paradise // gods list of filters // somewhat proud its made by me and flawless :D
                // checking all 4 filters (name of accommodation, location, type, price range) with a total of 16 combinations (luckly there are only 4 filters, if 5, would be 32 combinations😢,etc)
                if (f1L == 0 && f2L == 0 && f3L == 0 && f4L == 0
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/${pic}.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }

                if (f1L >= 1 && f2L == 0 && f3L == 0 && f4L == 0
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L >= 1 && f2L >= 1 && f3L == 0 && f4L == 0
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L >= 1 && f2L >= 1 && f3L >= 1 && f4L == 0
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L >= 1 && f2L >= 1 && f3L >= 1 && f4L >= 1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L >= 1 && f2L == 0 && f3L == 0 && f4L >= 1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L >= 1 && f2L == 0 && f3L >= 1 && f4L == 0
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L >= 1 && f2L == 0 && f3L >= 1 && f4L >= 1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L >= 1 && f2L >= 1 && f3L == 0 && f4L >= 1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }


                if (f1L == 0 && f2L >= 1 && f3L == 0 && f4L == 0
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L == 0 && f2L >= 1 && f3L >= 1 && f4L == 0
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L == 0 && f2L >= 1 && f3L >= 1 && f4L >= 1
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L == 0 && f2L >= 1 && f3L == 0 && f4L >= 1
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }

                if (f1L == 0 && f2L == 0 && f3L >= 1 && f4L == 0
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
                if (f1L == 0 && f2L == 0 && f3L >= 1 && f4L >= 1
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }

                if (f1L == 0 && f2L == 0 && f3L == 0 && f4L >= 1
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5 + 1)
                ) { if ((parseInt(someCounter) % 6) == "0") { divNo++; }; someCounter++; results += `<div data-coords="${place.latitude},${place.longitude}" class="divResults addNeumorph" data-pageResults="${divNo}"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-size:1.2rem;font-weight:bolder;white-space: nowrap;margin-left:20px;'>£${place.price}/night</p><button style="border:none;background-color:transparent" type="button" onclick="openAddMarkModal2(${place.ID},${user},${isAdmin})"><img src="./img/booknow.png" alt="Get Directions" id="directionIcon" style="width:45px; height:45px;background-color:transparent;"></button></div>` }
            });
            for (i = 0; i < divNo; i++) {
                if (i == "0") { page += `<li class="page-item" data-page="${i + 1}"><a onclick="changePage(${i + 1})" data-page="${i + 1}" class="page-link ">${i + 1}</a></li>` } else {
                    page += `<li class="page-item" data-page="${i + 1}"><a onclick="changePage(${i + 1})" data-page="${i + 1}" class="page-link">${i + 1}</a></li>`
                }
            }
            if(results.length < 1) {
                document.getElementById("results").innerHTML = `<p>Unable to find anything.</p>`;
            } else {
                document.getElementById("results").innerHTML = results + navStart + page + navEnd
            }
            changePage(1)
            
        }
            


    } catch (e) {
        alert(`There was an error: ${e}`);
    }
}



async function getHotelPics(hotelID, putInThisDiv, isAdmin) {
    let stock_photo = "https://cdn-j5lfyoei.resize-files-simplefileupload.com/5zg9WtHH3SHYQ0wioSD5VqJb0CZUv4oVvEq7HBk_2FE/plain/s3://static.files-simplefileupload.com/0blkz8lio489yzeapuf2qv0de7oc"
    
    try {
        const ajaxResponse = await fetch(`api/img/${hotelID}`);
        const photos = await ajaxResponse.json();
        let inner = "";
        let my_carousel_code_start = `<div id="myCarousel${putInThisDiv}" class="carousel carousel-fade" data-bs-ride="carousel">`
        let my_carousel_code_end = ` <a class="carousel-control-prev" href="#myCarousel${putInThisDiv}" role="button" data-bs-slide="prev" style="text-decoration: none;color: black;font-size: 50px;left: -10%;transform: translateY(100px);">◀</a>
                                    <a class="carousel-control-next" href="#myCarousel${putInThisDiv}" role="button" data-bs-slide="next" style="text-decoration: none;color: black;font-size: 50px;right: -10%;transform: translateY(100px);">▶</a>
                                    </div>` 
        counter = 0
        if(photos.length >1){
            photos.forEach(ph => {
                if(ph.photo != stock_photo){
                    if (counter == "0") {
                        inner += `<div class="carousel-item carouselImg rounded active" data-interval="2000" style="position: relative;">
                                        <img src="${ph.photo}" class="carouselImg rounded" alt="img${counter}"><button onclick="ajaxChangeMainImg(${hotelID},${isAdmin});this.style.display='none'" class="make-main-profile-picture btn btn-block btn-primary">Make Profile Picture</button>
                                  </div>`;
                        counter++
                    } else {
                        inner += `<div class="carousel-item carouselImg rounded" data-interval="2000">
                                     <img src="${ph.photo}" class="carouselImg rounded" alt="img${counter}"><button onclick="ajaxChangeMainImg(${hotelID},${isAdmin});this.style.display='none'" class="make-main-profile-picture btn btn-block btn-primary">Make Profile Picture</button>
                                  </div>`;
                        counter++
                    }
                }
            });
        }else{
            photos.forEach(ph => {
                if (counter == "0") {
                    inner += `<div class="carousel-item carouselImg rounded active" data-interval="2000" style="position: relative;">
                                    <img src="${ph.photo}" class="carouselImg rounded" alt="img${counter}">
                              </div>`;
                    counter++
                }
            })
        }
        if(photos.length >1){
            document.getElementById(`${putInThisDiv}`).innerHTML = my_carousel_code_start + inner + my_carousel_code_end;
        } else {
            document.getElementById(`${putInThisDiv}`).innerHTML = my_carousel_code_start + inner + "</div>";
        }
    } catch (e) {
        alert(`There was an error: ${e}`);
    }
}


function deleteThisPoint(pointRef, mark, user, adminCheck) { // mark deletion
    if (user == "1") {
        if(adminCheck=="1"){
            $.ajax({
                type: "POST",
                crossDomain: true,
                url: "/delete_point",
                data: { "point": pointRef },
                success: [
                    document.getElementById('current_target').remove(),
                    document.querySelector('.leaflet-popup').classList.add('hideMe'),
                    document.getElementById('popupMessages').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                                                                                Point and accommodation deleted.
                                                                                                <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                                    <span aria-hidden="true"></span>
                                                                                                </button>
                                                                                            </div>`]
            })
            document.getElementById('popupMessages').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                                                                Point and accommodation deleted.
                                                                                    <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                        <span aria-hidden="true"></span>
                                                                                    </button>
                                                                                </div>`
        }else{
            document.getElementById('popupMessages').innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                                                    Error 401 Unauthorized<br>
                                                                                    No admin priviledges.
                                                                                    <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                        <span aria-hidden="true"></span>
                                                                                    </button>
                                                                                </div>`
        }   
        
    } else {
        openAddMarkModal2(35, 2)
    }
}

async function insertMarker(userID) { // mark insertion
    if (document.getElementById('modalName').value.length > 0 &&
        document.getElementById('modalLocation').value.length > 0 &&
        document.getElementById('modalPriceInput').value.length > 0 &&
        document.getElementById('modalMessageInput').value.length > 0
    ) {
        $.ajax({
            type: "POST",
            url: "/save_point",
            crossDomain: true,
            data: {
                "name": document.getElementById('modalName').value,
                "type": String(document.getElementById('modalIconMenu').value).substring(4),
                "location": document.getElementById('modalLocation').value,
                "latitude": document.getElementById('modalCoordsLat').innerHTML,
                "longitude": document.getElementById('modalCoordsLon').innerHTML,
                "icon": document.getElementById('modalIconMenu').value,
                "photo": document.getElementById('avatar_url').value,
                "description": document.getElementById('modalMessageInput').value,
                "price": document.getElementById('modalPriceInput').value,
            },
            success: [document.getElementById('popupMessages').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                                                                Point and accommodation successfully saved. Pending admins aproval.
                                                                                <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">
                                                                                    <span aria-hidden="true"></span>
                                                                                </button>
                                                                            </div>`]
        })
        hideModal(1)
        let marker666 = L.marker([document.getElementById('modalCoordsLat').innerHTML,document.getElementById('modalCoordsLon').innerHTML],{ iconUrl: `./img/${document.getElementById('modalIconMenu').value}.png`, alt: 'marker666', description:document.getElementById('modalMessageInput').value } )
        marker666.addTo(map)
    }


    if (document.getElementById('modalName').value.length == 0) {
        document.getElementById('modalName').style.border = "2px solid red";
        document.getElementById('error1').style.visibility = "visible";
    } else {
        document.getElementById('error1').style.visibility = 'hidden'
        document.getElementById('modalName').style.border = "1px solid black";
    }
    if (document.getElementById('modalPriceInput').value.length == 0) {
        document.getElementById('modalPriceInput').style.border = "2px solid red";
        document.getElementById('error3').style.visibility = "visible";
    } else {
        document.getElementById('error3').style.visibility = 'hidden'
        document.getElementById('modalPriceInput').style.border = "1px solid black";
    }
    if (document.getElementById('modalMessageInput').value.length == 0) {
        document.getElementById('modalMessageInput').style.border = "2px solid red";
        document.getElementById('error4').style.visibility = "visible";
    } else {
        document.getElementById('error4').style.visibility = 'hidden'
        document.getElementById('modalMessageInput').style.border = "1px solid black";
    }

}

