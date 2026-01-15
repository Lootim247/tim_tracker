$body = @{
    locations = @(
        @{
            type = "Feature"
            geometry = @{
                type = "Point"
                coordinates = @(-122.030581, 37.331800)
            }
            properties = @{
                timestamp = "2015-10-01T08:00:00-07:00"
                altitude = 0
                speed = 4
                horizontal_accuracy = 30
                vertical_accuracy = -1
                motion = @("driving","stationary")
                pauses = $false
                activity = "other_navigation"
                desired_accuracy = 100
                deferred = 1000
                significant_change = "disabled"
                locations_in_payload = 1
                battery_state = "charging"
                battery_level = 0.80
                device_id = "tpanilai@tufts.edu"
                wifi = ""
            }
        }
    )
} | ConvertTo-Json -Depth 10


$headers = @{
    "Authorization" = "Bearer tt-g1Ww-I5pX-dHNp-za3X-Yfas"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/location_end" -Method POST -Body $body -Headers $headers
