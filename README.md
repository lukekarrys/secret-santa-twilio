# secret-santa-twilio

### [Blog Post!](http://lukecod.es/2015/12/02/secret-santa-sms-with-twilio/)

Secret Santa over SMS with Twilio.

**Important: Your Twilio account will need to be properly funded to use this. The cost is $1/mo to get a Twilio number (which can be released after running this) and $0.0075 per message.**

## Usage

```sh
TWILIO_SID=SID TWILIO_TOKEN=TOKEN npx secret-santa-twilio \
  --from "+15005550006" \
  --message "Hey {{name}}, get a gift for {{recipient}}!" \
  --participants '[{"name":"Luke","number":"+15005550006"},{name:"Dinah","number":"+15005550006"}]' \
  --dry
  # Or put this all in a config file
  # --config config.json
```

## Config

Here's a sample of what your configuration file should look like:

```js
{
  "accountSid": "SID", // Twilio SID
  "accountToken": "TOKEN" // Twilio auth token
  "from": "+15551234567" // Twilio number to send SMS from
  // Optional message, see lib/messages.js for the default
  "message": "Hey {{name}} buy something for {{recipient}}!",
  "participants": [
    {
      "name": "Luke", // Name, must be unique
      "number": "+15005550006", // Mobile number to send SMS to
      "skip": [] // (Optional) Array of other participant names which they cant be assigned
    },
    {
      "name": "Bob",
      "number": "+15005550006"
    },
    ...
  ]
}
```

### Whoops, you put in a wrong phone number...

I've done this before so I added a command for this. This is designed so you never see the recipients printed to your terminal, but it will save each message `sid` to a file. Let's say someone changes their phone number and you sent the message to their old number. Look in the file and find the `sid` associated with their old number and run the following command. If you don't have the file, then you can get the `sid` from from the [Twilio message logs](https://www.twilio.com/console/phone-numbers/incoming).

```sh
TWILIO_SID=SID TWILIO_TOKEN=TOKEN npx secret-santa-twilio --sid "SID" --to "+1THE_NEW_NUMBER"
```

## Tests

If you want to run the tests locally, you will need to create a `.env` file with `TEST_SID` and `TEST_TOKEN` values.

## LICENSE

MIT
