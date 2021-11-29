# secret-santa-twilio

### [Blog Post!](http://lukecod.es/2015/12/02/secret-santa-sms-with-twilio/)

Secret Santa over SMS with Twilio.

## Prereqs

1. Buy a Twilio number for $1 from your [console](https://console.twilio.com/us1/develop/phone-numbers/manage/search?frameUrl=%2Fconsole%2Fphone-numbers%2Fsearch%3Fx-target-region%3Dus1&currentFrameUrl=%2Fconsole%2Fphone-numbers%2Fsearch%3FisoCountry%3DUS%26searchTerm%3D%26searchFilter%3Dleft%26searchType%3Dnumber%26x-target-region%3Dus1%26__override_layout__%3Dembed%26bifrost%3Dtrue)
2. Get your API credentials from your [console](https://console.twilio.com/us1/develop/sms/overview?frameUrl=%2Fconsole%2Fsms%2Fdashboard%3Fx-target-region%3Dus1)
3. Make sure your Twilio account is funded enough to send your messages

## Usage

```sh
# Or put this all in a config file and do either:
# `cat config.json | npx secret-santa-twilio`
# `npx secret-santa-twilio --config config.json`

npx secret-santa-twilio \
  --accountSid "ACCOUNT_SID" \
  --accountToken "ACCOUNT_TOKEN" \
  --from "+15005550006" \
  --message "Hey {{name}}, get a gift for {{recipient}}" \
  --participants '[{"name":"Alice","number":"500-555-1111"},{"name":"Bob","number":"500-555-2222"}]' \
  --dry

> Dry run: true
> Participants:
> -- Alice +15005551111
> -- Bob +15005552222
> Results:
> [
>   {
>     "status": "sent",
>     "message": {
>       "from": "+15005550006",
>       "to": "+15005551111",
>       "body": "Hey Alice, get a gift for Bob"
>     }
>   },
>   {
>     "status": "sent",
>     "message": {
>       "from": "+15005550006",
>       "to": "+15005552222",
>       "body": "Hey Bob, get a gift for Alice"
>     }
>   }
> ]
```

Only the resulting message `sid` and `to` phone number will be output and written to a file, so there's no chance of the person running this program seeing the results.

## Env Vars

If you don't want to supply your `accountSid` and `accountToken` in the CLI args, you can set them via the `TWILIO_SID` and `TWILIO_TOKEN` environment variables or as keys in a config json file.

## Config

Here's a sample of what your configuration file should look like. Use `--config` to specify a path to this file or pass it via stdin and it will be merged with any options from the CLI.

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
      "skip": ["Bob"] // (Optional) Array of other participant names which they cant be assigned
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

Let's say someone changed their phone number and you sent the message to their old number. Look in the results file created during your run (it should be in whatever directory you ran the program from) and find the `sid` associated with their old number. If you don't have the file, then you can get the `sid` from from the [Twilio message logs](https://www.twilio.com/console/phone-numbers/incoming). Then you can run this command to send the same message to their new number. Thank you Austin for inspiring this feature in 2019.

```sh
npx secret-santa-twilio \
  --accountSid "ACCOUNT_SID" \
  --accountToken "ACCOUNT_TOKEN" \
  --sid "MESSAGE_SID" \
  --to "+15551234567"
```

## Tests

If you want to run the tests locally, you will need to create a `.env` file with `TWILIO_SID` and `TWILIO_TOKEN` test credential values.

## LICENSE

MIT
