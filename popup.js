document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startTimer');
  const stopButton = document.getElementById('stopTimer');
  const minMinutesInput = document.getElementById('minMinutes');
  const maxMinutesInput = document.getElementById('maxMinutes');

  startButton.addEventListener('click', () => {
    const minMinutes = parseInt(minMinutesInput.value);
    const maxMinutes = parseInt(maxMinutesInput.value);
    
    if (minMinutes > maxMinutes) {
      alert('Minimum time cannot be greater than maximum time');
      return;
    }
    
    chrome.runtime.sendMessage({
      action: 'startTimer',
      minMinutes: minMinutes,
      maxMinutes: maxMinutes
    }, (response) => {
      if (response.status === 'Timer started') {
        console.log('Timer started with interval:', minMinutes, 'to', maxMinutes);
        
        startButton.disabled = true;
        stopButton.disabled = false;
      }
    });
  });

  stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'stopTimer'
    }, (response) => {
      if (response.status === 'Timer stopped') {
        startButton.disabled = false;
        stopButton.disabled = true;
      }
    });
  });
});