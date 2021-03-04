const TRAKT_API_KEY = "3f2a4833bca232c1afbb66c2a56447e7d75b44372af9d45f11cf0b907b326b92";
const TRAKT_API_SECRET = "ea9ac4d176818616f44dc3a3d643cf73569590ae0c055d2dc190023d9762ea81";
const PROXY_DOMAIN = "https://shrouded-savannah-10975.herokuapp.com/";
const TRAKT_DOMAIN = "https://api.trakt.tv/";
const TRAKT_SEARCH = "search/movie,show?query=";
const TRAKT_ADD = "sync/history/";
const TRAKT_REMOVE = "sync/history/remove/";
const TRAKT_AUTHORIZE = "oauth/authorize/";
const TRAKT_GET_TOKEN = "oauth/token/";
const TRAKT_REVOKE_TOKEN = "oauth/revoke/";
const TRAKT_USER_INFO = "users/settings/";
const TRAKT_REDIRECT_URI = "https://shengz94.github.io/Trakt-Importer/";
const TRAKT_REDIRECT_URI_DEBUG = "http://localhost:3000/";

function getAuthenticationURI(){
    return TRAKT_DOMAIN + TRAKT_AUTHORIZE + "?client_id=" + TRAKT_API_KEY 
    + "&redirect_uri=" + encodeURI(TRAKT_REDIRECT_URI) + "&response_type=code";
}

function getToken(code){
    let endpoint = PROXY_DOMAIN + TRAKT_DOMAIN + TRAKT_GET_TOKEN;

    const body = new URLSearchParams();
    body.append("code", code);
    body.append("client_id", TRAKT_API_KEY);
    body.append("client_secret", TRAKT_API_SECRET);
    body.append("redirect_uri", TRAKT_REDIRECT_URI);
    body.append("grant_type", "authorization_code");
    let params = {
        header:{
            "Content-Type": "application/json"
        },
        body: body,
        method: "post"
    };
    return fetch(endpoint, params).then((response) => {
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

function revokeToken(token){
    let endpoint = PROXY_DOMAIN + TRAKT_DOMAIN + TRAKT_REVOKE_TOKEN;

    const body = new URLSearchParams();
    body.append("token", token);
    body.append("client_id", TRAKT_API_KEY);
    body.append("client_secret", TRAKT_API_SECRET);
    let params = {
        header:{
            "Content-Type": "application/json"
        },
        body: body,
        method: "post"
    };
    return fetch(endpoint, params).then((response) => {
        return response.json();
    });
}

function searchForTitle(title){
    let endpoint = PROXY_DOMAIN + TRAKT_DOMAIN + TRAKT_SEARCH + encodeURI(title);
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

function addToHistory(movies, shows, token){
    let endpoint = PROXY_DOMAIN + TRAKT_DOMAIN + TRAKT_ADD;

    const item = {
        "movies": movies,
        "shows": shows
    };
    let params = {
        headers:{
            "Content-Type": "application/json",
            "trakt-api-key": TRAKT_API_KEY,
            "trakt-api-version": "2",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(item),
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
    let endpoint = PROXY_DOMAIN + TRAKT_DOMAIN + TRAKT_USER_INFO;
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
            username: data.user.username,
            name: data.user.name,
            uuid: data.user.ids.uuid,
            slug: data.user.ids.slug,
            image: data.user.images.avatar.full,
        }
        
        return user;
    });
}



export {getAuthenticationURI, getToken, revokeToken, searchForTitle, addToHistory, getUserInfo}