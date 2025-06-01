// Function to reload the target tab
async function reloadTargetTab() {
  const tabs = await chrome.tabs.query({
    url: "https://www.upwork.com/nx/find-work/most-recent"
  });
  
  if (tabs.length > 0) {
    chrome.tabs.reload(tabs[0].id);
  }
}

// Function to get random interval between min and max minutes
function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min) * 60; // Convert to seconds
}

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'reloadAlarm') {
    reloadTargetTab();
    
    chrome.storage.local.get(['minMinutes', 'maxMinutes'], (result) => {
      const min = parseInt(result.minMinutes || '1');
      const max = parseInt(result.maxMinutes || '5');
    
      const nextInterval = getRandomInterval(min, max);
      console.log('Next interval:', nextInterval);
      
      chrome.alarms.create('reloadAlarm', {
        delayInMinutes: nextInterval / 60
      });
    });
    
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {

    // Store the time window values
    chrome.storage.local.set({
      minMinutes: request.minMinutes,
      maxMinutes: request.maxMinutes
    });

    // Start the initial alarm
    const initialInterval = getRandomInterval(request.minMinutes, request.maxMinutes);
    chrome.alarms.create('reloadAlarm', {
      delayInMinutes: initialInterval / 60
    });
    
    console.log('Alarm set for:', initialInterval, 'seconds');
    sendResponse({ status: 'Timer started' });
  } else if (request.action === 'stopTimer') {
    chrome.alarms.clear('reloadAlarm');
    sendResponse({ status: 'Timer stopped' });
  }
  return true;
});