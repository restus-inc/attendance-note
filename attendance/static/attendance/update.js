'use strict';

function toSecond(hour, minute, second) {
  if ((!hour && hour !== 0)
  || (!minute && minute !== 0)
  || (!second && second !== 0)
  || hour === null
  || minute === null
  || second === null
  || typeof hour === 'boolean'
  || typeof minute === 'boolean'
  || typeof second === 'boolean'
  || Number.isNaN(hour)
  || Number.isNaN(minute)
  || Number.isNaN(second)) return '';

  return (Number(hour) * 60 * 60) + (Number(minute) * 60) + Number(second);
}

function paddingZero(n) {
  return `${(n < 10) ? '0' : ''}${n}`;
}

function toTimeFormat(fullSecond) {
  if ((!fullSecond && fullSecond !== 0) || !String(fullSecond).match(/^[-]?[0-9][0-9]*?$/)) {
    return '00:00';
  }
  let hour = Math.floor(Math.abs(fullSecond) / 3600);
  let minute = Math.floor((Math.abs(fullSecond) % 3600) / 60);

  hour = paddingZero(hour);
  minute = paddingZero(minute);

  return `${(fullSecond < 0) ? '-' : ''}${hour}:${minute}`;
}

document.addEventListener('DOMContentLoaded', (evt) => {
  const inputTimes = document.querySelectorAll('div.div_body input[type="time"]');
  for (let i = 0; i < inputTimes.length; i += 1) {
    if (inputTimes[i]) {
      const id = inputTimes[i].id.match(/\d+/g);
      inputTimes[i].addEventListener('change', (e) => {
        // 開始時間
        let times = document.getElementById(`stt_time${id}`).value.split(':');
        const st = toSecond(times[0], times[1], 0);

        // 終了時間
        times = document.getElementById(`end_time${id}`).value.split(':');
        const ed = toSecond(times[0], times[1], 0);

        // 休憩時間
        times = document.getElementById(`break_time${id}`).value.split(':');
        const br = toSecond(times[0], times[1], 0);

        // 稼働時間
        times = document.getElementById(`op_time${id}`).innerHTML.split(':');
        const oldOp = toSecond(times[0], times[1], 0);

        // 合計時間
        times = document.getElementById('total_time').innerHTML.split(':');
        const total = toSecond(times[0], times[1], 0);

        let newOp = 0;
        if (st === '' || ed === '' || br === '') {
          newOp = 0;
        } else {
          if (st > ed) {
            newOp = 60 * 60 * 24;
          }
          newOp = newOp + ed - st - br;
        }

        document.getElementById(`op_time${id}`).innerHTML = toTimeFormat(newOp);

        document.getElementById('total_time').innerHTML = toTimeFormat(total - oldOp + newOp);
      }, false);
    }
  }
}, false);
