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


# $headers = @{
#     "Authorization" = "Bearer tt-bsZh-fnwa-t8Y0-etFb-Y4MW"
#     "Content-Type" = "application/json"
#     "user-agent" = 'Overland/1.3 (iPhone; iOS 26.2; Scale/3.00)'
# }

# $headers = @{
#   "accept-encoding" = "gzip, deflate, br"
#   "authorization" = "Basic dXNlcjpwYXNz"
#   "accept-language" = "en-US,en;q=0.9"
#   "accept" = "*/*"
#   "x-limit-u" = "user"
#   "x-limit-d" = "1EECC57A-21BB-4178-8B07-8FFAD85E4950"
#   "host" = "webhook.site"
#   "php-auth-user" = "tpanilai@gmail.com"
#   "php-auth-pw" = "tt-4U20-RXzt-iIHI-tCXY-vJrs"
# }

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
    "php-auth-pw" = "tt-4U20-RXzt-iIHI-tCXY-vJrs"
}


# Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/upload-location" -Method POST -Body $body -Headers $headers
# Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/upload-location" -Method POST -Body $body2 -Headers $headers2

# Invoke-RestMethod -Uri "https://webhook.site/bb9e2571-7863-4060-830c-c770addbaa87" -Method POST -Body $body2 -Headers $headers2


# $response = Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/upload-location" `
#     -Method POST `
#     -Headers $headers `
#     -ContentType "application/json" `
#     -UserAgent "OwnTracks/26.1.1 CFNetwork/3860.400.51 Darwin/25.3.0" `
#     -Body "{`"batt`":44,`"lon`":114.264064,`"acc`":5,`"bs`":1,`"inrids`":[],`"p`":99.929000000000002,`"vac`":30,`"inregions`":[],`"lat`":22.338028999999999,`"topic`":`"owntracks\/user\/1EECC57A-21BB-4178-8B07-8FFAD85E4950`",`"t`":`"u`",`"conn`":`"w`",`"m`":1,`"tst`":1771843935,`"alt`":121,`"_type`":`"location`",`"tid`":`"50`"}"

$headers = @{
  "accept-encoding" = "gzip"
  "host" = "webhook.site"
  "x-limit-d" = "spinel"
  "x-limit-u" = "tpanilai@gmail.com"
  "authorization" = "Basic dHBhbmlsYWlAZ21haWwuY29tOnR0LTRVMjAtUlh6dC1pbEhJLXRDWFktdkpycw=="
  "php-auth-user" = "tpanilai@gmail.com"
  "php-auth-pw" = "tt-4U20-RXzt-ilHI-tCXY-vJrs"
}
$response = Invoke-WebRequest -Uri "https://webhook.site/bb9e2571-7863-4060-830c-c770addbaa87" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json; charset=utf-8" `
    -UserAgent "Owntracks-Android/gms/420505020" `
    -Body "{`"_type`":`"location`",`"BSSID`":`"54:8a:ba:dc:00:cc`",`"SSID`":`"eduroam`",`"_id`":`"01bf68b1`",`"acc`":13,`"alt`":120,`"batt`":84,`"bs`":1,`"cog`":210,`"conn`":`"w`",`"created_at`":1771844828,`"lat`":22.3381546,`"lon`":114.2640373,`"m`":2,`"source`":`"fused`",`"tid`":`"el`",`"topic`":`"owntracks/tpanilai@gmail.com/spinel`",`"tst`":1771844828,`"vac`":1,`"vel`":0}"