var express = require("express");
var router = express.Router();
var con = require("../DBconnect").con;

router.use(express.json());

router.get("/", function (req, res) {
  con.query(
    "SELECT * FROM `poke_info` p INNER JOIN `weaknesses` w ON p.id = w.id",
    function (err, result, fields) {
      if (err) throw err;
      res.json({ pokemon: result });
    }
  );
});

router.get("/:id", function (req, res) {
  const id = req.params.id;
  con.query(
    "SELECT * FROM `poke_info` p INNER JOIN `weaknesses` w ON p.id = w.id where p.id=?",
    [id],
    function (err, result) {
      if (err) throw err;
      res.json({ pokemon: result });
    }
  );
});

router.post("/createPokeInfo", function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  const num = req.body.num;
  const name = req.body.name;
  const img = req.body.img;
  const height = req.body.height;
  const weight = req.body.weight;
  const candy = req.body.candy;
  const candy_count = req.body.candy_count;
  const egg = req.body.egg;
  const spawn_chance = req.body.spawn_chance;
  const avg_spawns = req.body.avg_spawns;
  const spawn_time = req.body.spawn_time;
  const weaknesses = req.body.weaknesses;
  var values = [];
  var weakness = [];

  weaknesses.forEach((weak) => {
    weakness.push([id, weak]);
  });

  var values = [
    id,
    num,
    name,
    img,
    height,
    weight,
    candy,
    candy_count,
    egg,
    spawn_chance,
    avg_spawns,
    spawn_time,
  ];
  var sql =
    "INSERT INTO poke_info (id,num,name,img,height,weight,candy,candy_count,egg,spawn_chance,avg_spawns,spawn_time) VALUES (?)";

  con.query(sql, [values], function (err, result) {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        res.end("Record already exists");
      }
      throw err;
    } else {
      console.log("poke_info record inserted: " + result.affectedRows);
      sql = "INSERT INTO weaknesses (id,weakness) VALUES ?";

      con.query(sql, [weakness], function (err, result) {
        if (err) throw err;
        console.log("weaknesses record inserted: " + result.affectedRows);
        res.end("Records inserted");
      });
    }
  });
});

router.post("/updatePokeInfo", function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  const num = req.body.num;
  const name = req.body.name;
  const img = req.body.img;
  const height = req.body.height;
  const weight = req.body.weight;
  const candy = req.body.candy;
  const candy_count = req.body.candy_count;
  const egg = req.body.egg;
  const spawn_chance = req.body.spawn_chance;
  const avg_spawns = req.body.avg_spawns;
  const spawn_time = req.body.spawn_time;
  const weaknesses = req.body.weaknesses;
  var values = [];
  weaknesses.forEach((weakness) => {
    values.push([id, weakness]);
  });

  var sql = `UPDATE poke_info SET num='${num}',name = '${name}', img = '${img}', height='${height}', weight='${weight}', candy='${candy}', candy_count=${candy_count},
    egg='${egg}', spawn_chance=${spawn_chance}, avg_spawns=${avg_spawns}, spawn_time='${spawn_time}' WHERE id = ${id}`;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  values.forEach((element) => {
    var sql = `UPDATE weaknesses SET id=${element[0]}, weakness='${element[1]}' WHERE id = ${id}`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  });
  res.end("Data updated");
});

router.delete("/:pokeId", (req, res) => {
  const pokeId = req.params.pokeId;

  if (pokeId === -1) return res.status(404).json({});

  var sql = "DELETE FROM poke_info WHERE id = " + pokeId;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
  res.end(pokeId + " id deleted.");
});

module.exports = router;
