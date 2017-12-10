const bot = require('vk-chat-bot');

// Server port
const port = process.env.PORT;

var params = {
  vk_api_key: process.env.VK_API_KEY,

  // Confirmation parameters, can be found in group Callback API settings
  confirmation_token: process.env.CONFIRMATION_TOKEN,
  group_id: process.env.GROUP_ID,

  // Secret key, set it in group Callback API settings
  secret: process.env.SECRET,

  // Command prefix, optional
  cmd_prefix: process.env.CMD_PREFIX
}

bot.init(params);

bot.on("message_allow", (obj) => {
  return "Hello, thanks for allowing us to send you messages.";
});

bot.on("no_match", (obj) => {
  return "I don't know how to respond to your message.";
});

bot.cmd("test", "test command", (msg, obj) => {
  return "Test success! Your message content (excluding command) was: '" + msg + "'.";
});

bot.cmd("help", "shows help", (msg, obj) => {
  return "Test Bot v1.0" + bot.help();
});

bot.regex("(hi|hello|hey)", (msg, obj) => {
  return "Hello, I am a test bot. You said: " + msg;
});

bot.start(port);
