class Vector2 {
  constructor(items) {
    if (!items){
      return;
    }
    else if(items.x && items.y){
      this.x = items.x;
      this.y = items.y;
    } else {
      this.x = items[0];
      this.y = items[1];
    }
  }
  add(other) {
    let result = [];

    if (typeof(other) == 'number'){
			result.push(this.x + other);
			result.push(this.y + other)
		} else {
			result.push(this.x + other.x);
			result.push(this.y + other.y);
		}

		return new Vector2(result);
  }
  subtract(other) {
    let result = [];

    if(typeof(other) == 'number'){
			result.push(this.x - other);
			result.push(this.y - other)
		}	else {
			result.push(this.x - other.x);
			result.push(this.y - other.y);
		}

		return new Vector2(result);
  }
  multiply (other) {
    let result = [];

    if(typeof(other) == 'number'){
			result.push(this.x * other);
			result.push(this.y * other)
		} else {
			result.push(this.x * other.x);
			result.push(this.y * other.y);
		}

		return new Vector2(result);
  }
  divide (other) {
    let result = [];

    if(typeof(other) == 'number'){
			result.push(this.x / other);
			result.push(this.y / other)
		} else {
			result.push(this.x / other.x);
			result.push(this.y / other.y);
		}

		return new Vector2(result);
  }
  normalize(){
    let result = [];

		let length = Math.sqrt((this.x * this.x) + (this.y * this.y));

		result.push(this.x / length);
		result.push(this.y / length);

		return new Vector2(result);
  }
}


module.exports = Vector2;
