export const Clamp = (n, min, max) => {
  return Math.min(Math.max(n, min), max);
}

export const Sign = (n) => {
  return typeof n === 'number' ? n ? n < 0 ? -1 : 1 : n === n ? 0 : NaN : NaN;
}

export class Vector2 {

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vector2((this.x/magnitude) || 0, (this.y/magnitude) || 0)
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

  div(b) {
    if (typeof b === 'number')
      return new Vector2(this.x / b, this.y / b)
    else
      return new Vector2(this.x / b.x, this.y / b.y)
  }

  cross(b) {
    return this.x * b.y - this.y * b.x
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