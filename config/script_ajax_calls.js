async function ajaxChangeMainImg(){
    $.ajax({
        type: "POST",
        url: `/makeMainAccImage`,
        crossDomain: true,
        data: {
            "IDD": document.getElementById('hotelID').innerText ,
            "photoo": document.getElementsByClassName("carousel-item carouselImg active")[0].childNodes[1].src
        },
        success: console.log("success added image to accommodation")
    })
}


async function addImg(id,img,user){
    console.log(id, img,"AAAAAAAAAA",user);
    if(user=="1"){
        $.ajax({
            type: "POST",
            url: `/api/insertIMG`,
            crossDomain: true,
            data: {
                "IDD": document.getElementById('hotelIDForAddImg').innerHTML ,
                "photoo": document.getElementById('avatar_url2').value
            },
            success: console.log("success added image to accommodation")
        })
        hideModal3()
    }
}

async function applyFilter(user){
    
    await resolveAfterMSeconds(100)
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
        if(filteredResults.length > 0) {
            filteredResults.forEach( place => {
                // this is for the results when the user wants very specific accommodation :)
                // filtering paradise // gods list of filters // somewhat proud its made by me and flawless :D
                // checking all 4 filters (name of accommodation, location, type, price range) with a total of 16 combinations (luckly there are only 4 filters, if 5, would be 32 combinations😢)
                if(f1L==0 && f2L==0 && f3L==0 && f4L==0) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                
                if(f1L>=1 && f2L==0 && f3L==0 && f4L==0 
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L>=1 && f2L>=1 && f3L==0 && f4L==0 
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L>=1 && f2L>=1 && f3L>=1 && f4L==0 
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L>=1 && f2L>=1 && f3L>=1 && f4L>=1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L>=1 && f2L==0 && f3L==0 && f4L>=1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L>=1 && f2L==0 && f3L>=1 && f4L==0
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L>=1 && f2L==0 && f3L>=1 && f4L>=1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L>=1 && f2L>=1 && f3L==0 && f4L>=1
                    && String(place.name).toLowerCase().includes(String(f1).toLowerCase())
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                

                if(f1L==0 && f2L>=1 && f3L==0 && f4L==0
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L==0 && f2L>=1 && f3L>=1 && f4L==0
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L==0 && f2L>=1 && f3L>=1 && f4L>=1
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L==0 && f2L>=1 && f3L==0 && f4L>=1
                    && String(place.location).toLowerCase().includes(String(f2).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                        
                if(f1L==0 && f2L==0 && f3L>=1 && f4L==0
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                if(f1L==0 && f2L==0 && f3L>=1 && f4L>=1
                    && String(place.type).toLowerCase().includes(String(f3).toLowerCase())
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
                
                if(f1L==0 && f2L==0 && f3L==0 && f4L>=1
                    && parseFloat(f4) <= parseFloat(place.price) && parseFloat(place.price) <= parseFloat(f5+1)
                    ) { results += `<div class="divResults" onclick="openAddMarkModal2(${place.ID},${user})"><img src="${place.photo}" alt="photos"><h4 class="overflow-elipsis">${place.name}</h4><p class="overflow-elipsis">${place.type} in ${place.location}</p><p class="overflow-elipsis">${place.description}</p><p style='font-weight:bolder;white-space: nowrap;'>£${place.price}/night</p><button>BOOK</button></div>` }
            });
        } else {
            results += "<div<p>Unable to find anything.</p></div>";
        }
        document.getElementById("results").innerHTML = results;
    } catch (e) {
        alert(`There was an error: ${e}`);
    }
}


async function getHotelPics(hotelID){
    try {
		const ajaxResponse = await fetch(`api/img/${hotelID}`);
		const photos = await ajaxResponse.json();
        console.log(photos);
		let inner = "";
		let indicators = "";

        counter=0
         photos.forEach( ph => {
            
            if(counter=="0"){
                indicators += `<button type="button" data-bs-target="#myCarousel" data-bs-slide-to="${counter}" class="carrouselButtons active" aria-current="true" aria-label="Slide ${counter+1}"></button>`;
                inner += `<div class="carousel-item carouselImg active" data-interval="2000" style="position: relative;">
                                <img src="${ph.photo}" class="carouselImg rounded" alt="img${counter}">
                          </div>`;
                counter++
            } else{
                indicators+= `<button class="carrouselButtons " type="button" data-bs-target="#myCarousel" data-bs-slide-to="${counter}" aria-label="Slide ${counter+1}"></button>`;
                inner += `<div class="carousel-item carouselImg" data-interval="2000">
                             <img src="${ph.photo}" class="carouselImg rounded" alt="img${counter}"><button onclick="ajaxChangeMainImg()" class="make-main-profile-picture" style="position: absolute">⭐</button>
                          </div>`;
                counter++}
        });
		document.getElementById("carousel-inner").innerHTML = inner;
		document.getElementById("carousel-indicators").innerHTML = indicators;
	} catch (e) {
        alert(`There was an error: ${e}`);
    }
}




function completeBooking(){
    $.ajax({
        type: "POST",
        url: "/book",
        crossDomain: true,
        data: {
            "accID": document.getElementById('hotelID').innerHTML ,
            "thedate": document.getElementById('dateOfBooking').value ,
            "username": document.getElementById('bookingUser').innerHTML ,
            "npeople": document.getElementById('numberOfPeople').value 
        },
        success: console.log("success book this")
    })
    hideModal2()
}

function deleteThisPoint(pointRef, mark) { // mark deletion
    $.ajax({
        type: "POST",
        crossDomain: true,
        url: "/delete_point",
        data: { "point": pointRef },
        success: [console.log("success delete this"),hideMark()]
    })
}
function hideMark() { // mark removal so there is no need to refresh the page
    document.getElementById('current_target').remove()
}

function insertMarker(userID) { // mark insertion
    if (document.getElementById('modalName').value.length > 0 &&
    document.getElementById('modalLocation').value.length > 0 &&
    document.getElementById('modalPriceInput').value.length > 0
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
            success: console.log("ajax save point")
        })
        hideModal()
    }

    
    if (document.getElementById('modalName').value.length == 0) {
        document.getElementById('modalName').style.border = "2px solid red";
        document.getElementById('error1').style.visibility = "visible";
    } else {
        document.getElementById('error1').style.visibility = 'hidden'
        document.getElementById('modalName').style.border = "1px solid black";
    }
    if (document.getElementById('modalLocation').value.length == 0) {
        document.getElementById('modalLocation').style.border = "2px solid red";
        document.getElementById('error2').style.visibility = "visible";
    } else {
        document.getElementById('error2').style.visibility = 'hidden'
        document.getElementById('modalLocation').style.border = "1px solid black";
    }

}

