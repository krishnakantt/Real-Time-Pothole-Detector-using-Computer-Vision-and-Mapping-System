function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    fetch("https:", 
        {method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })

    })
    .then(response => response.json())
    .then(data => console.log(data));
    
}