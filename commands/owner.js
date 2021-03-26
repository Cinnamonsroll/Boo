const { ocmd, tree } = require("../utils/cmd.js");

ocmd("eval", "e", "ev", async ctx => {
  let {
    client: { createMessage, createEmbed, color },
    commandFunctions: { pagify }
  } = ctx;
  let code = ctx.args.join(" ").replace(/\`\`\`(\w+)?/g, "");
  if (!code) return await ctx.client.createMessage(ctx, "Please include code");
  try {
    let evaled = eval(code);
    let typeEval,
      isAny = false,
      isPromise = false,
      util = require("util");
    if (evaled && evaled instanceof Promise) {
      isPromise = true;
      evaled = await evaled;
    }
    const types = [];
    if (typeof evaled === "object" && !Array.isArray(evaled)) {
      typeEval =
        evaled === null ||
        !evaled.constructor ||
        evaled.constructor.name === "Object"
          ? "Object"
          : `instanceof class<${evaled.constructor.name}>`;
    } else if (Array.isArray(evaled)) {
      for (const elementType of evaled) {
        const type =
          elementType === undefined
            ? "void"
            : elementType === null ||
              !elementType.constructor ||
              elementType.constructor.name === "Object"
            ? "Object"
            : typeof elementType === "object" && Array.isArray(elementType)
            ? "Array"
            : typeof elementType === "object"
            ? elementType.constructor.name
            : typeof elementType;

        if (types.length > 1) {
          if (types[0] !== type) {
            isAny = true;
            break;
          }
        }

        types.push(type);
      }
      typeEval = types.length ? (isAny ? "any[]" : `${types[0]}[]`) : "Array";
    } else {
      typeEval = evaled === undefined ? "void" : typeof evaled;
    }

    if (isPromise) typeEval = `Promise<${typeEval}>`;
    if (typeof evaled !== "string") evaled = util.inspect(evaled);

    evaled = evaled
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`);
    let stringTools = new (require("string-toolkit"))();
    let hrStart = process.hrtime();
    let hrDiff;
    hrDiff = process.hrtime(hrStart);
    let evalEmbeds = stringTools.toChunks(evaled, 2000).map(thing =>
      createEmbed({
        color: color,
        description: `\`\`\`js\n${thing}\`\`\``,
        fields: [
          { name: "Type of", value: `\`\`\`css\n${typeEval}\`\`\`` },
          {
            name: "Time",
            value: `\`\`\`css\n${
              hrDiff[0] > 0 ? `${hrDiff[0]}s` : ""
            }${hrDiff[1] / 1000}ms\`\`\``
          }
        ]
      })
    );
    return await pagify(ctx, {
      type: "embed",
      messages: evalEmbeds,
      pages: true
    });
  } catch (err) {
    const embed = createEmbed({
      color,
      title: `${ctx.emojis["no"]} Error`,
      description: `\`\`\`js\n ${err.message}\`\`\``
    });

    return await ctx.client.createMessage(ctx, embed);
  }
}).help({
  name: "eval",
  description: "Evals code",
  aliases: ["e", "ev"],
  usage: "[code]",
  category: "owner",
  owner: "True"
});
