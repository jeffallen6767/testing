var colors = require("colors/safe"),
  testing = {
    "api": {
      "startTime": function() {
        var data = testing.data,
          idx = data.idx,
          key = data.keys[idx];
        data.results[key].times.start.push(
          new Date()
        );
      },
      "endTime": function() {
        var data = testing.data,
          idx = data.idx,
          key = data.keys[idx];
        data.results[key].times.end.push(
          new Date()
        );
      },
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
    "timing": function(times) {
      var starts = times.start,
        ends = times.end,
        startIdx = starts.length - 1,
        endIdx = ends.length - 1,
        start = starts[startIdx],
        end = ends[endIdx];
      return ["Time:", end.getTime() - start.getTime(), "Milliseconds"].join(" ");
    },
    "pass": function() {
      var args = [].slice.call(arguments),
        data = testing.data,
        idx = data.idx,
        key = data.keys[idx],
        result = data.results[key];
      result.pass.push(args);
      data.pass++;
      args.push(
        testing.timing(result.times)
      );
      console.log(colors.green(["   PASS!"].concat(args).join(" ")));
    },
    "fail": function() {
      var args = [].slice.call(arguments),
        data = testing.data,
        idx = data.idx,
        key = data.keys[idx],
        result = data.results[key];
      result.fail.push(args);
      data.fail++;
      args.push(
        testing.timing(result.times)
      );
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
              "fail": [],
              "times": {
                "start": [],
                "end": []
              }
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
