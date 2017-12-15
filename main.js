const ChatBot = require('vk-chat-bot');

// For easy time formatting
const moment = require('moment');

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

bot = new ChatBot(params);

bot.on("message_allow", (obj) => {
  return "Hello, thanks for allowing us to send you messages.";
});

bot.on("no_match", (obj) => {
  return "I don't know how to respond to your message.";
});

bot.cmd("test", "sure thing tests something", (msg, obj) => {
  return "Test success! Your message content was: '" + msg + "'.";
});

bot.cmd("help", "shows the help message", (msg, obj) => {
  return "Test Bot v1.0" + bot.help();
});

bot.cmd("time", "reports the current time in UTC", (msg, obj) => {
  var m = moment();
  m.utc();
  time = m.format('hh:mm:ss');
  return "It is " + time + " (UTC) now.";
});

bot.cmd("date", "reports the current date in UTC", (msg, obj) => {
  var m = moment();
  m.utc();
  date = m.format('MMMM Do YYYY [(]dddd[)]');
  return "It is " + date + " (UTC) now.";
});

bot.regex("(hi|hello|hey)", (msg, obj) => {
  return "Hello, I am a test bot. You said: " + msg;
});

bot.start(port);
