exports.Animator = class Animator {

  constructor(object) {
    this._object = object;
    this._isAnimationLoopRunning = false;
    this._object = null;
    this._objectValuesOld = {};
    this._targetValues = {};
  }

  animate(propName, targetValue, add = true) {
    if(isNaN(this._object[propName] * 1)){
      console.error('Bad property type. Number required: ', propName);
      return;
    }

    if (add) {
      if (this._targetValues[propName] === undefined) {
        this._targetValues[propName] = this._object[propName] + targetValue;
      } else {
        this._targetValues[propName] += targetValue;
      }
    } else {
      this._targetValues[propName] = targetValue;
    }

    if (!this._isAnimationLoopRunning) {
      this._repeatAnimationLoop();
    }
  }

  breakAll() {
    this._isAnimationLoopRunning = false;

    Object.keys(this._targetValues).forEach(key => {
      delete this._targetValues[key];
      delete this._objectValuesOld[key];
    });
  }

  _loop() {
    Object.keys(this._targetValues).forEach(propName => {
      const currentValue = this._object[propName];
      const targetValue = this._targetValues[propName];
      this._object[propName] = currentValue + (targetValue - currentValue) * 0.1;


      const isReached = this._object[propName].toFixed(3) === targetValue.toFixed(3);
      const isUnaltered = this._object[propName] === this._objectValuesOld[propName];

      if (isReached || isUnaltered) {
        delete this._objectValuesOld[propName];
        delete this._targetValues[propName];
      }
    });

    this._objectValuesOld = Object.keys(this._targetValues)
      .reduce((res, k) => {res[k] = this._object[k]; return res}, {});

    return Object.keys(this._targetValues).length > 0;
  }

  _repeatAnimationLoop() {
    this._isAnimationLoopRunning = this._loop();

    if (this._isAnimationLoopRunning) {
      requestAnimationFrame(() => {
        this._repeatAnimationLoop();
      });
    }
  }
}
