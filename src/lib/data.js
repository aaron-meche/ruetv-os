// data.js
// by Aaron Meche

// This file exports a "db" constant
// that allows for easy and convenient
// local data storage on client browsers


import { writable } from 'svelte/store'

const app_title = "rueTV_OS_0.00"
const storage_ref = `ldb-${app_title}`

let initial_db = {
    user: {},
}

const storage = {
    read: function (location) {
        if (typeof window =="undefined") return
        return localStorage[location] || null
    },
    write: function (location, value) {
        if (typeof window =="undefined") return
        localStorage[location] = value
    },
    clear: function() {
        if (typeof window =="undefined") return
        localStorage.clear()
    },
    exists: function (location) {
		if (typeof window =="undefined") return
        if (localStorage[location])      return true
		else                             return false
	}
}

export const db = storage.exists(storage_ref) ? writable(JSON.parse(storage.read(storage_ref))) : writable(initial_db)
export const time = writable(null)
export const date = writable(null)
export const sysobj = writable({
    boot: {
        auto: true,
        allow: true,
        active: false,
    },
    notifs: []
})
export const ui = writable({
    active_wallpaper: 0,
    wallpapers: [
        "Castle", 
        "Autumn",
        "Hill",
        "Marsh",
        "Ship",
        "Wilderness",
        "RollingHills",
        "WaterCastle",
        "Canal",
        "DramaticWaterside",
        "WaterWar",
        "WhiteHouse"
    ]
})
export const cmd = writable(null)
export const error = writable(null)
export const result = writable(null)
export function throwError(errorToThrow) {
    error.update(err => {
        if (!err) err = []
        if (err.length >= 25) err = []
        err.push(errorToThrow)
        return err
    })
}
export function throwResult(resultToThrow) {
    result.update(result => {
        if (!result) result = []
        if (result.length >= 25) result = []
        result.push(resultToThrow)
        return result
    })
}

function formatDate() {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    })
}

function formatTime() {
    const now = new Date()
    return {
        hours: String(now.getHours() % 12), 
        minutes: String(now.getMinutes()).padStart(2, "0") 
    }
}

export function startClock() {
    let currTime = formatTime()
    let timeString = (currTime.hours == 0 ? 12 : currTime.hours) + ":" + currTime.minutes
    time.set(timeString)
    date.set(formatDate())
    const interval = setInterval(() => {
        let currTime = formatTime()
        let timeString = (currTime.hours == 0 ? 12 : currTime.hours) + ":" + currTime.minutes
        time.set(timeString)
        date.set(formatDate())
    }, 1000)
    return () => clearInterval(interval)
}

export const clearDB = () => {
    db.update(data => {
        data = initial_db
        return data
    })
    console.log("Cleared db")
}

db.subscribe(db => {
    let data
    if (Object.keys(db) == undefined) {
        data = initial_db
        console.error("Database Fault")
        alert("Database Fault Detected: Restart & Reload")
    }
    else {
        data = JSON.stringify(db)
    }
    storage.write(storage_ref, data)
})