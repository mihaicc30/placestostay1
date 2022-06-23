function completeBooking(){
    $.ajax({
        type: "POST",
        url: "/book_this",
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
        url: "/delete_point",
        data: { "point": pointRef },
        success: [console.log("success delete this"),hideMark()]
    })
}
function hideMark() { // mark removal so there is no need to refresh the page
    document.getElementById('current_target').remove()
}

function insertMarker(userID, countz) { // mark insertion
    if (document.getElementById('modalName').value.length > 0 &&
        document.getElementById('modalLocation').value.length > 0 &&
        document.getElementById('modalMessageInput').value.length > 0
    ) {
        $.ajax({
            type: "POST",
            url: "/save_point",
            data: {

                "name": document.getElementById('modalName').value,
                "type": String(document.getElementById('modalIconMenu').value).substring(4),
                "location": document.getElementById('modalLocation').value,
                "latitude": document.getElementById('modalCoordsLat').innerHTML,
                "longitude": document.getElementById('modalCoordsLon').innerHTML,
                "icon": document.getElementById('modalIconMenu').value,
                "photo": document.getElementById('modalImage').value,
                "description": document.getElementById('modalMessageInput').value,
            },
            // success: showOnMap()
        })
        hideModal()
    }

    if (document.getElementById('modalMessageInput').value.length == 0) {
        document.getElementById('modalMessageInput').style.border = "2px solid red";
        document.getElementById('error3').style.visibility = "visible";
    } else {
        document.getElementById('error3').style.visibility = 'hidden'
        document.getElementById('modalMessageInput').style.border = "1px solid black";
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

