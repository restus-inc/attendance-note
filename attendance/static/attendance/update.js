'use strict';

document.addEventListener('DOMContentLoaded', (evt) => {
  const toSecond = (hour, minute, second) => {
    if (hour === '' || minute === '' || second === '') return '';

    return (Number(hour) * 60 * 60) + (Number(minute) * 60) + Number(second);
  };

  const paddingZero = (n) => {
    const result = `${(n < 10) ? '0' : ''}${n}`;
    return result;
  };

  const toTimeFormat = (fullSecond) => {
    const sec = Number(fullSecond);
    const hour = Math.floor(Math.abs(sec) / 3600);
    const minute = Math.floor((Math.abs(sec) % 3600) / 60);

    return `${(fullSecond < 0) ? '-' : ''}${paddingZero(hour)}:${paddingZero(minute)}`;
  };

  const inputTimes = document.querySelectorAll('div.div_body input[type="time"]');

  for (const inputTime of inputTimes) {
    if (inputTime) {
      const id = inputTime.id.match(/\d+/g);
      inputTime.addEventListener('change', (e) => {
        // 開始時間
        const wkSt = document.getElementById(`stt_time${id}`).value.split(':');
        const st = toSecond(wkSt[0], wkSt[1], 0);

        // 終了時間
        const wkEd = document.getElementById(`end_time${id}`).value.split(':');
        const ed = toSecond(wkEd[0], wkEd[1], 0);

        // 休憩時間
        const wkBr = document.getElementById(`break_time${id}`).value.split(':');
        const br = toSecond(wkBr[0], wkBr[1], 0);

        // 稼働時間
        const wkOldOp = document.getElementById(`op_time${id}`).innerHTML.split(':');
        const oldOp = toSecond(wkOldOp[0], wkOldOp[1], 0);

        // 合計時間
        const wkTotal = document.getElementById('total_time').innerHTML.split(':');
        const total = toSecond(wkTotal[0], wkTotal[1], 0);

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
