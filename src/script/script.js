class Calculator {
  constructor() {
    // display variable and holder
    this.expr = [];
    this.currVal = "";
    this.postExp = [];
    this.prevCalc = 0;
    this.ops = "+-/*()".split("");
    this.numbers = "0123456789".split("");
    this.lOpen = false; // left parenthesis is open

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

  updateDisplay = () => {
    // Update the calculator display for the user
    this.currVal === ""
      ? (this.currValElm.innerHTML = 0)
      : (this.currValElm.innerHTML = this.currVal);

    this.expr.length === 1 && this.expr.at(-1) == ""
      ? (this.exprElm.innerHTML = "0")
      : (this.exprElm.innerHTML = this.expr.join(" "));
  };

  updateOnOperate = () => {
    // updates the
    this.currVal = "";
    this.currValElm.innerHTML = "0";
    this.exprElm.innerHTML = this.expr.join(" ");
  };

  showExpr = () => {
    // for debugging, show the expr on the html
    this.logsElm.innerHTML = this.expr;
  };

  resetCalc = () => {
    this.expr = [""];
    this.currVal = "";
  };

  valuesDecision(val) {
    // exceptions
    if (this.expr.at(-1) === "0" && val === "zero") {
      // Avoid multiple zeros
      return;
    } else if (this.currVal.at(-1) === "." && val === "dot") {
      // Avoid multiple dots
      return;
    } else if (this.expr.at(-1) == "" && this.ops.includes(val)) {
      // Avoid empty signs
      console.log("here");
      return;
    } else if (
      this.ops.includes(val) &&
      this.ops.includes(this.expr.at(-2)) &&
      !this.numbers.includes(this.expr.at(-1))
    ) {
      // avoid multiple signs
      return;
    }
    // depending on the button pressed then do smth
    switch (val) {
      case "zero":
        this.currVal += "0";
        break;
      case "+":
        this.expr.push("+");
        this.expr.push("");
        this.currVal = "";
        break;
      case "-":
        this.expr.push("-");
        this.expr.push("");
        this.currVal = "";
        break;
      case "*":
        this.expr.push("*");
        this.expr.push("");
        this.currVal = "";
        break;
      case "/":
        this.expr.push("/");
        this.expr.push("");
        this.currVal = "";
        break;
      case "l-paren":
        if (this.currVal !== "" && !Number.isNaN(parseFloat(this.currVal))) {
          this.expr.push("*");
          this.expr.push("(");
          this.expr.push("");
          this.currVal = "";
        } else if (this.currVal === "" && this.expr.at(-1) === "") {
          this.expr[0] = "(";
          this.expr.push("");
        }
        this.lOpen = true;
        break;
      case "r-paren":
        if (this.lOpen && this.expr.length >= 3) {
          this.expr.push(")");
          this.expr.push("");
          this.currVal = "";
        }
        this.lOpen = false;
        break;
      case "sqr":
        break;
      case "sqrt":
        break;
      case "dot":
        this.currVal += ".";
        break;
      case "del":
        // clear the current val
        this.currVal = "";
        break;
      case "ac":
        // clear the calculator completely
        this.resetCalc();
        break;
      case "equal":
        // prevent early equal
        if (Number.isNaN(parseFloat(this.expr.at(-1)))) {
          return;
        }
        this.operate();
        this.updateOnOperate();
        return;
        break;
      case "back":
        if (this.currVal === "") return;
        this.currVal = this.currVal.slice(0, -1);
        break;
      default:
        if (this.currVal === "0") {
          this.currVal = val;
          break;
        }
        this.currVal += val;
        break;
    }
  }

  isNumber(val) {
    return Number.isNaN(parseFloat(val));
  }

  handleInput = (e) => {
    // get the id
    let val = e.target.id;

    // exceptions
    if (this.expr.at(-1) === "0" && val === "zero") {
      // Avoid multiple zeros
      return;
    } else if (this.currVal.at(-1) === "." && val === "dot") {
      // Avoid multiple dots
      return;
    } else if (
      this.ops.includes(val) &&
      this.ops.includes(this.expr.at(-2)) &&
      !this.numbers.includes(this.expr.at(-1))
    ) {
      // avoid multiple signs
      return;
    }

    // depending on the button pressed then do smth
    switch (val) {
      case "zero":
        this.currVal += "0";
        break;
      case "+":
        this.expr.push(this.currVal);
        this.expr.push("+");
        this.currVal = "";
        break;
      case "-":
        this.expr.push(this.currVal);
        this.expr.push("-");
        this.currVal = "";
        break;
      case "*":
        this.expr.push(this.currVal);
        this.expr.push("*");
        this.currVal = "";
        break;
      case "/":
        this.expr.push(this.currVal);
        this.expr.push("/");
        this.currVal = "";
        break;
      case "l-paren":
        if (this.currVal !== "" && !Number.isNaN(parseFloat(this.currVal))) {
          this.expr.push("*");
          this.expr.push("(");
          this.expr.push("");
          this.currVal = "";
        } else if (this.currVal === "" && this.expr.at(-1) === "") {
          this.expr[0] = "(";
          this.expr.push("");
        }
        this.lOpen = true;
        break;
      case "r-paren":
        if (this.lOpen && this.expr.length >= 3) {
          this.expr.push(")");
          this.expr.push("");
          this.currVal = "";
        }
        this.lOpen = false;
        break;
      case "sqr":
        break;
      case "sqrt":
        break;
      case "dot":
        this.currVal += ".";
        break;
      case "del":
        // clear the current val
        this.currVal = "";
        break;
      case "ac":
        // clear the calculator completely
        this.resetCalc();
        break;
      case "equal":
        // prevent early equal
        if (this.currVal === "" && this.ops.includes(this.expr.at(-1))) {
          return;
        } else if (this.currVal !== "") {
          console.log("here");
          this.expr.push(this.currVal);
        }

        this.operate();
        this.updateOnOperate();
        return;
        break;
      case "back":
        if (this.currVal === "") return;
        this.currVal = this.currVal.slice(0, -1);
        break;
      default:
        if (this.currVal === "0") {
          this.currVal = val;
          break;
        }
        this.currVal += val;
        break;
    }

    // updated expr array
    // this.expr.splice(-1, 1, this.currVal);

    // update display
    this.updateDisplay();

    // show expression -> debugging
    // this.showExpr();
  };

  postFix = () => {
    // is the expression empty
    if (this.expr.length === 0) return null;

    // Converts the expression into postfix notation
    let numbers = "0123456789".split("");
    let opsStack = [];
    let postExp = [];
    let prec = {
      "*": 3,
      "/": 3,
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
        opsStack.push(this.exp[token]);
      } else if (this.expr[token] === ")") {
        topToken = opsStack.pop();

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

    this.postFix();

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
      }
    }
    stack[0] = this.roundResult(stack[0]);
    this.expr = stack;
  };

  roundResult = (res) => {
    // Rouding result to 9 decimal places
    return parseFloat(res.toFixed(9));
  };
}

// Instantiate the calculator
let calc = new Calculator();
