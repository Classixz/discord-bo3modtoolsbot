# BO3 Mod Tools Bot

The bot requires a `.env`-file with the following content:


```env
BOT_PREFIX="+"
BOT_TOKEN=""
MANAGEMENT_ROLES="230716098142535682,235106191225651225"
DB_HOST=""
DB_USER=""
DB_PASSWORD=""
DB_NAME=""
VERIFICATION_URL=""
VERIFICATION_API_KEY=""
```
Bare minimum to run the bot required information for `BOT_PREFIX`, `BOT_TOKEN` and `MANAGEMENT_ROLES`.

To use / test role saving, the following SQL is needed:
```sql
CREATE TABLE `rolehistory` (
  `guild` bigint(20) NOT NULL,
  `memberid` bigint(20) NOT NULL,
  `roles` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
