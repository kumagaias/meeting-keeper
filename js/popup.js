const attendeesArea = document.getElementById("attendeesArea")
const attendeesCount = document.getElementById("attendeesCount")
const updateAttendeesButton = document.getElementById("updateAttendeesButton")

const roleClass = document.getElementsByClassName('role')
const rolesArea = document.getElementById("rolesArea")
const addRoleButton = document.getElementById("addRoleButton")
const decideRoleButton = document.getElementById("decideRoleButton")

const timerArea = document.getElementById("timerArea")
const timerButton = document.getElementById("timerButton")
const resetTimerButton = document.getElementById("resetTimerButton")

const checkinArea = document.getElementById("checkinArea")
const decideCheckinButton = document.getElementById("decideCheckinButton")

const roles = ['司会', '書記', 'ファシリテーター', 'タイムキーパー', 'その他']
let attendees = []
let time
let timeoutId
let inProgressTimer = false

const updateAttendees = () => {
  if (attendeesArea.value) {
    attendees = attendeesArea.value.split(',').map(v => v.trim())
  } else {
    attendees = chrome.extension.getBackgroundPage().attendees
    attendeesArea.value = attendees.join(',')
  }
  attendeesCount.innerHTML = `${attendees.length} 人`
}

const addRole = (roleIndex = 0) => {
  const roleCount = roleClass.length
  let html = '<div><select>'
  roles.forEach((role, index) => html += `<option ${roleIndex === index ? 'selected' : ''}>${role}</option>`)
  html += '</select>'
  html += `<input type="text" id="user${roleCount}" class="role"></div>`
  rolesArea.innerHTML += html
}

const shuffleAttendees = () => {
  for (let i = attendees.length - 1; i > 0; i --) {
    let randomIndex = Math.floor(Math.random() * (i + 1))
    let temp = attendees[i]
    attendees[i] = attendees[randomIndex]
    attendees[randomIndex] = temp 
  }
}

const decideRole = () => {
  shuffleAttendees()
  // roles
  if (attendees.length === 0) return
  for (let i = 0; i < roleClass.length; i++ ) {
    if (attendees[i]) {
      document.getElementById(`user${i}`).value = attendees[i]
    } else {
      let randomIndex = Math.floor(Math.random() * attendees.length)
      document.getElementById(`user${i}`).value = attendees[randomIndex]
    }
  }
}

const decideCheckin = () => {
  shuffleAttendees()
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET","../resources/checkins.txt", true);
  xmlHttp.onreadystatechange = () => {
    const checkins = xmlHttp.responseText.split(/\n/)
    const index = Math.floor(Math.random() * (checkins.length -1))
    checkinArea.innerHTML = `テーマ: ${checkins[index]}\n\n`
    checkinArea.innerHTML += attendees.join(":\n") + ':'
  }
  xmlHttp.send();
}

const startTimer = () => {
  const day = new Date(time - Date.now())
  const minutes = String(day.getMinutes()).padStart(2, '0')
  const seconds = String(day.getSeconds()).padStart(2, '0')
  timerArea.value = `${minutes}:${seconds}`
  timeoutId = setTimeout(() => {
    startTimer ()
  }, 100)
}
const pushTimer = () => {
  if (inProgressTimer) {
    inProgressTimer = false
    clearTimeout(timeoutId)
    timerButton.innerText = 'スタート'
    timerButton.className = 'primary large'
  } else {
    inProgressTimer = true
    const inputs = timerArea.value.split(':')
    let date = new Date()
    time = date.setMinutes(
      date.getMinutes() + Number(inputs[0]),
      date.getSeconds() +Number(inputs[1]) 
    )
    startTimer()
    timerButton.innerText = 'ストップ'
    timerButton.className = 'secondary large'
  }
}
const resetTimer = () => {
  clearTimeout(timeoutId)
  timerArea.value = '10:00'
}

updateAttendeesButton.addEventListener('click', updateAttendees)
timerButton.addEventListener('click', pushTimer)
resetTimerButton.addEventListener('click', resetTimer)
decideRoleButton.addEventListener('click', decideRole)
addRoleButton.addEventListener('click', addRole)
decideCheckinButton.addEventListener('click', decideCheckin)

addRole(0)
addRole(1)
updateAttendees()
decideRole()
