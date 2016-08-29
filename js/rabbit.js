var rabbit = (function(){

	function load(callback){
		document.getElementsByClassName('mdl-layout__content main')[0].style.display = 'none';

		var container = addContainer();
		
		var container = addContainer();
		addTxtBbl(container, "<h1>Congratulations.</h1> You have defeated me.");
		addRabbit(container);
		setTimeout(function(){
			next(null, 'And so now I must leave forever.');
			setTimeout(function(){
				addRocket(container);
				addPulse(container);
				launch(container);
				setTimeout(function(){
					endAll();
				}, 5555);
			}, 2650)
		}, 3350);


	}

	function launch(elm){
		var txt = elm.getElementsByTagName('div')[0];
		elm.removeChild(txt);
		elm.classList.add('launch');

	}
	return {load:load};


	/***********************/
	/***********************/
	/***********************/
	/***********************/
	/***********************/

		function endAll(){
			console.log(document.getElementsByTagName('canvas'));
			//document.body.removeChild(container);
			document.getElementsByTagName('canvas')[0].classList.add('slideup');
			//document.body.removeChild(document.getElementsByTagName('canvas')[0]);
			document.body.getElementsByClassName('game-completed')[0].style.display = 'block';
		}

		function addContainer(){
			/**** ****/
			var container = document.createElement('div');
			container.style.position = 'fixed';
			container.className = 'rocket-rabbit';
			container.style.left = '10px';
			container.style.bottom = '0';
			document.body.appendChild(container);
			return container;
		}
		

		function addTxtBbl(container, str){
			/**** ****/
			var txtb = document.createElement('div');
			txtb.innerHTML = str;
			txtb.className = 'talk-bubble';
			container.appendChild(txtb);
			/**** ****/
		}
		function next(e, string){
			document.getElementsByClassName('talk-bubble')[0].innerHTML = string;
		}

		function addRabbit(container){
			/**** ****/
			var img_rabbit = document.createElement('img');
			img_rabbit.style.position = 'absolute';
			img_rabbit.style.left = 0;
			img_rabbit.style.bottom = 0;
			img_rabbit.src = './img/bunny.png';
			container.appendChild(img_rabbit);
			/**** ****/
		}

		function addRocket(container){
			/**** ****/
			var img_rocket = document.createElement('img');
			img_rocket.style.position = 'absolute';
			img_rocket.style.left = '0';
			img_rocket.style.bottom = '0';
			img_rocket.style.marginBottom = '-500px';
			img_rocket.style.marginLeft = '-280px';
			img_rocket.src = './img/rocket.png';
			container.appendChild(img_rocket);
			//img_rocket.style.opacity = 0;
			/**** ****/
		}

		function addPulse(container){
			/**** ****/
			var rocket_pulse = document.createElement('div');
			rocket_pulse.className = 'rocket-pulse';

			var bubble = document.createElement('div');
			bubble.className = 'bubble';
			bubble.style.backgroundColor = '#ff0d23';
			bubble.style.width = '150px';
			bubble.style.height = '150px';
			bubble.style.marginLeft = '-125px';

			rocket_pulse.appendChild(bubble);

			var bubble = document.createElement('div');
			bubble.className = 'bubble';
			bubble.style.backgroundColor = '#168d8e';
			bubble.style.width = '100px';
			bubble.style.height = '100px';
			bubble.style.marginLeft = '-99px';
			bubble.style.marginTop = '25px';
			rocket_pulse.appendChild(bubble);

			var bubble = document.createElement('div');
			bubble.className = 'bubble';
			bubble.style.backgroundColor = '#e98334';
			bubble.style.width = '50px';
			bubble.style.height = '50px';
			bubble.style.marginLeft = '-73px';
			bubble.style.marginTop = '49px';
			rocket_pulse.appendChild(bubble);
			container.appendChild(rocket_pulse);
			/**** ****/  
		}


})();




