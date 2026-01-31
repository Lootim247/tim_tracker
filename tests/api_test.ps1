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
                device_id = "tpanilai@gmail.com"
                wifi = ""
            }
        }
    )
} | ConvertTo-Json -Depth 10


$headers = @{
    "Authorization" = "Bearer tt-bsZh-fnwa-t8Y0-etFb-Y4MW"
    "Content-Type" = "application/json"
    "user-agent" = 'Overland/1.3 (iPhone; iOS 26.2; Scale/3.00)'
}

$body2 = @{
        _type = 'location'
        created_at = 1769852570
        lon = 114.2640707
        lat = 22.3380551
} | ConvertTo-Json


$headers2 = @{
    "authorization" = "Basic dHBhbmlsYWlAZ21haWwuY29tOnR0LXFHSTgtaEhPWC1qN3FHLXM5U04tTXUwYQ=="
    "user-agent" = 'Owntracks-Android/gms/420505020'
    "Content-Type" = "application/json"
    "php-auth-user" = "tpanilai@gmail.com"
    "php-auth-pw" = "tt-bsZh-fnwa-t8Y0-etFb-Y4MW"
}


# Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/upload-location" -Method POST -Body $body -Headers $headers
Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/upload-location" -Method POST -Body $body2 -Headers $headers2