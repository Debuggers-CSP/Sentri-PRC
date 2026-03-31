// ^^ Do not remove the above front matter, it is required for Jekyll processing

// export const baseurl = "{{ site.baseurl }}";
export const baseurl = ""; 

export var pythonURI;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    pythonURI = "http://localhost:8323";  // Same URI for localhost or 127.0.0.1
} else {
    pythonURI = "https://sentri.opencodingsociety.com";

}

export var javaURI;
// 127.0.0.1:8585 does not work for some machines
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        javaURI = "http://localhost:8585";
} else {
    javaURI = "https://spring.opencodingsociety.com";
}

/** @type {RequestInit} */
export const fetchOptions = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'X-Origin': 'client'
    },
};
// User Login Function (allows both GET and POST)
export function login(options) {
    // Modify the options to use the correct method and include the request body
    const requestOptions  = {
        ...fetchOptions,  // Spread the existing fetchOptions object
        method: options.method || 'POST',  // Dynamically set the method (default to POST)
        body: options.method === 'POST' ? JSON.stringify(options.body) : undefined  // Only add body for POST requests
    };

    // Clear the message area
    document.getElementById(options.message).textContent = "";

    // Fetch JWT from the server
    fetch(options.URL, requestOptions)
    .then(response => {
        // Trap error response from the Web API
        if (!response.ok) {
            const errorMsg = 'Login error: ' + response.status;
            console.log(errorMsg);
            document.getElementById(options.message).textContent = errorMsg;
            return response;  // Exit early if response is not OK
        }
        // Success: Proceed with callback
        options.callback();
    })
    .catch(error => {
        // Handle network errors
        console.log('Possible CORS or Service Down error: ' + error);
        document.getElementById(options.message).textContent = 'Possible CORS or service down error: ' + error;
    });
}
