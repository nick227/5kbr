
var kbr = (function(){
var kbr = {};
kbr.press_throttle = 101;
kbr.sequence = [];
kbr.timer = [];
kbr.cleared = true;

kbr.down = function(e){
  var k = e.which || arguments[0].which;
  if(kbr.watch_keys.indexOf(k) < 0 || kbr.sequence.indexOf(kbr.keycodes[k]) > -1){
    return false;
  }else{
    e.preventDefault();
    kbr.sequence.push(kbr.keycodes[k]);
    kbr.timer.push(performance.now());
    return true;     
  }
}

kbr.up = function(e){
  var k = e.which || arguments[0].which;
  if(kbr.watch_keys.indexOf(k) < 0){return false;}//not watching
  e.preventDefault();
  //check for sequence
  var combo = kbr.combo();
  if(combo){
    kbr.cleared = false;
    kbr.dispatch(combo);
    return true;
  }
  if(kbr.cleared === false){
      kbr.clear(kbr.keycodes[k]);
      return false;
  }
  //single char press
  kbr.clear();
  kbr.dispatch(kbr.keycodes[k]);
  return true;
}

kbr.combo = function(){
  if(kbr.sequence.length < 2){return false;}//not a combo
  var op='', str='', last=kbr.sequence.pop();
  for(var i=0;i<kbr.sequence.length;i++){
    var key = kbr.sequence[i];
    if(typeof key !== 'undefined'){
      op = Math.abs(kbr.timer[i] - kbr.timer[i+1]) > kbr.press_throttle ? ',' : '+';
      str += key + op;
    }
  }
  str += last;
  if(typeof kbr.keymap[str] === 'undefined'){
    return false;
  }else{
    return str;
  }
}

kbr.clear = function(item){
  if(typeof item === 'string'){
    kbr.sequence.splice(kbr.sequence.indexOf(item), 1);
  }else{
    kbr.sequence = [];
  }
  if(kbr.sequence.length === 0){
    kbr.cleared = true;
    kbr.timer = [];
    return true;
  }
  return false;
}

kbr.dispatch = function(key){
  var val = kbr.keymap[key] || null;
  if(typeof kbr.subscriber === 'function'){
    kbr.subscriber(val, key);
    return true;
  }else{
    return false;
  }
}

kbr.ready = function(keymap, subscriber){
  kbr.watch_keys = keymap.watch_keys;
  kbr.keycodes = keymap.keycodes;
  kbr.keymap = kbr.parse(keymap.map);
  kbr.subscriber = subscriber;
  document.body.addEventListener('keydown', kbr.down);
  document.body.addEventListener('keyup', kbr.up);
  return {keycodes:kbr.keycodes, watch_keys:kbr.watch_keys, keymap:kbr.keymap, key_layout:keymap.key_layout};
}

kbr.parse = function(map){
  var keys = Object.keys(map);
  for(var i=0;i<keys.length;i++){
    var key = keys[i], val = map[keys[i]];
    if(key.indexOf('+') >= 0){
      var sets = key.split(',');
      var newset = [];
      sets.forEach(function(set, iz){
        //improves simultaneous press
        if(set.indexOf('+') >= 0){
          var revKey = set.split('').reverse().join('');
          newset[iz] = revKey;
        }else{
          newset[iz] = set;
        }
      });
      if(typeof map[newset.toString()] !== 'string'){
        map[newset.toString()] = val;  
      }
      
    }
    if(!/[^a-z]/.test(val) && val !== 'backspace'){
      //add caps to alpha chars
      var newset = 'space,'+key;
      if(typeof map[newset.toString()] !== 'string'){
        map[newset.toString()] = val.toUpperCase();
      }
    }
  }
  return map;
}

return {ready:kbr.ready};

})();