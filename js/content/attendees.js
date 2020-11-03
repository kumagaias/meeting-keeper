{
  const excludes = ['主催者']
  const selector = document.querySelectorAll('div[aria-label="ゲスト"]')[0]

  if (selector && selector.children) {
    const attendees = Array.from(selector.children)
      .filter(v => !v.ariaLabel.split(',').map(v => v.trim()).includes('不参加') && !excludes.includes(v))
      .map(v => v.ariaLabel.split(',')[0])
    chrome.runtime.sendMessage({ type: 'attendees', attendees })
  }
}
