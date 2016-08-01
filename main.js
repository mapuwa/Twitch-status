/**
 * Send GET request on the url a call function with parsed JSON or with error
 * @param url url with JSON
 * @param cl function, which is called with parsed JSON
 * @param err function, which is called, when error occurs.
 */
function getJSON(url, cl, err){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (oEvent) {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200)
                cl(JSON.parse(xhttp.responseText));
            else
                err("Error", xhttp.statusText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}


function makeItem(heading, success, desc) {
    var item = document.createElement('li');
    if (success)
        item.classList.add("streamer-active");
    var itemHeading = document.createElement('h2');
    var itemHeadingAnchor = document.createElement('a');
    itemHeadingAnchor.appendChild(document.createTextNode(heading));
    itemHeadingAnchor.href = "https://www.twitch.tv/" + heading;
    itemHeading.appendChild(itemHeadingAnchor);

    var itemDescription = document.createElement('p');
    itemDescription.appendChild(document.createTextNode(desc));

    item.appendChild(itemHeading);
    item.appendChild(itemDescription);
    return item;
}

function getStatus(name, cl) {
    getJSON("https://api.twitch.tv/kraken/streams/" + name, function (res) {
        console.log(res);
        cl({
            name: name,
            success: true,
            desc: "offline"
        });
    }, function () {
        cl({
            name: name,
            success: false,
            desc: "Offline"
        });
    })
}
var arr = [
    "comster404",
    "brunofin",
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
];
for (var i = 0; i < arr.length; i++) {
    getStatus(arr[i], function (r) {
        document.getElementById("streamers").appendChild(makeItem(r.name, r.success, r.desc));
    });
}