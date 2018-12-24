const vk = require('vk-chat-bot'); // vk-chat-bot framework
const moment = require('moment'); // For easy time formatting

// /////////////////////////////// CONFIGURATION ////////////////////////////////

const params = {
  vkToken: process.env.VK_API_KEY, // VK API token
  confirmationToken: process.env.CONFIRMATION_TOKEN, // Can be found in group Callback API settings
  groupId: process.env.GROUP_ID, // Can be found in group Callback API settings
  secret: process.env.SECRET, // Secret key, set it in group Callback API settings
  port: process.env.PORT, // Port to run the bot at

  cmdPrefix: process.env.CMD_PREFIX, // Command prefix, optional
};

// ////////////////////////////// CREATE THE BOT ////////////////////////////////

const { bot, core } = vk.bot(params);

// ///////////////////////////// CREATE A KEYBOARD //////////////////////////////

const { colors, Button, Keyboard } = vk.kbd;

const kbd = new Keyboard([
  // Rows
  [
    new Button('/now'),
    new Button('/info', colors.primary),
    new Button('/rmkbd', colors.negative),
    new Button('/help', colors.positive),
  ],
  [
    new Button('Max rows: 10', colors.default, { a: 'b' }),
    new Button('Max cols: 4', colors.default, { a: 'b', c: 'd' }),
  ],
], false); // Set 'true' instead of 'false' to make it disappear after a button was pressed

// ///////////////////////// THE BEHAVIOR DEFENITIONS ///////////////////////////
// ////////////////////////         PAYLOADS           //////////////////////////

// Exact payload match
core.payload({ a: 'b' }, ($) => {
  $.text(`The message '${$.msg}' has a secret payload in it!`);
});

// Dynamic payload
// In this case, the handler will run only if the payload's property `c` contains the value `d`.
core.payload((payload, parsed) => {
  if (parsed) { // If the payload is a valid JSON
    return parsed.c === 'd';
  }
  return false;
}, ($) => {
  $.text(`In message '${$.msg}', payload.c is 'd'!`);
});

// /////////////////////////         EVENTS           ///////////////////////////

core.on('start', ($) => {
  $.text('Hello, this is an example bot for `vk-chat-bot`!');
  $.keyboard(kbd);
  // $.send() is called automatically after the handler
});

core.on('message_edit', ($) => {
  $.text(`You edited a message, now it looks like this: ${$.msg}`);
});

core.on('no_match', ($) => {
  $.text("I don't know how to respond.");
});

core.on('message_allow', ($) => {
  $.text('Thanks for allowing us to send you messages.');
});

core.on('message_typing_state', ($) => {
  $.text('Type faster please, I can\'t wait to see your message!');
});

core.on('handler_error', ($) => {
  $.text('Oops, looks like something went wrong.');
});

core.on('service_action', ($) => {
  $.text(`Received a service action '${JSON.stringify($.obj.action)}'!`);
});

// ////////////////////////         COMMANDS           //////////////////////////

// If cmd_prefix is "/", we search for "/help" in the beginning of the message
core.cmd('help', ($) => {
  // core.help() returns the full help message
  $.text(`Test Bot v1.0${core.help()}`);

  // Attach a nice image from https://vk.com/team?z=photo6492_456240778
  $.attach('photo', 6492, 456240778);
}, 'shows the help message');

core.cmd('keyboard', ($) => {
  $.text('Here is your keyboard, as promised.');
  $.keyboard(kbd);
}, 'demo keyboard');

core.cmd('rmkbd', ($) => {
  $.text('Ok, ok, no keyboard for you.');
  $.removeKeyboard();
}, 'removes keyboard');

core.cmd('now', ($) => {
  // Format time using 'moment' library
  const now = moment().utc().format('MMMM Do YYYY [(]dddd[)] hh:mm:ss A');

  $.text(`It is ${now} UTC now.`);
}, 'reports the current date and time in UTC');

core.cmd('info', async ($) => {
  const uid = $.obj.from_id;

  // Call VK API to get information about the user
  const response = await $.api.scheduleCall('users.get', { user_ids: uid });
  const userInfo = response[0];

  const name = userInfo.first_name;
  const surname = userInfo.last_name;

  $.text(`User ID: ${uid}\nName: ${name} ${surname}`);
}, 'uses VK API to get some information about you');

// //////////////////////////         REGEX           ///////////////////////////

// When the message contains a word "hi", "hello" or "hey"
// Ignoring case with /i
core.regex(/h(i|ello|ey)/i, ($) => {
  $.text(`Hello, I am a test bot. You said: ${$.msg}`);
});

// ////////////////////////////// OTHER CONFIG //////////////////////////////////
core.noEventWarnings(); // Prevent warnings about missing event handlers

// ///////////////////////////// START THE BOT //////////////////////////////////
bot.start();
