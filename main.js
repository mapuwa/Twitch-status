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


function makeItem(heading, success, url, desc, image) {
    var item = document.createElement('li');
    if (success) item.classList.add("streamer-active");

    var itemImage = document.createElement('img');
    itemImage.src = image;
    item.appendChild(itemImage);


    var itemHeading = document.createElement('h2');
    if (url) {
        var itemHeadingAnchor = document.createElement('a');
        itemHeadingAnchor.appendChild(document.createTextNode(heading));
        itemHeadingAnchor.href = url;
        itemHeading.appendChild(itemHeadingAnchor);
    }
    else
        itemHeading.appendChild(document.createTextNode(heading));
    item.appendChild(itemHeading);

    var itemDescription = document.createElement('p');
    itemDescription.appendChild(document.createTextNode(desc));
    item.appendChild(itemDescription);
    return item;
}

function getStatus(name, cl) {
    function error(){
        cl({
            name: name,
            success: false,
            desc: "Account closed",
            logo: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png",
            url: null
        });
    }
    getJSON("https://api.twitch.tv/kraken/streams/" + name, function (res) {
        getJSON("https://api.twitch.tv/kraken/channels/" + name, function (res2) {
            cl({
                name: name,
                success: res.stream ? true : false,
                desc: res.stream ? res.stream.channel.game + " " + res.stream.channel.status : "Offline",
                logo: res2.logo,
                url: res2.url
            });
        }, error)
    }, error);
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
var results = [];
for (var i = 0; i < arr.length; i++) {
    getStatus(arr[i], function (r) {
        results.push(r);
        if (results.length == arr.length) {
            results.sort(function (a, b) { return !a.success; });
            for (var j = 0; j < results.length; j++)
                document.getElementById("streamers").appendChild(makeItem(results[j].name, results[j].success,
                                                                    results[j].url,  results[j].desc, results[j].logo));
        }
    });
}