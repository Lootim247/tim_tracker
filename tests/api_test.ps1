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
#   "accept-encoding" = "gzip, deflate, br"
#   "authorization" = "Basic dHBhbmlsYWlAZ21haWwuY29tOnR0LVRBTG4tcEFSTy1wVE5SLWxmWTMtN29BUA=="
#   "accept-language" = "en-US,en;q=0.9"
#   "accept" = "*/*"
#   "x-limit-u" = "tpanilai@gmail.com"
#   "x-limit-d" = "1EECC57A-21BB-4178-8B07-8FFAD85E4950"
#   "host" = "webhook.site"
#   "php-auth-user" = "tpanilai@gmail.com"
#   "php-auth-pw" = "tt-TALn-pARO-pTNR-lfY3-7oAP"
# }
# $response = Invoke-WebRequest -Uri "http://localhost:3000/tim-tracker/api/upload-location" `
#     -Method POST `
#     -Headers $headers `
#     -ContentType "application/json" `
#     -UserAgent "OwnTracks/26.1.1 CFNetwork/3860.400.51 Darwin/25.3.0" `
#     -Body "{`"batt`":64,`"lon`":114.26387200000001,`"acc`":10,`"bs`":1,`"inrids`":[],`"created_at`":1771914406,`"p`":99.676000000000002,`"vac`":30,`"inregions`":[],`"lat`":22.336221999999999,`"topic`":`"owntracks\/tpanilai@gmail.com\/1EECC57A-21BB-4178-8B07-8FFAD85E4950`",`"t`":`"u`",`"motionactivities`":[`"stationary`"],`"conn`":`"w`",`"m`":1,`"tst`":1771914402,`"alt`":161,`"_type`":`"location`",`"tid`":`"50`"}"


# Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/upload-location" -Method POST -Body $body -Headers $headers
# Invoke-RestMethod -Uri "http://localhost:3000/tim-tracker/api/upload-location" -Method POST -Body $body2 -Headers $headers2

# Invoke-RestMethod -Uri "https://webhook.site/bb9e2571-7863-4060-830c-c770addbaa87" -Method POST -Body $body2 -Headers $headers2