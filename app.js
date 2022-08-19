const express = require("express");
const app = express();
const axios = require("axios");
const { con } = require("./DBconnect");

var apiRouter = require("./routes/api-v1");

app.set("view engine", "jade");

app.use("/api/v1/", apiRouter);

axios
  .get(
    "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json"
  )
  .then((res) => {
    const data = res.data.pokemon;
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");

      var values = [];
      var sql =
        "INSERT INTO poke_info (id,num,name,img,height,weight,candy,candy_count,egg,spawn_chance,avg_spawns,spawn_time) VALUES ?";

      data.forEach((pokemon) => {
        values.push([
          pokemon.id,
          pokemon.num,
          pokemon.name,
          pokemon.img,
          pokemon.height,
          pokemon.weight,
          pokemon.candy,
          pokemon.candy_count,
          pokemon.egg,
          pokemon.spawn_chance,
          pokemon.avg_spawns,
          pokemon.spawn_time,
        ]);
      });
      con.query(sql, [values], function (err, result) {
        if (err) {
          if (err.code == "ER_DUP_ENTRY") {
            console.log("Record already exists");
            return;
          }
          throw err;
        }
        console.log(
          "Number of poke_info records inserted: " + result.affectedRows
        );
      });
      weakness = [];
      sql = "INSERT INTO weaknesses (id,weakness) VALUES ?";
      data.forEach((pokemon) => {
        poke_weak = pokemon.weaknesses;
        poke_weak.forEach((weak) => {
          weakness.push([pokemon.id, weak]);
        });
      });
      con.query(sql, [weakness], function (err, result) {
        if (err) throw err;
        console.log(
          "Number of weaknesses records inserted: " + result.affectedRows
        );
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });
 
app.create;

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
app.listen(3000, function () {
  console.log("Node app is running on port 3000");
});
module.exports = app;
