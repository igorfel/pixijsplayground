let app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x112233,
  resolution: window.devicePixelRatio || 1
})
document.body.appendChild(app.view)
const car_sprite_path = "./src/assets/images/car_sprite.png"

const car = PIXI.Sprite.from(car_sprite_path)

car.scale.set(0.1, 0.1)
car.anchor.set(0.5)

car.x = 200
car.y = 200

app.stage.addChild(car)
