export class Vector2 {

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  add(b) {
    if (typeof b === 'number')
      return new Vector2(this.x + b, this.y + b)
    else
      return new Vector2(this.x + b.x, this.y + b.y)
  }

  mult(b) {
    if (typeof b === 'number')
      return new Vector2(this.x * b, this.y * b)
    else
      return new Vector2(this.x * b.x, this.y * b.y)
  }

}

// vector2.prototype["+"] = function (operand) {
//   console.log(operand)
//   if (typeof operand == vector2)
//     return new vector2(this.x + operand.x, this.y + operand.y)
//   else if (typeof operand == Number)
//     return new vector2(this.x + operand, this.y + operand)
//   else return undefined
// }