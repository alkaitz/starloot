function Sound(){
	this.audio = new Audio();
	this.audio.src = 'sound/demo.wav';
	this.audio.load();

	this.audio.play();

	console.log(this.audio);
	console.log('Sound loaded!');
};

test = new Sound();