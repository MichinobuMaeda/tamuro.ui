<?php

namespace App\Services;

use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;

use App\Services\PageHistoryService;
use App\Message;

class ViewHelperService
{
    /**
     * Create a new view helper instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->providers = [
            'facebook' => Lang::getFromJson('Facebook'),
            'yahoo_jp' => Lang::getFromJson('Yahoo! JAPAN'),
            'amazon' => Lang::getFromJson('Amazon'),
            'google' => Lang::getFromJson('Google'),
        ];
    }

    /**
     * Get provider list.
     * 
     * @return string
     */
    public function getProviders()
    {
        return array_keys($this->providers);
    }

    /**
     * Get provider display name.
     * 
     * @param string $provider
     * @return string
     */
    public function getProviderName($provider)
    {
        return $this->providers[$provider];
    }

    /**
     * Set the user's preferred time zone or APP_DEFAULT_TIMEZONE.
     * 
     * @param Datetime $val
     * @return Datetime
     */
    public function setTimezone($val) {
        if (!$val) { return $val; }
        $ret = clone $val;
        $user = Auth::user();
        $ret->setTimezone(new DateTimeZone(
            ($user && $user->timezone)
                ? $user->timezone
                : config('tamuro.default_timezone')
        ));
        return $ret;
    }

    /**
     * Get date as format APP_DATE_FORMAT
     * with the user's preferred time zone or APP_DEFAULT_TIMEZONE.
     * 
     * @param Datetime $val
     * @return Datetime
     */
    public function formatDate($val) {
        if (!$val) { return $val; }
        $ret = $this->setTimezone($val);
        return $ret->format(config('tamuro.date_format'));
    }

    /**
     * Get time as format APP_TIME_FORMAT
     * with the user's preferred time zone or APP_DEFAULT_TIMEZONE.
     * 
     * @param Datetime $val
     * @return Datetime
     */
    public function formatTime($val) {
        if (!$val) { return $val; }
        $ret = $this->setTimezone($val);
        return $ret->format(config('tamuro.time_format'));
    }

    /**
     * Get formated date and time as format APP_DATE_TIME_FORMAT
     * with the user's preferred time zone or APP_DEFAULT_TIMEZONE.
     * 
     * @param Datetime $val
     * @return Datetime
     */
    public function formatDateTime($val) {
        if (!$val) { return $val; }
        $ret = $this->setTimezone($val);
        return $ret->format(config('tamuro.date_time_format'));
    }

    /**
     * Get formated timestamp as format APP_TIMESTAMP_FORMAT
     * with the user's preferred time zone or APP_DEFAULT_TIMEZONE.
     * 
     * @param Datetime $val
     * @return Datetime
     */
    public function formatTimestamp($val) {
        if (!$val) { return $val; }
        $ret = $this->setTimezone($val);
        return $ret->format(config('tamuro.timestamp_format'));
    }

    /**
     * Get the message of the key.
     * 
     * @param string $key
     * @return string
     */
    public function message($key) {
        $message = Message::where('key', $key)
            ->where('locale', Lang::getLocale())->first();
        return $message ? $message->message : $key;
    }

    /**
     * Is the page history of backward.
     * 
     * @param Object $session
     * @return boolean
     */
    public function isPagePrev($session)
    {
        return !!(new PageHistoryService($session))->prev();
    }

    /**
     * Is the page history of forward.
     * 
     * @param Object $session
     * @return boolean
     */
    public function isPageNext($session)
    {
        return !!(new PageHistoryService($session))->next();
    }

    /**
     * List of timezones supported by PHP.
     * 
     * @param boolean $includeOthers
     */
    public function timezones($includeOthers = false)
    {
        return array_merge(
            [
                "Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers",
                "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul",
                "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura",
                "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry",
                "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala",
                "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare",
                "Africa/Johannesburg", "Africa/Juba", "Africa/Kampala", "Africa/Khartoum",
                "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville",
                "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka",
                "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane",
                "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena",
                "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo",
                "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek",
                "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua",
                "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba",
                "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos",
                "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman",
                "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan",
                "America/Bahia", "America/Bahia_Banderas", "America/Barbados", "America/Belem",
                "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota",
                "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun",
                "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago",
                "America/Chihuahua", "America/Costa_Rica", "America/Creston", "America/Cuiaba",
                "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek",
                "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton",
                "America/Eirunepe", "America/El_Salvador", "America/Fort_Nelson", "America/Fortaleza",
                "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk",
                "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil",
                "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo",
                "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg",
                "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac",
                "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau",
                "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Kralendijk", "America/La_Paz",
                "America/Lima", "America/Los_Angeles", "America/Lower_Princes", "America/Maceio",
                "America/Managua", "America/Manaus", "America/Marigot", "America/Martinique",
                "America/Matamoros", "America/Mazatlan", "America/Menominee", "America/Merida",
                "America/Metlakatla", "America/Mexico_City", "America/Miquelon", "America/Moncton",
                "America/Monterrey", "America/Montevideo", "America/Montserrat", "America/Nassau",
                "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha",
                "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Ojinaga",
                "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix",
                "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico",
                "America/Punta_Arenas", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife",
                "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santarem",
                "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund",
                "America/Sitka", "America/St_Barthelemy", "America/St_Johns", "America/St_Kitts",
                "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current",
                "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana",
                "America/Toronto", "America/Tortola", "America/Vancouver", "America/Whitehorse",
                "America/Winnipeg", "America/Yakutat", "America/Yellowknife",
                "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie",
                "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera",
                "Antarctica/Syowa", "Antarctica/Troll", "Antarctica/Vostok",
                "Arctic/Longyearbyen",
                "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr",
                "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Atyrau",
                "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok",
                "Asia/Barnaul", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei",
                "Asia/Chita", "Asia/Choibalsan", "Asia/Colombo", "Asia/Damascus",
                "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe",
                "Asia/Famagusta", "Asia/Gaza", "Asia/Hebron", "Asia/Ho_Chi_Minh",
                "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta",
                "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka",
                "Asia/Karachi", "Asia/Kathmandu", "Asia/Khandyga", "Asia/Kolkata",
                "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait",
                "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila",
                "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", "Asia/Novosibirsk",
                "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak",
                "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Riyadh",
                "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai",
                "Asia/Singapore", "Asia/Srednekolymsk", "Asia/Taipei", "Asia/Tashkent",
                "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo",
                "Asia/Tomsk", "Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Ust-Nera",
                "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yangon",
                "Asia/Yekaterinburg", "Asia/Yerevan",
                "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde",
                "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia",
                "Atlantic/St_Helena", "Atlantic/Stanley",
                "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie",
                "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/Lindeman",
                "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
                "Europe/Amsterdam", "Europe/Andorra", "Europe/Astrakhan", "Europe/Athens",
                "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels",
                "Europe/Bucharest", "Europe/Budapest", "Europe/Busingen", "Europe/Chisinau",
                "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey",
                "Europe/Helsinki", "Europe/Isle_of_Man", "Europe/Istanbul", "Europe/Jersey",
                "Europe/Kaliningrad", "Europe/Kiev", "Europe/Kirov", "Europe/Lisbon",
                "Europe/Ljubljana", "Europe/London", "Europe/Luxembourg", "Europe/Madrid",
                "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco",
                "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica",
                "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara",
                "Europe/San_Marino", "Europe/Sarajevo", "Europe/Saratov", "Europe/Simferopol",
                "Europe/Skopje", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn",
                "Europe/Tirane", "Europe/Ulyanovsk", "Europe/Uzhgorod", "Europe/Vaduz",
                "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd",
                "Europe/Warsaw", "Europe/Zagreb", "Europe/Zaporozhye", "Europe/Zurich",
                "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos",
                "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives",
                "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion",
                "Pacific/Apia", "Pacific/Auckland", "Pacific/Bougainville", "Pacific/Chatham",
                "Pacific/Chuuk", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury",
                "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos",
                "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu",
                "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro",
                "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue",
                "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau",
                "Pacific/Pitcairn", "Pacific/Pohnpei", "Pacific/Port_Moresby", "Pacific/Rarotonga",
                "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu",
                "Pacific/Wake", "Pacific/Wallis",
                "UTC",
            ],
            ($includeOthers ? [
                "Africa/Asmera", "Africa/Timbuktu", "America/Argentina/ComodRivadavia", "America/Atka",
                "America/Buenos_Aires", "America/Catamarca", "America/Coral_Harbour", "America/Cordoba",
                "America/Ensenada", "America/Fort_Wayne", "America/Indianapolis", "America/Jujuy",
                "America/Knox_IN", "America/Louisville", "America/Mendoza", "America/Montreal",
                "America/Porto_Acre", "America/Rosario", "America/Santa_Isabel", "America/Shiprock",
                "America/Virgin", "Antarctica/South_Pole", "Asia/Ashkhabad", "Asia/Calcutta",
                "Asia/Chongqing", "Asia/Chungking", "Asia/Dacca", "Asia/Harbin",
                "Asia/Istanbul", "Asia/Kashgar", "Asia/Katmandu", "Asia/Macao",
                "Asia/Rangoon", "Asia/Saigon", "Asia/Tel_Aviv", "Asia/Thimbu",
                "Asia/Ujung_Pandang", "Asia/Ulan_Bator", "Atlantic/Faeroe", "Atlantic/Jan_Mayen",
                "Australia/ACT", "Australia/Canberra", "Australia/LHI", "Australia/North",
                "Australia/NSW", "Australia/Queensland", "Australia/South", "Australia/Tasmania",
                "Australia/Victoria", "Australia/West", "Australia/Yancowinna", "Brazil/Acre",
                "Brazil/DeNoronha", "Brazil/East", "Brazil/West", "Canada/Atlantic",
                "Canada/Central", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland",
                "Canada/Pacific", "Canada/Saskatchewan", "Canada/Yukon", "CET",
                "Chile/Continental", "Chile/EasterIsland", "CST6CDT", "Cuba",
                "EET", "Egypt", "Eire", "EST",
                "EST5EDT", "Etc/GMT", "Etc/GMT+0", "Etc/GMT+1",
                "Etc/GMT+10", "Etc/GMT+11", "Etc/GMT+12", "Etc/GMT+2",
                "Etc/GMT+3", "Etc/GMT+4", "Etc/GMT+5", "Etc/GMT+6",
                "Etc/GMT+7", "Etc/GMT+8", "Etc/GMT+9", "Etc/GMT-0",
                "Etc/GMT-1", "Etc/GMT-10", "Etc/GMT-11", "Etc/GMT-12",
                "Etc/GMT-13", "Etc/GMT-14", "Etc/GMT-2", "Etc/GMT-3",
                "Etc/GMT-4", "Etc/GMT-5", "Etc/GMT-6", "Etc/GMT-7",
                "Etc/GMT-8", "Etc/GMT-9", "Etc/GMT0", "Etc/Greenwich",
                "Etc/UCT", "Etc/Universal", "Etc/UTC", "Etc/Zulu",
                "Europe/Belfast", "Europe/Nicosia", "Europe/Tiraspol", "Factory",
                "GB", "GB-Eire", "GMT", "GMT+0",
                "GMT-0", "GMT0", "Greenwich", "Hongkong",
                "HST", "Iceland", "Iran", "Israel",
                "Jamaica", "Japan", "Kwajalein", "Libya",
                "MET", "Mexico/BajaNorte", "Mexico/BajaSur", "Mexico/General",
                "MST", "MST7MDT", "Navajo", "NZ",
                "NZ-CHAT", "Pacific/Johnston", "Pacific/Ponape", "Pacific/Samoa",
                "Pacific/Truk", "Pacific/Yap", "Poland", "Portugal",
                "PRC", "PST8PDT", "ROC", "ROK",
                "Singapore", "Turkey", "UCT", "Universal",
                "US/Alaska", "US/Aleutian", "US/Arizona", "US/Central",
                "US/East-Indiana", "US/Eastern", "US/Hawaii", "US/Indiana-Starke",
                "US/Michigan", "US/Mountain", "US/Pacific", "US/Pacific-New",
                "US/Samoa", "W-SU", "WET",
                "Zulu",
            ] : []));
    }
}
