var colors = require("colors/safe"),
  testing = {
    "api": {
      "assert": {
        "identical": function(one, two) {
          var result = one === two;
          if (result) {
            testing.pass(one, "===", two);
          } else {
            testing.fail(one, "===", two);
          }
        }
      }
    },
    "data": {},
    "init": function(tests) {
      var keys = Object.keys(tests);
      testing.data = {
        "idx": 0,
        "pass": 0,
        "fail": 0,
        "keys": keys,
        "results": {}
      };
      return keys;
    },
    "pass": function() {
      var args = [].slice.call(arguments),
        data = testing.data,
        idx = data.idx,
        key = data.keys[idx];
      data.results[key].pass.push(args);
      data.pass++;
      console.log(colors.green(["   PASS!"].concat(args).join(" ")));
    },
    "fail": function() {
      var args = [].slice.call(arguments),
        data = testing.data,
        idx = data.idx,
        key = data.keys[idx];
      data.results[key].fail.push(args);
      data.fail++;
      console.log(colors.red(["   FAIL!"].concat(args).join(" ")));
    },
    "results": function() {
      var data = testing.data,
        pass = data.pass,
        fail = data.fail,
        total = pass + fail;
      console.log(colors.white.bold("results:"));
      console.log(colors.yellow.bold("   ", total, "tests"));
      console.log(colors.green.bold("   ", pass, "pass"));
      console.log(colors.red.bold("   ", fail, "fail"));
    },
    "run": function(tests) {
      var keys = testing.init(tests),
        max = keys.length,
        num = -1,
        key, test,
        next = function() {
          if (++num < max) {
            key = keys[num];
            testing.data.idx = num;
            console.log("Test", num + 1, key);
            testing.data.results[key] = {
              "pass": [],
              "fail": []
            };
            test = tests[key];
            test(testing.api);
          } else {
            testing.results();
          }
        };
      testing.api.done = next;
      next();
    }
  };

module.exports = testing;
