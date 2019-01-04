class MenuScene extends Phaser.Scene {
	constructor() {
		super({key: "Menu"})
	}

	preload() {
		this.load.multiatlas('cards', 'assets/spritesheet.json','assets')
		this.load.image('background', 'assets/bg.png')
	}

	create() {
		this.add.image(GAME_WIDTH/2, GAME_HEIGHT/2, 'background')
		this.room_id = window.location.hash.slice(1);
		document.getElementById('menu').style.display = 'block'
		document.getElementById('new_game').addEventListener("click", () => {
			window.location.hash = ""
			this.scene.start('Game')
		})
		document.getElementById('join_game').addEventListener("click", () => {
			let room = document.getElementById('room_id').value
			if(room != '') {
				window.location.hash = "#" + room
				this.scene.start('Game')
			}
		})
		document.getElementById('room_id').value = this.room_id
	}
	
	update() {
	}

}