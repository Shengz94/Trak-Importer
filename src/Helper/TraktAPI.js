

const TRAKT_API_KEY = "3f2a4833bca232c1afbb66c2a56447e7d75b44372af9d45f11cf0b907b326b92";
const TRAKT_API_SECRET = "ea9ac4d176818616f44dc3a3d643cf73569590ae0c055d2dc190023d9762ea81";
const TRAKT_DOMAIN = "https://api.trakt.tv/";
const TRAKT_SEARCH = "search/movie,show?query=";
const TRAKT_ADD = "sync/history/";
const TRAKT_REMOVE = "sync/history/remove/";
const TRAKT_AUTHORIZE = "oauth/authorize/";
const TRAKT_GET_TOKEN = "oauth/token/";
const TRAKT_USER_INFO = "users/settings/";
const TRAKT_REDIRECT_URI = "https://shengz94.github.io/trak-history-importer/";

function getAuthenticationURI(){
    return TRAKT_DOMAIN + TRAKT_AUTHORIZE + "?client_id=" + TRAKT_API_KEY 
    + "&redirect_uri=" + encodeURI(TRAKT_REDIRECT_URI) + "&response_type=code";
}

function getToken(code){
    let endpoint = TRAKT_DOMAIN + TRAKT_GET_TOKEN;
    let params = {
        headers:{
            "Content-Type": "application/json",
            "trakt-api-key": TRAKT_API_KEY,
            "trakt-api-version": "2"
        },
        body:{
            "code": code,
            "client_id": TRAKT_API_KEY,
            "client_secret": TRAKT_API_SECRET,
            "redirect_uri": TRAKT_REDIRECT_URI,
            "grant_type": "authorization_code"
        },
        method: "post"
    };

    return fetch(endpoint, params).then((response) => {
        console.log(response);
        return response.json();
    }).then((data) => {
        var result = {
            access_token: data.access_token,
            expireIn: data.expires_in,
            refreshToken: data.refresh_token,
            created_at: data.created_at
        };

        return result;
    });

}

function checkToken(){
    //check if token is stored in web storage, if not, return false
}

function searchForTitle(title){
    let endpoint = TRAKT_DOMAIN + TRAKT_SEARCH + encodeURI(title);
    let params = {
        headers:{
            "Content-Type": "application/json",
            "trakt-api-key": TRAKT_API_KEY,
            "trakt-api-version": "2"
        },
        method: "get"
    };

    return fetch(endpoint, params).then((response) => {
        return response.json();
    }).then((data) => {

        var result = [];

        data.forEach(element => {
            var current = element.type === "movie" ? element.movie : element.show;
            var entry = {
                type: element.type,
                title: current.title,
                year: current.year,
                id: current.ids.trakt,
                slug: current.ids.slug
            }
            result.push(entry);
        });

        return result;
    });
}

function addToHistory(id, type, token){
    let itemType = type + "s";
    let endpoint = TRAKT_DOMAIN + TRAKT_ADD;
    let params = {
        headers:{
            "Content-Type": "application/json",
            "trakt-api-key": TRAKT_API_KEY,
            "trakt-api-version": "2",
            "Authorization": "Bearer " + token
        },
        body:{
            [itemType]:[{
                "ids":{
                    "trakt":id
                }
            }]
        },
        method: "post"
    };

    return fetch(endpoint, params).then((response) => {
        return response.json();
    }).then((data) => {
        var result = {
            added:{
                movies: data.added.movies,
                episodes: data.added.episodes
            },
            notFound: {
                movies: [],
                shows: [],
                seasons: [],
                episodes: []
            }
        };
        data.not_found.movies.forEach(element => {
            result.notFound.movies.push(element);
        });
        data.not_found.shows.forEach(element => {
            result.notFound.shows.push(element);
        });
        data.not_found.seasons.forEach(element => {
            result.notFound.seasons.push(element);
        });
        data.not_found.episodes.forEach(element => {
            result.notFound.episodes.push(element);
        });
        return result;
    });
}

function getUserInfo(token){
    let endpoint = TRAKT_DOMAIN + TRAKT_USER_INFO;
    let params = {
        headers:{
            "Content-Type": "application/json",
            "trakt-api-key": TRAKT_API_KEY,
            "trakt-api-version": "2",
            "Authorization": "Bearer " + token
        },
        method:"get"
    };

    return fetch(endpoint, params).then((response) => {
        return response.json();
    }).then((data) => {
        var user = {
            username: data.username,
            name: data.name,
            uuid: data.ids.uuid,
            slug: data.ids.slug,
            image: data.images.avatar.full,
        }

        return user;
    });
}



export {getAuthenticationURI, getToken, searchForTitle, addToHistory, getUserInfo}