// DATA
const playlistApiUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
const videoApiUrl = "https://www.googleapis.com/youtube/v3/videos";
const apikey = "AIzaSyAFZVgTwGLEUdasbd7_HaYfXhLzhwPiWpI";

var playlist_items = [];
var video_items = [];
var video_ids = [];

// PLAYLIST FETCH
var playlistId = "PLQs4oF46hBG8tkvmM9O5r956nrDTKUwWi";


function getPlaylistUrl(pageToken) {
    let params = [
        "part=snippet,contentDetails",
        "maxResults=50",
        "playlistId=" + playlistId,
        "pageToken=" + pageToken,
        "key=" + apikey
    ];
    return playlistApiUrl + "?" + params.join("&");
}

function fetchPlaylist(pageToken = "") {
    fetch(getPlaylistUrl(pageToken)).then(res => {
        return res.json()
    }).then(res => {
        if (res.error) {
            console.error(res.error);
        } else {
            playlistResponseHandler(res);
        };
    });
}

function playlistResponseHandler(response) {
    if (response.items) {
        let items = response.items;
        let ic = items.length;
        for (let i = 0; i < ic; i++) {
            let item = items[i];
            playlist_items.push(item);
        };
    };

    if (response.nextPageToken)
        fetchPlaylist(response.nextPageToken);
    else playlistFetchFinished();
}

function fetch_playlist() {
    playlist_items = [];
    video_items = [];
    video_ids = [];
    fetchPlaylist();
}

function playlistFetchFinished() {
    let ic = playlist_items.length;
    for (let i = 0; i < ic; i++) {
        let item = playlist_items[i];
        video_ids.push(item.snippet.resourceId.videoId);
    };

    fetchVideos();
}

// VIDEO FETCH

function getVideoUrl(videoId) {
    let params = [
        "part=snippet,statistics",
        "id=" + videoId,
        "key=" + apikey
    ];
    return videoApiUrl + "?" + params.join("&");
}

function fetchVideos() {
    fetchVideo(video_ids[video_ids.length-1]);
}

function fetchVideo(videoId) {
    fetch(getVideoUrl(videoId)).then(res => {
        return res.json();
    }).then(data => {
        video_items.push(data);

        if (video_ids.length-1 >= 0) {
            video_ids.pop();
            fetchVideo(video_ids[video_ids.length-1]);
        } else {
            videosFetchFinished();
        }
    });
}

function videosFetchFinished() {
    console.log(playlist_items);
    console.log(video_items);

    document.body.querySelector("div#body > div#loading").style.display = "none";

    let list = document.body.querySelector("div#body > div#list");
    let desc = document.body.querySelector("div#body > pre#description");

    if (video_items.length < 1) return

    for (let i = 0; i < video_items.length - 1; i++) {
        let vid = list.children[0].cloneNode(true);
        let v = video_items[i].items[0];
        vid.querySelector("iframe.embed").src = "https://youtube.com/embed/" + v.id;
        vid.querySelector("div.title > span").textContent = v.snippet.title;
        vid.querySelector("div.stats > div.views > span:nth-child(1)").textContent = v.statistics.viewCount;
        vid.querySelector("div.stats > div.likes > span:nth-child(1)").textContent = v.statistics.likeCount;
        vid.querySelector("div.stats > div.published_at > span:nth-child(2)").textContent = v.snippet.publishedAt;
        vid.querySelector("pre.description").textContent = v.snippet.description;

        vid.onmouseenter = (e) => {desc.textContent = v.snippet.description;};

        list.appendChild(vid);
    }

}

fetchPlaylist();