#!/bin/bash
request(){
  data=(
    '{"id":1,"start":"2020-10-10T20:20:00.000Z", "end":"2020-10-10T20:30:00.000Z",
    "createdAt":"2020-09-02 14:23:12", "updatedAt":"2020-09-28 14:23:12"}'
    '{"id":2,"start":"2019-10-10T20:20:00.000Z", "end":"2020-10-10T20:30:00.000Z",
    "createdAt":"2018-10-02 16:23:12", "updatedAt":"2020-09-28 14:23:12"}'
    '{"id":3,"start":"2020-10-10T20:25:00.000Z", "end":"2020-10-10T20:35:00.000Z",
    "createdAt":"2020-10-01 13:23:12", "updatedAt":"2020-09-28 14:23:12"}'
    '{"id":4,"start":"2020-10-11T10:00:00.000Z", "end":"2020-10-11T11:30:00.000Z",
    "createdAt":"2020-10-01 11:23:12", "updatedAt":"2020-09-28 14:23:12"}'
    '{"id":5,"start":"2020-10-12T11:27:00.000Z", "end":"2020-10-10T12:27:00.000Z",
    "createdAt":"2020-09-11 10:23:12", "updatedAt":"2020-09-28 14:23:12"}'
    '{"id":6,"start":"2020-10-12T12:00:00.000Z", "end":"2020-10-12T13:30:00.000Z",
    "createdAt":"2020-08-02 13:23:12", "updatedAt":"2020-09-28 14:23:12"}'
    '{"id":1,"start":"2020-10-17T14:40:00.000Z", "end":"2020-10-17T15:30:00.000Z",
    "createdAt":"2020-03-02 19:23:12", "updatedAt":"2020-09-28 14:24:12"}'
  )
  random_data=${data[($RANDOM % ${#data[@]})]}
  response=$(curl --header "Content-Type: application/json" \
  --request POST \
  --data "$random_data" \
  -w "%{http_code}" \
  --silent \
  --output /dev/null \
  http://localhost:3000/api/appointments)
  echo "request:" $random_data "->" $response
}
export -f request
seq 1 ${1:-100} | xargs -n1 -P10 bash -c 'request'