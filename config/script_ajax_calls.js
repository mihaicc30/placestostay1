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
        document.getElementById('modalLocation').value.length > 0
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

