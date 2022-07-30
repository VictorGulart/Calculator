class Calculator {
  constructor() {
    // display variable and holder
    this.expr = [];
    this.currVal = "0";
    this.postExp = [];
    this.prevCalc = 0;
    this.ops = "+-/*^".split("");
    this.numbers = "0123456789".split("");
    this.lOpen = 0; // left parenthesis is open

    // DOM
    this.exprElm = document.querySelector("#exp");
    this.currValElm = document.querySelector("#cur-val");
    this.logsElm = document.querySelector("#logs");
  }
  add = (a, b) => a + b;

  subtract = (a, b) => a - b;

  multiply = (a, b) => a * b;

  divide = (a, b) => {
    if (b === 0) {
      return Infinity;
    }
    return a / b;
  };

  sqr = (a, b) => a ** b;

  updateDisplay = () => {
    // Update the calculator display for the user
    // this.currVal === ""
    //   ? (this.currValElm.innerHTML = 0)
    //   : (this.currValElm.innerHTML = this.currVal);
    this.currValElm.innerHTML = this.currVal;

    this.expr.length === 0
      ? (this.exprElm.innerHTML = "0")
      : (this.exprElm.innerHTML = this.expr.join(" "));
  };

  updateOnOperate = () => {
    // updates the
    this.currVal = "0";
    this.currValElm.innerHTML = "0";
    this.exprElm.innerHTML = this.expr.join(" ");
  };

  showExpr = () => {
    // for debugging, show the expr on the html
    this.logsElm.innerHTML = this.expr;
  };

  resetCalc = () => {
    this.expr = [];
    this.currVal = "0";
  };

  isNumber(val) {
    //  test if value can be converted to a number
    return Number.isNaN(parseFloat(val));
  }

  handleInput = (val) => {
    // get the id

    // exceptions
    if (this.currVal === "0" && val === "zero") {
      // Avoid multiple zeros
      return;
    } else if (this.currVal.at(-1) === "." && val === "dot") {
      // Avoid multiple dots
      return;
    } else if (
      this.expr.length === 0 &&
      this.currVal === "0" &&
      (this.ops.includes(val) || val === "^" || val === "pow2")
    ) {
      // Avoid starting with signs
      return;
    } else if (
      this.ops.includes(val) &&
      this.ops.includes(this.expr.at(-1)) &&
      val !== this.expr.at(-1)
    ) {
      // Change last sign
      this.expr.pop();
      this.expr.push(val);
      this.updateDisplay();
      return;
    } else if (
      this.ops.includes(val) &&
      this.ops.includes(this.expr.at(-1)) &&
      this.currVal === "0"
    ) {
      // avoid multiple signs
      return;
    } else if (
      this.ops.includes(val) &&
      this.expr.length === 0 &&
      this.currVal === "0"
    ) {
      return;
    }

    // depending on the button pressed then do smth
    switch (val) {
      case "zero":
        this.currVal += "0";
        break;

      // Operations
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
      case "pow2":
        if (this.currVal !== "0") {
          this.expr.push(this.currVal);
        } else if (this.expr.at(-1) === "(") {
          return;
        }
        if (val === "pow2") {
          // Handle Squares
          this.expr.push("^");
          this.expr.push("2");
        } else this.expr.push(val);

        this.currVal = "0";
        break;
      case "(":
        if (this.currVal !== "0" && this.expr.at(-1) !== "(") {
          this.expr.push(this.currVal);
          this.expr.push("*");
          this.expr.push("(");
          this.currVal = "0";
        } else if (this.currVal === "0" && this.expr.length === 0) {
          this.expr[0] = "(";
        } else if (
          this.currVal === "0" &&
          this.ops.includes(this.expr.at(-1))
        ) {
          this.expr.push("(");
        } else if (this.expr.length === 1 && this.expr.at(-1) !== "(") {
          this.expr.push("*");
          this.expr.push("(");
        } else if (this.expr.at(-1) === "(") {
          this.expr.push("(");
        } else if (this.expr.at(-1) === ")") {
          this.expr.push("*");
          this.expr.push("(");
        }
        this.lOpen += 1;
        break;
      case ")":
        if (this.lOpen === 0) {
          return;
        } else if (this.currVal === "0" && this.expr.at(-1) === "(") {
          return;
        } else if (
          this.currVal === "0" &&
          this.lOpen === 0 &&
          this.expr.at(-1) === ")"
        ) {
          return;
        } else if (
          this.lOpen > 0 &&
          this.currVal === 0 &&
          this.expr.at(-1) === ")"
        ) {
          break;
        } else if (this.lOpen > 0 && this.currVal !== "0") {
          this.expr.push(this.currVal);
        }

        this.expr.push(")");
        this.currVal = "0";
        this.lOpen -= 1;

        break;
      case ".":
        this.currVal += ".";
        break;
      case "delete":
        // clear the current val
        this.currVal = "0";
        break;
      case "escape":
        // clear the calculator completely
        this.resetCalc();
        break;
      case "enter":
        //prevent early equal
        if (this.expr.length % 2 !== 0 && this.currVal === "0") {
          // this usually happens when theres an error
          // with the expression
          this.operate();
          this.updateOnOperate();
          return;
        } else if (
          this.currVal === "0" &&
          !this.ops.includes(this.expr.at(-1))
        ) {
          return;
        }
        this.expr.push(this.currVal);
        this.operate();
        this.updateOnOperate();
        return;
      case "backspace":
        if (this.currVal === "0") return;
        if (this.currVal.length === 1) {
          this.currVal = "0";
        } else {
          this.currVal = this.currVal.slice(0, -1);
        }
        break;
      default:
        if (this.expr.length === 1 && this.expr[0] !== "(") {
          // cancel exp when prev result is not used
          this.expr = [];
          this.updateDisplay();
        }
        if (this.currVal === "0") {
          this.currVal = val;
          break;
        }
        this.currVal += val;
        break;
    }

    // update display
    this.updateDisplay();

    // show expression -> debugging
    // this.showExpr();
  };

  postFix = () => {
    // is the expression empty
    if (this.expr.length === 0) return null;

    // Converts the expression into postfix notation
    let opsStack = [];
    let postExp = [];
    let prec = {
      "*": 3,
      "/": 3,
      "^": 3,
      "+": 2,
      "-": 2,
      "(": 1,
      ")": 1,
    };

    for (let token in this.expr) {
      // if (this.expr[token] in numbers) {
      if (!Number.isNaN(parseFloat(this.expr[token]))) {
        postExp.push(parseFloat(this.expr[token]));
      } else if (this.expr[token] === "(") {
        opsStack.push(this.expr[token]);
      } else if (this.expr[token] === ")") {
        let topToken = opsStack.pop();

        while (topToken !== "(") {
          // get tokens until the left parenthesis is found
          postExp.push(topToken);
          topToken = opsStack.pop();
        }
      } else {
        // add the sign to opsStack
        while (
          !(opsStack.length === 0) &&
          prec[opsStack.at(-1)] >= prec[this.expr[token]]
        ) {
          postExp.push(opsStack.pop());
        }
        opsStack.push(this.expr[token]);
      }
      // end of while
    }

    while (opsStack.length !== 0) {
      // Append all remaining operators
      postExp.push(opsStack.pop());
    }

    this.postExp = postExp;
  };

  operate = () => {
    //
    /**
     * Resolves the postExpr
     */
    let stack = [];

    this.postFix(); // gets the postfix expression

    for (let token in this.postExp) {
      let a, b, res;

      // if (this.postExp[token] in numbers) {
      if (typeof this.postExp[token] === "number") {
        // appends the number
        stack.push(this.postExp[token]);
        continue;
      }

      // its an operator
      b = stack.pop();
      a = stack.pop();
      switch (this.postExp[token]) {
        case "+":
          res = this.add(a, b);
          stack.push(res);
          break;
        case "-":
          res = this.subtract(a, b);
          stack.push(res);
          break;
        case "*":
          res = this.multiply(a, b);
          stack.push(res);
          break;
        case "/":
          res = this.divide(a, b);
          stack.push(res);
          break;
        case "^":
          res = this.sqr(a, b);
          stack.push(res);
          break;
      }
    }
    stack[0] = this.roundResult(stack[0]);
    this.expr = stack;
  };

  roundResult = (res) => {
    // Rouding result to 9 decimal places at max
    return parseFloat(res.toFixed(9));
  };
}

// Instantiate the calculator
let calc = new Calculator();

// Keyboard Functionality
document.addEventListener("keydown", (event) => {
  let key = event.key;
  let ops = ["enter", "delete", "escape", "backspace"];
  if (calc.numbers.includes(key) || "()/*+-^".includes(key)) {
    calc.handleInput(key);
  } else if (ops.includes(key.toLocaleLowerCase())) {
    calc.handleInput(key.toLocaleLowerCase());
  }
});
