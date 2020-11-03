var attendees = []

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'parent',
    title: 'ミーティングキーパー'
  })
})
chrome.contextMenus.onClicked.addListener(item => {
  if (item.menuItemId === 'parent') {
    chrome.tabs.executeScript({
      file: 'js/content/attendees.js'
    })
  } else if (item.menuItemId === 'checkin') {
    chrome.tabs.executeScript({
      file: 'js/content/attendees.js'
    })
  }
})
chrome.runtime.onMessage.addListener(data => {
  if (data.type === 'attendees') {
    chrome.windows.create({
      url: '../html/popup.html',
      // active: true,
      type: 'popup',
      width: 600,
      height: 800,
    })
    attendees = data.attendees
  }
  return
})
