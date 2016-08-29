
var slides_intro = [
{phrase:'a', msg:'Type the letter below to begin.'},
{phrase:'b', msg:'Yes indeed.'},
{phrase:'c', msg:'Perfect. You are doing great!'},
{phrase:'AaBbCc', msg:'Nice one. Follow the hints to type this word.'},
{phrase:'cat', msg:"doing great.. 100 points. "},
{phrase:'lazy dog', msg:"Last one!"}
];
var slides_alpha = [
{phrase:'a', msg:'26.'},
{phrase:'b', msg:'25'},
{phrase:'c', msg:'24'},
{phrase:'d', msg:'23'},
{phrase:'e', msg:'22'},
{phrase:'f', msg:"21"},
{phrase:'g', msg:'20'},
{phrase:'h', msg:'19'},
{phrase:'i', msg:'18'},
{phrase:'j', msg:'17'},
{phrase:'k', msg:'16'},
{phrase:'l', msg:'15'},
{phrase:'m', msg:'14'},
{phrase:'n', msg:'13'},
{phrase:'o', msg:'12'},
{phrase:'p', msg:'11'},
{phrase:'q', msg:'10'},
{phrase:'r', msg:'09'},
{phrase:'s', msg:'08'},
{phrase:'t', msg:'07'},
{phrase:'u', msg:'06'},
{phrase:'v', msg:'05'},
{phrase:'w', msg:'04'},
{phrase:'x', msg:'03'},
{phrase:'y', msg:'02'},
{phrase:'z', msg:'01'}
];

var game = (function(){
var game = {};
game.slides = slides_intro;
game.warnings = ["bonk", "incorrect", "close, but no cigar", "bleep", "try again", "try again", "whoops", "sorry, but neh", "not a character", ":(", "wrong", "derp", "almost", "nada", "net"];
game.congratulations = ["nice", "wow", "Mazel Tov!", "I like you", "Good one", "All righty then.", "what what", "correct", "winner!", "yep", "jammin", "perfecto", ":D", "Yahtzee!", "true that"];
game.setup = function(obj){
  game.obj = obj;
  game.keymap = obj.keymap;
  game.keycodes = obj.keycodes;
  game.hintMap = obj.key_layout;
  game.intervalTime = 2000;
  game.defaultColor = '#fff';
  game.hintColors = ['#424242', '#cacaca', '#fdfdfd'];
  game.pressColors = ['#66cdfe', '#66cdfe'];
  game.wrongColor = '#ff0';
  game.rightColor = '#86f337';
  game.hintDelay = 0;
  game.hintTimeouts = [];
  game.hintInterval = null;
  game.currentChar = null, 
  game.currentCharIndex = null, 
  game.currentSlideIndex = null, 
  game.currentPhrase = null;
  game.buffer = {};

  game.main = document.getElementsByTagName('main')[0];
  game.phraseBox = document.getElementById('phrase-box');
  game.phrase = document.getElementById('phrase');
  game.msg = document.getElementById('msg-box');
  game.output = document.getElementById('output-box');
  game.hint = document.getElementById('hint-box');
  game.hintText = document.getElementById('hint-text');
  game.bMaps = document.getElementById('bmap-text');
  game.hintBoxes = game.hint.getElementsByTagName('figure');
  for(var i=0;i<game.hintBoxes.length;i++){
    game.hintBoxes[i].innerHTML = '<div>'+game.hintMap[i]+'</div>';
  }
  game.hintToggle = document.getElementById('switch-toggleHints');
  game.alphaToggle = document.getElementById('switch-toggleAlphabet');
  game.hintControls = document.getElementById('controls-hint');
  game.viewOptions = document.getElementsByName("view");
  game.viewOpsMap = {intro:0,alphabet:1,freestyle:2};

  window.addEventListener('resize', game.fittext);
  document.body.addEventListener('keydown', game.down);
  document.body.addEventListener('keyup', game.up);
  game.hintToggle.addEventListener('change', game.toggleHints);
  game.alphaToggle.addEventListener('change', game.toggleAlpha);
  game.viewOptions[game.viewOpsMap['intro']].addEventListener('change', game.changeView);
  game.viewOptions[game.viewOpsMap['alphabet']].addEventListener('change', game.changeView);
  game.viewOptions[game.viewOpsMap['freestyle']].addEventListener('change', game.changeView);

  game.loadSlide(0);
  game.fittext();
  game.output.innerHTML = game.cheatsheet.make();

}
game.congrats = function(randomMsg){
  if(randomMsg){
    var rnum = Math.floor(Math.random()*game.congratulations.length);
    var msg = game.congratulations[rnum];
    game.msg.innerHTML = msg;
  }
  game.colorFlash('green');
}
game.wrong = function(){
  var rnum = Math.floor(Math.random()*game.warnings.length);
  var msg = game.warnings[rnum];
  game.msg.innerHTML = msg;
  game.colorFlash('yellow');
}
game.end = function(){

game.phraseBox.classList.add('fadeout');
game.hintControls.classList.add('fadeout');
game.bMaps.classList.add('fadeout');
game.hint.classList.add('fadeout');
game.msg.classList.add('slideup');
fireworks.go();
rabbit.load();
}
game.loadSlide = function(index){
  game.currentSlideIndex = index;
  game.currentCharIndex = 0;
  game.loadMsg(index);
  game.loadPhrase(index);
  game.loadBMap();
  game.restartHint();
}
game.loadBMap = function(){
  var phrase = game.currentPhrase;
  var bMaps = phrase.split('').map(function(c){
    return game.cheatsheet.bMap(c)
  }).join('');
  game.bMaps.innerHTML = bMaps; 
  var tables = game.bMaps.getElementsByTagName('table');
  tables[0].classList.add('active');
}
game.loadMsg = function(index){
  game.msg.innerHTML = game.slides[index].msg;
}
game.loadPhrase = function(index){
  var phrase = game.slides[index].phrase;
  game.currentPhrase = phrase;
  var html = game.buildPhrase(phrase, 0);
  game.phrase.innerHTML = html;
}
game.buildPhrase = function(phrase, index){
  var words = phrase.split(' ');
  var numWords = words.length;
  var counter = 0;
  var html = words.map(function(word, j){
    var innerhtml = word.split('').map(function(char,i){
      var c = "";
      if(counter===index){
        var c = "active";
        game.currentChar = char;
      }
      counter++;
      return '<div class="'+c+' letter">'+char+'</div>';
    }).join('');
    var word = '<div class="word">'+innerhtml+'</div>';
    if(j < numWords-1){
      var c = "";
      if(counter===index){
        var c = "active";
        game.currentChar = ' ';
      }
      word += '<div class="'+c+' space">&nbsp;</div>';
    }
    counter++;
    return word;
  }).join('');


  return html;
}
game.next = function(){
    var phraseLen = game.currentPhrase.length;
    var charPos = game.currentCharIndex;
    var newPos = charPos+1;
    //inside a phrase
    if(newPos < phraseLen){
        var html = game.buildPhrase(game.currentPhrase, newPos);
        game.phrase.innerHTML = html;
        game.currentCharIndex = newPos;
        var tables = game.bMaps.getElementsByTagName('table');
        for(var i=0;i<tables.length;i++){
          var tbl = tables[i];
          tbl.classList.remove('active');
        }
        tables[newPos].classList.add('active');
        game.congrats(true);
        game.restartHint();
        return true;
    }
    //next slide
    var slidesLen = game.slides.length;
    var slidePos = game.currentSlideIndex;
    newPos = slidePos+1;
    if(newPos < slidesLen){
      game.loadSlide(newPos);
      return true;
    }
    //no slides left
    game.end();
    return true;
}
game.startHint = function(){
  flashHint();
  game.hintInterval = setInterval(flashHint, game.intervalTime);

  function flashHint(){
    var map = game.keymap;
    for(var k in map){
      if(map[k] === game.currentChar){
        var hint = k;
        break;
      }
    }
    var sets = hint.split(',');
    sets.forEach(function(set, index){
      var keys = set.split('+');
      keys.forEach(function(k,ki,obj){
        var selector = game.hintMap.indexOf(k);
        var initDelay = Math.round(game.intervalTime/2);
        if(index === 0){
          game.hintBoxes[selector].classList.add('color-pop');
            var t = setTimeout(function(){
              game.hintBoxes[selector].classList.remove('color-pop');
            }, initDelay);
            game.hintTimeouts.push(t);
        }else{
          var delay = (initDelay/sets.length)*index;
          var t = setTimeout(function(){
            game.hintBoxes[selector].classList.add('color-pop');
            var it = setTimeout(function(){
              game.hintBoxes[selector].classList.remove('color-pop');
            }, initDelay-delay);
            game.hintTimeouts.push(it);
          }, delay);
          game.hintTimeouts.push(t);
        }
      });
    });
  }
}
game.restartHint = function(){
  game.stopHint();
  game.startHint();
};
game.stopHint = function(){
  clearInterval(game.hintInterval);
  for(var i=0;i<game.hintTimeouts.length;i++){
    var t = game.hintTimeouts[i];
    clearTimeout(t);
  }
  game.hintTimeouts = [];
  for(var i=0;i<game.hintBoxes.length;i++){
    var hintBox = game.hintBoxes[i];
    hintBox.classList.remove('color-pop');
  }
}
game.toggleHints = function(e){
  if(this.checked){
    game.hint.className = 'fadein'
  }else{
    game.hint.className = 'fadeout'
  }
}
game.toggleAlpha = function(e){
  if(this.checked){
    game.bMaps.className = 'fadein'
  }else{
    game.bMaps.className = 'fadeout'
  }
}
game.changeView = function(e){


  if(this.value === 'freestyle'){
    game.stopHint();
    game.freestyle = true;

    game.phrase.innerHTML = '';
    game.bMaps.classList.add('slideup');
    game.msg.classList.add('slideup');
    game.phraseBox.classList.add('freestyle');
    game.fittext();
    return true;
  }else if(game.freestyle){
    game.freestyle = false;
    game.phrase.innerHTML = '';
    game.bMaps.classList.remove('slideup');
    game.msg.classList.remove('slideup');
    game.phraseBox.classList.remove('freestyle');
  }
  if(this.value==='alphabet'){
    game.slides = slides_alpha;
    game.setup(game.obj);
  }
  if(this.value==='intro'){
    game.slides = slides_intro;
    game.setup(game.obj);
  }
}
game.up = function(e){
  var k = e.which || arguments[0].which;
  if(typeof game.keycodes[k] === 'undefined'){
    return false;
  }
    var selector = game.hintMap.indexOf(game.keycodes[k]);
    game.hintBoxes[selector].classList.remove('color-blue');
    delete game.buffer[k];
}
game.down = function(e){
  var k = e.which || arguments[0].which;
  if(typeof game.buffer[k] !== 'undefined'){
    return false;
  }
  if(typeof game.keycodes[k] === 'undefined'){
    //game.wrong();
    return false;
  }
  game.buffer[k] = 'true';
  var selector = game.hintMap.indexOf(game.keycodes[k]);
  game.hintBoxes[selector].classList.add('color-blue');
}
game.subscribe = function(char, k){
  if(game.freestyle){
    if(char==='backspace'){
      game.phrase.innerHTML = game.phrase.innerHTML.slice(0, -1);
    }else{
      game.phrase.innerHTML += char;  
    }
    return true;
  }
  if(char === game.currentChar){
      game.congrats();
      game.next();
  }else{
      game.wrong();
  }
  //game.output.innerHTML += char;
};
game.colorFlash = function(color){
  game.msg.classList.remove('color-yellow');
  game.msg.classList.remove('color-green');
  game.msg.classList.add('color-'+color);
  var t = setTimeout(function(){
    game.msg.classList.remove('color-'+color);
  }, 1500);
  game.hintTimeouts.push(t);
}
game.cheatsheet = {
  make:function(){
    var lists = {};
    lists.lowerAlpha={keys:[],vals:[]},lists.upperAlpha={keys:[],vals:[]},lists.nums={keys:[],vals:[]},lists.symbols={keys:[],vals:[]};
    var keymap = game.keymap;

      for(var k in keymap){
        var val = keymap[k];
        if(!/[^a-z]/.test(val) && val.length === 1 && isNaN(val)){
          if(lists.lowerAlpha.vals.indexOf(val) === -1){
          lists.lowerAlpha.keys.push(k);
          lists.lowerAlpha.vals.push(val);
        }
        }else 
        if(!/[^A-Z]/.test(val) && val.length === 1 && isNaN(val)){
          if(lists.upperAlpha.vals.indexOf(val) === -1){
          lists.upperAlpha.keys.push(k);
          lists.upperAlpha.vals.push(val);
        }
        }else 
        if(!isNaN(val) && val !==' '){
          if(lists.nums.vals.indexOf(val) === -1){
          lists.nums.keys.push(k);
          lists.nums.vals.push(val);
        }
        }else{
          if(lists.symbols.vals.indexOf(val) === -1){
          lists.symbols.keys.push(k);
          lists.symbols.vals.push(val);
        }
        }
      }

      var html = '<div class="cheatsheet">';
      for(var i=0;i<lists.lowerAlpha.vals.length;i++){
        var k = lists.lowerAlpha.keys[i];
        html += this.numMap(k, lists.lowerAlpha.vals[i]);
      }
      for(var i=0;i<lists.nums.vals.length;i++){
        var k = lists.nums.keys[i];
        html += this.numMap(k, lists.nums.vals[i]);
      }
      for(var i=0;i<lists.symbols.vals.length;i++){
        var k = lists.symbols.keys[i];
        html += this.numMap(k, lists.symbols.vals[i]);
      }
      html += '</div>';

      return html;

  },
  numMap:function(str, char){
        var mapping = ['a','s','d','f','space'];
        var cols = {0:'',1:'',2:'',3:'',4:''},keys=[],key='';
        var sets = str.split(',');
        for(var si=0;si<sets.length;si++){
          keys =  sets[si].split('+');
          for(var i=0;i<keys.length;i++){
            key = keys[i];
            cols[mapping.indexOf(key)]=si+1;
          }
        }
        var html = '<table class="bmap">';
        html += '<tr><th colspan=5>'+ char + '</th></tr>';
        html += '<tr>';
        for(var i=0;i<Object.keys(cols).length;i++){
          if(typeof cols[i] !== 'undefined'){
            html += '<td>'+cols[i]+'</td>';
          }
        }
        html += '</tr>';
        html += '<tr>'+mapping.map(function(c){return '<td data-char="'+c+'">'+c+'</td>';}).join('')+'</tr>';
        html += '</table>';
        return html;
  },
  bMap:function(char){
    for(var k in game.keymap){
      if(game.keymap[k]===char){
        var keys = k;
        break;
      }
    }
    if(keys.length < 1){return false;}

    return this.numMap(keys, char);
  }
};
game.showGuide = function(e){
  var w = window.open('mypage.html','_blank','width='+window.clientHeight+',height='+window.clientWidth/4+',resizable=1,scrollbars=1');
  var html = game.cheatsheet.make();
  var styles = '<link rel="stylesheet" type="text/css" href="css/main.css">';
  w.document.write(styles);
  w.document.write(html);
}
game.fittext = function(){
    var minFontSize=24,maxFontSize=200;
    game.phrase.style.fontSize = Math.max(Math.min(game.phraseBox.clientWidth / 15, parseFloat(maxFontSize)), parseFloat(minFontSize)) + 'px';
    game.msg.style.fontSize = Math.max(Math.min(game.msg.clientWidth / 15, parseFloat(70)), parseFloat(20)) + 'px';
}

//light this candle
return {start:game.setup, subscribe:game.subscribe,showGuide:game.showGuide};
})();