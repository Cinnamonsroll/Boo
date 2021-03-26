let { Router } = require("express");
const router = Router();
let client = global.client;
const btoa = require("btoa");
const fetch = require("node-fetch");
let games = [{ name: "tictactoe", aliases: ["ttt"] }];
router.get("/", async (req, res) => {
  let { game, pos: position, uid } = req.query;
  const buff = Buffer.from(JSON.stringify({ game, pos: position })).toString(
    "base64"
  );
  if (!uid)
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${
        client.user.id
      }&scope=identify&state=${buff}&redirect_uri=${encodeURIComponent(
        "https://someone-please-end.glitch.me/ttt-auth"
      )}&response_type=code`
    );
  if (
    !game ||
    !games.find(
      x =>
        x.name === game.toLowerCase() || x.aliases.includes(game.toLowerCase())
    )
  )
    return res.json({ error: true, message: "Please give a valid game" });
  if (uid) {
    client.tictactoe.makeMove(position, uid);
    return res.status(200).send({ message: "200 ok ig" });
  }
});
router.get("/ttt-auth", async (req, res) => {
  const data = req.query;
  const { code, state } = data;
  const otherData = Object.assign(
    {
      client_id: client.user.id,
      client_secret: process.env.DISCORD_CLIENT_SECRET || client.config.secret,
      grant_type: "authorization_code",
      redirect_uri:
        process.env.DISCORD_CLIENT_REDIRECT || client.config.redirect,
      scope: "identify"
    },
    data
  );
  const json = JSON.parse(Buffer.from(state, "base64").toString());
  const userinfo = await fetch(
    "https://discord_user_info_oauth.splatterxl.repl.co/authorize",
    { body: JSON.stringify(otherData), method: "post" }
  ).then(res => res.json());
  console.log(userinfo);
  if (userinfo.code !== undefined)
    return res.status(500).send({ message: "Internal Error (uwu)" /* LOL */ });
  client.tictactoe.makeMove(json.pos, userinfo.id);
  return res.status(200).send({ message: "everything ok? I guess?" });
});
module.exports = router;
