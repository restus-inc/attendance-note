'use strict';

function toSecond(hour,minute,second){
  if ((!hour && hour !== 0) || (!minute && minute !== 0) || (!second && second !== 0) ||
    hour === null || minute === null || second === null ||
    typeof hour === 'boolean' ||
    typeof minute === 'boolean' ||
    typeof second === 'boolean' ||
    typeof Number(hour) === 'NaN' ||
    typeof Number(minute) === 'NaN' ||
    typeof Number(second) === 'NaN') return;

    return (Number(hour) * 60 * 60) + (Number(minute) * 60) + Number(second);
}

function toTimeFormat(fullSecond){
  var hour, minute, second;
  if ((!fullSecond && fullSecond !== 0) || !String(fullSecond).match(/^[\-0-9][0-9]*?$/)) return;
  
        hour   = Math.floor(Math.abs(fullSecond) / 3600);
        minute = Math.floor(Math.abs(fullSecond) % 3600 / 60);
        second = Math.floor(Math.abs(fullSecond) % 60);
 
        hour = paddingZero(hour);
        minute = paddingZero(minute);
        second = paddingZero(second);
 
        return ((fullSecond < 0) ? '-' : '') + hour + ':' + minute;
}
function paddingZero(n){
  return (n < 10)  ? '0' + n : n;
}
function timeChange(sender){
  var id = sender.id.match(/\d+/g)

  //開始時間
  var times = document.getElementById("stt_time"+id).value.split(':');
  var st = toSecond(times[0],times[1],0);
  
  //終了時間
  times = document.getElementById("end_time"+id).value.split(':');
  var ed = toSecond(times[0],times[1],0);

  //休憩時間
  times = document.getElementById("break_time"+id).value.split(':');
  var br = toSecond(times[0],times[1],0);

  //稼働時間
  times = document.getElementById("op_time"+id).innerHTML.split(':');
  var old_op = toSecond(times[0],times[1],0);

  //合計時間
  times = document.getElementById("total_time").innerHTML.split(':');
  var total = toSecond(times[0],times[1],0);

  var new_op;
  if(isNaN(st) || isNaN(ed) || isNaN(br)) {
    new_op=0
  }
  else{
    if( st > ed){
      ed += 60*60*24;//一日加算
    }
    new_op = ed-st-br;
  }

  document.getElementById("op_time"+id).innerHTML = toTimeFormat(new_op);

  document.getElementById("total_time").innerHTML = toTimeFormat(total-old_op+new_op);
}
