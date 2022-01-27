function start() { // Inicio da função start()

	$("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>")
		.append("<div id='inimigo1' class='anima2'></div>")
		.append("<div id='inimigo2'></div>")
		.append("<div id='amigo' class='anima3'></div>")
		.append("<div id='placar'></div>")
		.append("<div id='energia'></div>");

	//Principais variáveis do jogo
	let jogo = {};
	let velocidade=5;
	let posicaoY = parseInt(Math.random() * 334);
	let podeAtirar=true;
	let fimdejogo=false;
	let pontos=0;
	let salvos=0;
	let perdidos=0;
	let energiaAtual=3;
	const TECLA = {
		W: 87,
		S: 83,
		D: 68,
		UP: 38,
		DOWN: 40,
		SPACE: 32
	};
	const somDisparo=document.getElementById("somDisparo");
	const somExplosao=document.getElementById("somExplosao");
	const musica=document.getElementById("musica");
	const somGameover=document.getElementById("somGameover");
	const somPerdido=document.getElementById("somPerdido");
	const somResgate=document.getElementById("somResgate");
	
	musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
	musica.play();
	
	jogo.pressionou = [];
	//Verifica se o usuário pressionou alguma tecla	
	$(document).keydown(function(e){
		jogo.pressionou[e.which] = true;
	});
	$(document).keyup(function(e){
		jogo.pressionou[e.which] = false;
	});
	
	//Game Loop
	jogo.timer = setInterval(loop,30);
	function loop() {
		movefundo();
		movejogador();
		moveinimigo1();
		moveinimigo2();
		moveamigo();
		colisao();
		placar();
		energia();
	} // Fim da função loop()

	//Função que movimenta o fundo do jogo
	function movefundo() {
		esquerda = parseInt($("#fundoGame").css("background-position"));
		$("#fundoGame").css("background-position",esquerda-1);
	} // fim da função movefundo()

	function movejogador() {
		if (jogo.pressionou[TECLA.W] || jogo.pressionou[TECLA.UP]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top",topo-10);
			if (topo<=0) 	$("#jogador").css("top",topo+10);
		}
		if (jogo.pressionou[TECLA.S] || jogo.pressionou[TECLA.DOWN]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top",topo+10);	
			if (topo>=434) $("#jogador").css("top",topo-10);
		}
		if (jogo.pressionou[TECLA.D] || jogo.pressionou[TECLA.SPACE]) {
			disparo();	
		}
	} // fim da função movejogador()

	function moveinimigo1() {
		posicaoX = parseInt($("#inimigo1").css("left"));
		$("#inimigo1").css("left",posicaoX-velocidade)
			.css("top",posicaoY);
		if (posicaoX<=(-256)) reposicionaInimigo("#inimigo1");
	} //Fim da função moveinimigo1()

	function moveinimigo2() {
		posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left",posicaoX-3);
		if (posicaoX<=(-165)) $("#inimigo2").css("left",950);
	} // Fim da função moveinimigo2()

	function moveamigo() {
		posicaoX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left",posicaoX+1);
		if (posicaoX>950) $("#amigo").css("left",0);
	} // fim da função moveamigo()

	function disparo() {
		if (podeAtirar==true) {
			somDisparo.play();
			podeAtirar=false;
			topo = parseInt($("#jogador").css("top"))
			posicaoX= parseInt($("#jogador").css("left"))
			tiroX = posicaoX + 190;
			topoTiro=topo+37;
			$("#fundoGame").append("<div id='disparo'></div");
			$("#disparo").css("top",topoTiro)
				.css("left",tiroX);
			var tempoDisparo=window.setInterval(executaDisparo, 30);
		} //Fecha podeAtirar
		function executaDisparo() {
			posicaoX = parseInt($("#disparo").css("left"));
			$("#disparo").css("left",posicaoX+25); 
			if (posicaoX>950) {
				window.clearInterval(tempoDisparo);
				tempoDisparo=null;
				$("#disparo").remove();
				podeAtirar=true;
			}
		} // Fecha executaDisparo()
	} // Fecha disparo()

	function colisao() {
		let colisao1 = ($("#jogador").collision($("#inimigo1")));
		let colisao2 = ($("#jogador").collision($("#inimigo2")));
		let colisao3 = ($("#disparo").collision($("#inimigo1")));
		let colisao4 = ($("#disparo").collision($("#inimigo2")));
		let colisao5 = ($("#jogador").collision($("#amigo")));
		let colisao6 = ($("#inimigo2").collision($("#amigo")));
		
		// jogador com o inimigo1	
		if (colisao1.length>0) {
			energiaAtual--;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1(inimigo1X,inimigo1Y);
			reposicionaInimigo("#inimigo1");
		}
		
		// jogador com o inimigo2 
    if (colisao2.length>0) {
			energiaAtual--;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			explosao2(inimigo2X,inimigo2Y);
			$("#inimigo2").remove();
			reposicionaInimigo2();
		}
		
		// Disparo com o inimigo1
		if (colisao3.length>0) {
			pontos+=100;
			velocidade=velocidade+0.3;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1(inimigo1X,inimigo1Y);
			$("#disparo").css("left",950);
			reposicionaInimigo("#inimigo1");
		}

		// Disparo com o inimigo2
		if (colisao4.length>0) {
			pontos+=50;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			$("#inimigo2").remove();
			explosao2(inimigo2X,inimigo2Y);
			$("#disparo").css("left",950);
			reposicionaInimigo2();
		}

		// jogador com o amigo
		if (colisao5.length>0) {
			salvos++;
			somResgate.play();
			$("#amigo").remove();
			reposicionaAmigo();
		}

		//Inimigo2 com o amigo
		if (colisao6.length>0) {
			perdidos++;
			amigoX = parseInt($("#amigo").css("left"));
			amigoY = parseInt($("#amigo").css("top"));
			explosao3(amigoX,amigoY);
			$("#amigo").remove();
			reposicionaAmigo();
		}

	} //Fim da função colisao()

	//Explosão 1
	function explosao1(inimigo1X,inimigo1Y) {
		somExplosao.play();
		$("#fundoGame").append("<div id='explosao1'></div>");
		$("#explosao1").css("background-image", "url(assets/imgs/explosao.png)");
		var div=$("#explosao1");
			div.css("top", inimigo1Y)
				.css("left", inimigo1X)
				.animate({width:200, opacity:0}, "slow");
		var tempoExplosao=window.setInterval(removeExplosao, 1000);
		function removeExplosao() {
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
		}
	} // Fim da função explosao1()
	
	//Explosão2
	function explosao2(inimigo2X,inimigo2Y) {
		somExplosao.play();
		$("#fundoGame").append("<div id='explosao2'></div");
		$("#explosao2").css("background-image", "url(assets/imgs/explosao.png)");
		var div2=$("#explosao2");
		div2.css("top", inimigo2Y)
			.css("left", inimigo2X)
			.animate({width:200, opacity:0}, "slow");
		var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
		function removeExplosao2() {
			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2=null;
		}
	} // Fim da função explosao2()

	//Explosão3
	function explosao3(amigoX,amigoY) {
		somPerdido.play();
		$("#fundoGame").append("<div id='explosao3' class='anima4'></div");
		$("#explosao3").css("top",amigoY)
			.css("left",amigoX);
		var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
		function resetaExplosao3() {
			$("#explosao3").remove();
			window.clearInterval(tempoExplosao3);
			tempoExplosao3=null;
		}
	} // Fim da função explosao3
		
	//Reposiciona Inimigo2
	function reposicionaInimigo2() {
		var tempoColisao4=window.setInterval(reposiciona4, 4000);
		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4=null;
			if (fimdejogo==false) $("#fundoGame").append("<div id=inimigo2></div");
		}	
	}	// Fim da função reposicionaInimigo2()

	//Reposiciona Inimigo1
	function reposicionaInimigo(layer) {
		posicaoY = parseInt(Math.random() * 334);
		$(layer).css("left",950);
		$(layer).css("top",posicaoY);
	}

	//Reposiciona Amigo
	function reposicionaAmigo() {
		var tempoAmigo=window.setInterval(reposiciona6, 6000);
		function reposiciona6() {
			window.clearInterval(tempoAmigo);
			tempoAmigo=null;
			if (fimdejogo==false) $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
		}
	} // Fim da função reposicionaAmigo()

	//Placar
	function placar() {
		$("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
	} //fim da função placar()

	//Barra de energia
	function energia() {
		switch (energiaAtual) {
			case 3:
				$("#energia").css("background-image", "url(assets/imgs/energia3.png)");
				break
			case 2:
				$("#energia").css("background-image", "url(assets/imgs/energia2.png)");
				break
			case 1:
				$("#energia").css("background-image", "url(assets/imgs/energia1.png)");
				break
			case 0:
				$("#energia").css("background-image", "url(assets/imgs/energia0.png)");
				gameOver();
				break
			default: $("#energia").css("background-image", "url(assets/imgs/energia0.png)");
		}
	} // Fim da função energia()

	//Função GAME OVER
	function gameOver() {
		fimdejogo=true;
		musica.pause();
		somGameover.play();
		
		window.clearInterval(jogo.timer);
		jogo.timer=null;
		
		$("#jogador").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#amigo").remove();
		
		$("#fundoGame").append("<div id='fim'></div>");
		
		$("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
	} // Fim da função gameOver();

} // Fim da função start

//Reinicia o Jogo
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
} //Fim da função reiniciaJogo