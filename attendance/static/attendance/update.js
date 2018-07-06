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

  const changeProjButton = (btn) => {
    const registButton = btn;
    const id = registButton.id.match(/\d+/g);

    let linePjName = '';
    let lineHour = 0;

    for (const row of document.querySelectorAll('.dialog_table_tr')) {
      if (row && row.dataset.name === `dt_tr_${id}`) {
        const chkPj = row.querySelector('.proj_code');
        const chkHour = row.querySelector('.proj_hour');

        if (chkPj && chkHour && chkPj.value !== '') {
          lineHour += Number(chkHour.value);
          linePjName += linePjName.length > 0 ? ',' : '';
          linePjName += `${chkPj.options[chkPj.selectedIndex].text}(${Number(chkHour.value)}h)`;
        }
      }
    }
    // 秒数に変換しチェック
    lineHour *= 3600;
    const time = document.getElementById(`op_time${id}`).innerHTML.split(':');
    const sec = toSecond(time[0], time[1], 0);
    // 稼働時間と工数によってボタンイメージをを変更する。
    if (lineHour === sec) {
      registButton.setAttribute('class', 'dtil_btn_match');
    } else {
      registButton.setAttribute('class', 'dtil_btn_unmatch');
    }
    // 印刷用の工数ラベルを設定
    document.getElementById(`personhoursLabel${id}`).innerHTML = linePjName;
  };

  for (const pjButton of document.querySelectorAll('.tab_detail button')) {
    changeProjButton(pjButton);
  }

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
            newOp = 60 * 60 * 24; // 1日加算する
          }
          newOp = newOp + ed - st - br;
        }

        document.getElementById(`op_time${id}`).innerHTML = toTimeFormat(newOp);

        document.getElementById('total_time').innerHTML = toTimeFormat(total - oldOp + newOp);

        const pjButton = document.getElementById(`registButton${id}`);
        changeProjButton(pjButton);
      }, false);
    }
  }

  // 工数登録
  const openButtons = document.querySelectorAll('div.div_body button');
  const wkTbl = document.querySelector('.wkTable');

  const dialog = document.querySelector('dialog');
  const dialogMsgLabel = dialog.querySelector('.message');
  const dialogBody = dialog.querySelector('.dialog_body');
  const dialogTable = dialogBody.querySelector('.dialog_table');
  const projLine = dialogTable.querySelector('.dialog_table_tr');
  const projLineBase = projLine.cloneNode(true);
  projLine.remove();

  for (const openButton of openButtons) {
    if (openButton) {
      const id = openButton.id.match(/\d+/g);

      openButton.addEventListener('click', (e) => {
        // 初期値(ヘッダ)
        dialogMsgLabel.innerHTML = '';

        const tDate = document.getElementById(`date${id}`).innerHTML;
        document.getElementById('target_Date').innerHTML = tDate;

        const optime = document.getElementById(`op_time${id}`).innerHTML;
        document.getElementById('operation_time').innerHTML = optime;

        // 初期値（明細）
        const pjLines = wkTbl.querySelectorAll('.dialog_table_tr');
        const totalLabel = dialogTable.querySelector('input[name="TotalHour"]');

        let isExists = false;
        let totalHour = 0;

        for (const pjLine of pjLines) {
          if (pjLine && pjLine.dataset.name === `dt_tr_${id}`) {
            const hour = pjLine.querySelector('.proj_hour');
            if (hour) {
              totalHour += Number(hour.value);
            }

            dialogTable.append(pjLine);
            isExists = true;
          }
        }
        if (!isExists) {
          const item = projLineBase.cloneNode(true);
          dialogTable.append(item);
        }

        if (totalLabel) {
          totalLabel.value = totalHour;
        }

        // 合計時間の設定用
        const inps = dialogTable.querySelectorAll('.proj_hour');
        for (const inp of inps) {
          if (inp) {
            inp.addEventListener('focus', () => {
              inp.setAttribute('data-insert-before', inp.value);
            }, true);

            inp.addEventListener('change', () => {
              let wkHour = Number(inp.value);
              wkHour -= Number(inp.getAttribute('data-insert-before'));

              if (totalLabel) {
                totalLabel.value = wkHour + Number(totalLabel.value);
                inp.setAttribute('data-insert-before', inp.value);
              }
            }, false);
          }
        }

        // ダイアログクローズ動作
        dialog.onclose = () => {
          // 登録
          const registItems = dialogTable.querySelectorAll('.dialog_table_tr');
          for (const registItem of registItems) {
            if (registItem) {
              registItem.setAttribute('name', `dt_tr_${id}`);

              const projId = registItem.querySelector('.proj_id');
              if (projId) {
                projId.setAttribute('name', `proj_id_${id}`);
              }

              const projCd = registItem.querySelector('.proj_code');
              if (projCd) {
                projCd.setAttribute('name', `proj_code_${id}`);
              }

              const projHr = registItem.querySelector('.proj_hour');
              if (projHr) {
                projHr.setAttribute('name', `proj_hour_${id}`);
              }

              if (projId.value !== '' || projCd.value !== '') {
                wkTbl.append(registItem);
              } else {
                registItem.remove();
              }
            }
          }
          changeProjButton(openButton);
        };

        dialog.showModal();
      }, false);
    }
  }

  // ダイアログ-追加ボタン
  const addButton = dialog.querySelector('#cd_add_button');
  addButton.addEventListener('click', () => {
    const newRow = projLineBase.cloneNode(true);
    dialogTable.append(newRow);

    const inp = newRow.querySelector('.proj_hour');
    inp.addEventListener('focus', () => {
      inp.setAttribute('data-insert-before', inp.value);
    }, true);

    inp.addEventListener('change', () => {
      let wkHour = Number(inp.value);
      wkHour -= Number(inp.getAttribute('data-insert-before'));

      const lbl = dialogTable.querySelector('input[name="TotalHour"]');
      if (lbl) {
        lbl.value = wkHour + Number(lbl.value);
        inp.setAttribute('data-insert-before', inp.value);
      }
    }, false);
  }, false);

  // ダイアログ-閉じるボタン
  const closeButton = dialog.querySelector('#cd_close_button');
  closeButton.addEventListener('click', () => {
    // エラーチェック
    let isError = false;
    for (const row of dialogTable.rows) {
      const chkPj = row.querySelector('.proj_code');
      const chkHour = row.querySelector('.proj_hour');
      if (chkPj && chkHour) {
        if (chkPj.value !== '') {
          if (chkHour.value === '') {
            dialogMsgLabel.innerHTML = gettext('Hour is empty.');
            isError = true;
            chkHour.focus();
            break;
          }
          if (Number(chkHour.value) < 0) {
            dialogMsgLabel.innerHTML = gettext('Hour is invalid.');
            isError = true;
            chkHour.focus();
            break;
          }
        }
        let i = 0;
        for (const r of dialogTable.querySelectorAll('.proj_code')) {
          if (r && r.value !== '' && r.value === chkPj.value) {
            i += 1;
          }
        }
        if (i > 1) {
          dialogMsgLabel.innerHTML = gettext('The Project is duplicated.');
          isError = true;
          chkPj.focus();
          break;
        }
      }
    }
    if (!isError) {
      dialog.close();
    }
  }, false);
}, false);
