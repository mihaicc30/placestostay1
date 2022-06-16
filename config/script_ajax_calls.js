function deleteThisPoint(pointRef, mark) { // mark deletion
    $.ajax({
        type: "POST",
        url: "/delete_point",
        data: { "point": pointRef },
        success: hideMark(mark)
    })
}
function hideMark(mark) { // mark removal so there is no need to refresh the page
    console.log(mark);
    var markz = document.getElementsByClassName('leaflet-marker-icon leaflet-zoom-animated leaflet-interactive')
    for (i = 0; i < markz.length; i++) {
        if (String(markz[i].attributes.alt.nodeValue).startsWith(mark)) {
            markz[i].setAttribute('id', 'removeThisOne')
        };
    }
    document.getElementById('removeThisOne').remove()
}

function insertMarker(userID) { // mark insertion
    if (document.getElementById('modalMessageInput').value.length > 0) {
        var type = document.getElementById('modalTypeMenu').value
        if (type == "marker") {
            $.ajax({
                type: "POST",
                url: "/save_point",
                data: {
                    "type": document.getElementById('modalTypeMenu').value,
                    "coords": document.getElementById('modalCoords').innerHTML,
                    "icon": document.getElementById('modalIconMenu').value,
                    "alt": document.getElementById('modalMessageInput').value,
                    "popup_message": document.getElementById('modalMessageInput').value,
                    "layer_group": "markz",
                    "belongs_to": userID
                },
                success: console.log("success call ajax")
            }) 
            hideModal()
        }
        if (type == "circle") {
            console.log(document.getElementById('circleFillColor').value);
            $.ajax({
                type: "POST",
                url: "/save_point",
                data: {
                    "type": document.getElementById('modalTypeMenu').value,
                    "coords": document.getElementById('modalCoords').innerHTML,
                    "icon": document.getElementById('modalIconMenu').value,
                    "alt": document.getElementById('modalMessageInput').value,
                    "color": document.getElementById('circleColor').value,
                    "fill_color": document.getElementById('circleFillColor').value,
                    "fill_opacity": document.getElementById('circleOpacity').value,
                    "radius": document.getElementById('circleRadius').value,
                    "popup_message": document.getElementById('modalMessageInput').value,
                    "layer_group": "markz",
                    "belongs_to": userID
                },
                success: console.log("success call ajax")
            })
            hideModal()
        }
    }

    if (document.getElementById('modalMessageInput').value.length == 0) {
        document.getElementById('modalMessageInput').style.border = "2px solid red";
        document.getElementById('error1').style.visibility = "visible";
    }

}

