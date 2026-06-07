/**
 * One-off authoring helper for Sukkah chapter 1.
 * Run: pnpm exec tsx scripts/author-sukkah-ch1.ts
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ChapterSchema } from '../src/content/schema.ts'

type Pair = { he: string; en: string; translit?: string }

const MISHNAYOT: Pair[][] = [
  // 1:1
  [
    {
      he: 'סֻכָּה שֶׁהִיא גְבוֹהָה לְמַעְלָה מֵעֶשְׂרִים אַמָּה, פְּסוּלָה.',
      en: 'A sukka that is more than twenty cubits high is unfit.',
      translit: "Sukkah shehi gevoha lemaala me'esrim amah, pesulah",
    },
    { he: 'רַבִּי יְהוּדָה מַכְשִׁיר.', en: 'Rabbi Yehuda deems it fit.' },
    {
      he: 'וְשֶׁאֵינָהּ גְּבוֹהָה עֲשָׂרָה טְפָחִים, וְשֶׁאֵין לָהּ שְׁלֹשָׁה דְּפָנוֹת, וְשֶׁחַמָּתָהּ מְרֻבָּה מִצִּלָּתָהּ, פְּסוּלָה.',
      en: 'A sukka that is not even ten handbreadths high, one that does not have three walls, and one whose sunlight is greater than its shade are unfit.',
    },
    {
      he: 'סֻכָּה יְשָׁנָה, בֵּית שַׁמַּאי פּוֹסְלִין, וּבֵית הִלֵּל מַכְשִׁירִין.',
      en: 'An old sukka: Beit Shammai deem it unfit and Beit Hillel deem it fit.',
    },
    {
      he: 'וְאֵיזוֹ הִיא סֻכָּה יְשָׁנָה, כָּל שֶׁעֲשָׂאָהּ קֹדֶם לֶחָג שְׁלשִׁים יוֹם.',
      en: 'Which is an old sukka? Any that one made thirty days before the festival.',
    },
    {
      he: 'אֲבָל אִם עֲשָׂאָהּ לְשֵׁם חָג, אֲפִלּוּ מִתְּחִלַּת הַשָּׁנָה, כְּשֵׁרָה:',
      en: 'But if one made it for the sake of the festival, even from the beginning of the year, it is fit.',
    },
  ],
  // 1:2
  [
    {
      he: 'הָעוֹשֶׂה סֻכָּתוֹ תַחַת הָאִילָן, כְּאִלּוּ עֲשָׂאָהּ בְּתוֹךְ הַבָּיִת.',
      en: 'One who establishes his sukka beneath a tree — it is as though he established it inside the house.',
    },
    {
      he: 'סֻכָּה עַל גַּבֵּי סֻכָּה, הָעֶלְיוֹנָה כְשֵׁרָה, וְהַתַּחְתּוֹנָה פְּסוּלָה.',
      en: 'A sukka atop another sukka: the upper is fit and the lower is unfit.',
    },
    {
      he: 'רַבִּי יְהוּדָה אוֹמֵר, אִם אֵין דִּיּוּרִין בָּעֶלְיוֹנָה, הַתַּחְתּוֹנָה כְּשֵׁרָה:',
      en: 'Rabbi Yehuda says: if there are no residents in the upper sukka, the lower sukka is fit.',
    },
  ],
  // 1:3
  [
    {
      he: 'פֵּרַס עָלֶיהָ סָדִין מִפְּנֵי הַחַמָּה, אוֹ תַּחְתֶּיהָ מִפְּנֵי הַנְּשָׁר, אוֹ שֶׁפֵּרַס עַל גַּבֵּי הַקִּינוֹף, פְּסוּלָה.',
      en: 'If one spread a sheet over the sukka for sun, beneath it for falling leaves, or over a four-post bed frame, it is unfit.',
    },
    {
      he: 'אֲבָל פּוֹרֵס הוּא עַל גַּבֵּי נַקְלִיטֵי הַמִּטָּה:',
      en: 'However, one may spread a sheet over the two-post bed frame.',
    },
  ],
  // 1:4
  [
    {
      he: 'הִדְלָה עָלֶיהָ אֶת הַגֶּפֶן וְאֶת הַדְּלַעַת וְאֶת הַקִּסּוֹם וְסִכֵּךְ עַל גַּבָּהּ, פְּסוּלָה.',
      en: 'If one trellised a vine, gourd, or ivy over the sukka while attached to the ground and roofed atop them, it is unfit.',
    },
    {
      he: 'וְאִם הָיָה סִכּוּךְ הַרְבֵּה מֵהֶן, אוֹ שֶׁקְּצָצָן, כְּשֵׁרָה.',
      en: 'If the fit roofing was greater than the plants, or he cut them, it is fit.',
    },
    {
      he: 'זֶה הַכְּלָל, כֹּל שֶׁהוּא מְקַבֵּל טֻמְאָה וְאֵין גִּדּוּלוֹ מִן הָאָרֶץ, אֵין מְסַכְּכִין בּוֹ.',
      en: 'This is the principle: anything susceptible to impurity or not grown from the ground may not be used for schach.',
    },
    {
      he: 'וְכָל דָּבָר שֶׁאֵינוֹ מְקַבֵּל טֻמְאָה וְגִדּוּלוֹ מִן הָאָרֶץ, מְסַכְּכִין בּוֹ:',
      en: 'Anything not susceptible to impurity and grown from the ground may be used for schach.',
    },
  ],
  // 1:5
  [
    {
      he: 'חֲבִילֵי קַשׁ וַחֲבִילֵי עֵצִים וַחֲבִילֵי זְרָדִין, אֵין מְסַכְּכִין בָּהֶן.',
      en: 'One may not roof with bundles of straw, wood, or twigs.',
    },
    {
      he: 'וְכֻלָּן שֶׁהִתִּירָן, כְּשֵׁרוֹת.',
      en: 'If one untied them, they are fit.',
    },
    {
      he: 'וְכֻלָּן כְּשֵׁרוֹת לַדְּפָנוֹת:',
      en: 'And all of them are fit for walls.',
    },
  ],
  // 1:6
  [
    {
      he: 'מְסַכְּכִין בִּנְסָרִים, דִּבְרֵי רַבִּי יְהוּדָה.',
      en: 'One may roof with boards; this is Rabbi Yehuda.',
    },
    { he: 'וְרַבִּי מֵאִיר אוֹסֵר.', en: 'Rabbi Meir prohibits.' },
    {
      he: 'נָתַן עָלֶיהָ נֶסֶר שֶׁהוּא רָחָב אַרְבָּעָה טְפָחִים, כְּשֵׁרָה, וּבִלְבַד שֶׁלֹא יִישַׁן תַּחְתָּיו:',
      en: 'If one placed a board four handbreadths wide atop the sukka, it is fit — provided he does not sleep beneath it.',
    },
  ],
  // 1:7
  [
    {
      he: 'תִּקְרָה שֶׁאֵין עָלֶיהָ מַעֲזִיבָה, רַבִּי יְהוּדָה אוֹמֵר, בֵּית שַׁמַּאי אוֹמְרִים, מְפַקְפֵּק וְנוֹטֵל אַחַת מִבֵּינְתַיִם, וּבֵית הִלֵּל אוֹמְרִים, מְפַקְפֵּק אוֹ נוֹטֵל אַחַת מִבֵּינְתַיִם.',
      en: 'For a plank ceiling without plaster, Rabbi Yehuda says: Beit Shammai require moving boards and removing one; Beit Hillel require either moving or removing one.',
    },
    {
      he: 'רַבִּי מֵאִיר אוֹמֵר, נוֹטֵל אַחַת מִבֵּינְתַיִם, וְאֵין מְפַקְפֵּק:',
      en: 'Rabbi Meir says: remove one from among them, but do not move them.',
    },
  ],
  // 1:8
  [
    {
      he: 'הַמְקָרֶה סֻכָּתוֹ בְשַׁפּוּדִין אוֹ בַאֲרֻכּוֹת הַמִּטָּה, אִם יֵשׁ רֶוַח בֵּינֵיהֶן כְּמוֹתָן, כְּשֵׁרָה.',
      en: 'One who roofs with skewers or bed frame boards: if the space between equals their width, it is fit.',
    },
    {
      he: 'הַחוֹטֵט בְּגָדִישׁ לַעֲשׂוֹת בּוֹ סֻכָּה, אֵינָהּ סֻכָּה:',
      en: 'One who hollows a space in a grain stack to make a sukka — it is not a sukka.',
    },
  ],
  // 1:9
  [
    {
      he: 'הַמְשַׁלְשֵׁל דְּפָנוֹת מִלְמַעְלָה לְמַטָּה, אִם גָּבוֹהַּ מִן הָאָרֶץ שְׁלֹשָׁה טְפָחִים, פְּסוּלָה.',
      en: 'One who lowers walls from above: if the bottom is three handbreadths above the ground, it is unfit.',
    },
    {
      he: 'מִלְּמַטָּה לְמַעְלָה, אִם גָּבוֹהַּ מִן הָאָרֶץ עֲשָׂרָה טְפָחִים, כְּשֵׁרָה.',
      en: 'From below upward: if the wall is ten handbreadths high, it is fit.',
    },
    {
      he: 'רַבִּי יוֹסֵי אוֹמֵר, כְּשֵׁם שֶׁמִּלְּמַטָּה לְמַעְלָה עֲשָׂרָה טְפָחִים, כָּךְ מִלְמַעְלָה לְמַטָּה עֲשָׂרָה טְפָחִים.',
      en: 'Rabbi Yosei says: top-down walls also need ten handbreadths.',
    },
    {
      he: 'הִרְחִיק אֶת הַסִּכּוּךְ מִן הַדְּפָנוֹת שְׁלשָׁה טְפָחִים, פְּסוּלָה:',
      en: 'If one distanced the schach three handbreadths from the walls, it is unfit.',
    },
  ],
  // 1:10
  [
    {
      he: 'בַּיִת שֶׁנִּפְחַת וְסִכֵּךְ עַל גַּבָּיו, אִם יֵשׁ מִן הַכֹּתֶל לַסִּכּוּךְ אַרְבַּע אַמּוֹת, פְּסוּלָה.',
      en: 'A breached house roofed for sukka: if four cubits remain from wall to schach, it is unfit.',
    },
    {
      he: 'וְכֵן חָצֵר שֶׁהִיא מֻקֶּפֶת אַכְסַדְרָה.',
      en: 'Likewise a courtyard surrounded by a portico.',
    },
    {
      he: 'סֻכָּה גְדוֹלָה, שֶׁהִקִּיפוּהָ בְדָבָר שֶׁאֵין מְסַכְּכִים בּוֹ, אִם יֵשׁ תַּחְתָּיו אַרְבַּע אַמּוֹת, פְּסוּלָה:',
      en: 'A large sukka ringed with invalid schach: if four cubits lie beneath it, it is unfit.',
    },
  ],
  // 1:11
  [
    {
      he: 'הָעוֹשֶׂה סֻכָּתוֹ כְּמִין צְרִיף, אוֹ שֶׁסְּמָכָהּ לְכֹתֶל, רַבִּי אֱלִיעֶזֶר פּוֹסֵל, מִפְּנֵי שֶׁאֵין לָהּ גָּג, וַחֲכָמִים מַכְשִׁירִין.',
      en: 'One who makes a circular hut sukka or leans branches against a wall: Rabbi Eliezer deems it unfit for lack of a roof; the Sages deem it fit.',
    },
    {
      he: 'מַחְצֶלֶת קָנִים גְּדוֹלָה, עֲשָׂאָהּ לִשְׁכִיבָה, מְקַבֶּלֶת טֻמְאָה וְאֵין מְסַכְּכִין בָּהּ.',
      en: 'A large reed mat made for lying: it receives impurity and may not be used for schach.',
    },
    {
      he: 'לְסִכּוּךְ, מְסַכְּכִין בָּהּ וְאֵינָהּ מְקַבֶּלֶת טֻמְאָה.',
      en: 'Made for schach: one may roof with it and it does not receive impurity.',
    },
    {
      he: 'רַבִּי אֱלִיעֶזֶר אוֹמֵר, אַחַת קְטַנָּה וְאַחַת גְּדוֹלָה, עֲשָׂאָהּ לִשְׁכִיבָה, מְקַבֶּלֶת טֻמְאָה וְאֵין מְסַכְּכִין בָּהּ. לְסִכּוּךְ, מְסַכְּכִין בָּהּ וְאֵינָהּ מְקַבֶּלֶת טֻמְאָה:',
      en: 'Rabbi Eliezer says: whether small or large, if made for lying it is impure and unfit; if made for schach it is fit.',
    },
  ],
]

const HE_GEMATRIA = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳', 'יא׳']

const QUIZ: Record<number, object[]> = {
  1: [
    {
      id: 'sq1-1',
      prompt: {
        en: 'Above what height is a sukka unfit (Sages)?',
        he: 'מעל איזה גובה הסוכה פסולה?',
      },
      choices: [
        { en: 'Twenty cubits', he: 'עשרים אמה' },
        { en: 'Ten handbreadths', he: 'עשרה טפחים' },
        { en: 'Three cubits', he: 'שלוש אמות' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq1-2',
      prompt: { en: 'Minimum wall count?', he: 'כמה דפנות?' },
      choices: [
        { en: 'Three', he: 'שלוש' },
        { en: 'Two', he: 'שתיים' },
        { en: 'Four', he: 'ארבע' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq1-3',
      prompt: { en: 'Who permits an old sukka?', he: 'מי מכשיר סוכה ישנה?' },
      choices: [
        { en: 'Beit Hillel', he: 'בית הלל' },
        { en: 'Beit Shammai', he: 'בית שמאי' },
        { en: 'Rabbi Meir', he: 'רבי מאיר' },
      ],
      answerIdx: 0,
    },
  ],
  2: [
    {
      id: 'sq2-1',
      prompt: { en: 'Sukka under a tree is like…', he: 'סוכה תחת האילן כמו…' },
      choices: [
        { en: 'Inside a house', he: 'בתוך הבית' },
        { en: 'In a courtyard', he: 'בחצר' },
        { en: 'On a roof', he: 'על הגג' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq2-2',
      prompt: { en: 'Sukka atop sukka — which is fit?', he: 'סוכה על גבי סוכה — מי כשרה?' },
      choices: [
        { en: 'The upper', he: 'העליונה' },
        { en: 'The lower', he: 'התחתונה' },
        { en: 'Both', he: 'שתיהן' },
      ],
      answerIdx: 0,
    },
  ],
  3: [
    {
      id: 'sq3-1',
      prompt: { en: 'Sheet over kinof (4-post) bed?', he: 'סדין על קינוף?' },
      choices: [
        { en: 'Unfit', he: 'פסול' },
        { en: 'Fit', he: 'כשר' },
        { en: 'Fit only at night', he: 'כשר בלילה' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq3-2',
      prompt: { en: 'Sheet on naklitei (2-post) bed?', he: 'סדין על נקליטי מיטה?' },
      choices: [
        { en: 'Permitted', he: 'מותר' },
        { en: 'Forbidden', he: 'אסור' },
        { en: 'Walls only', he: 'רק לדפנות' },
      ],
      answerIdx: 0,
    },
  ],
  4: [
    {
      id: 'sq4-1',
      prompt: { en: 'Trellised vine still attached — fit?', he: 'גפן מחוברת לקרקע — כשר?' },
      choices: [
        { en: 'Unfit', he: 'פסול' },
        { en: 'Fit', he: 'כשר' },
        { en: 'Fit if cut', he: 'כשר אם קצץ' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq4-2',
      prompt: { en: 'May one use impure vessels for schach?', he: 'מסככים בכלי טומאה?' },
      choices: [
        { en: 'No', he: 'לא' },
        { en: 'Yes', he: 'כן' },
        { en: 'Only for walls', he: 'רק לדפנות' },
      ],
      answerIdx: 0,
    },
  ],
  5: [
    {
      id: 'sq5-1',
      prompt: { en: 'Tied straw bundles for schach?', he: 'חבילות קש לסכך?' },
      choices: [
        { en: 'Not permitted', he: 'אסור' },
        { en: 'Permitted', he: 'מותר' },
        { en: 'Permitted if wet', he: 'מותר אם רטוב' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq5-2',
      prompt: { en: 'Tied bundles for walls?', he: 'חבילות לדפנות?' },
      choices: [
        { en: 'Permitted', he: 'מותר' },
        { en: 'Forbidden', he: 'אסור' },
        { en: 'Only straw', he: 'רק קש' },
      ],
      answerIdx: 0,
    },
  ],
  6: [
    {
      id: 'sq6-1',
      prompt: { en: 'Who permits roofing with boards?', he: 'מי מתיר נסרים?' },
      choices: [
        { en: 'Rabbi Yehuda', he: 'רבי יהודה' },
        { en: 'Rabbi Meir', he: 'רבי מאיר' },
        { en: 'Beit Shammai', he: 'בית שמאי' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq6-2',
      prompt: {
        en: '4-tefach board on top — may you sleep under it?',
        he: 'נותן נסר ד׳ — ישן תחתיו?',
      },
      choices: [
        { en: 'No', he: 'לא' },
        { en: 'Yes', he: 'כן' },
        { en: 'Only on Shabbat', he: 'רק בשבת' },
      ],
      answerIdx: 0,
    },
  ],
  7: [
    {
      id: 'sq7-1',
      prompt: { en: 'Beit Hillel require…', he: 'בית הלל דורשים…' },
      choices: [
        { en: 'Move OR remove one board', he: 'מפקפק או נוטל אחד' },
        { en: 'Move AND remove one', he: 'מפקפק ונוטל' },
        { en: 'Remove two boards', he: 'נוטל שניים' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq7-2',
      prompt: { en: 'R. Meir says to…', he: 'רבי מאיר אומר…' },
      choices: [
        { en: 'Remove one board only', he: 'נוטל אחד בלבד' },
        { en: 'Move all boards', he: 'מפקפק הכל' },
        { en: 'Rebuild entirely', he: 'בונה מחדש' },
      ],
      answerIdx: 0,
    },
  ],
  8: [
    {
      id: 'sq8-1',
      prompt: { en: 'Hollowed grain stack sukka?', he: 'סוכה בגדיש?' },
      choices: [
        { en: 'Not a sukka', he: 'אינה סוכה' },
        { en: 'Fit', he: 'כשרה' },
        { en: 'Fit with schach', he: 'כשרה עם סכך' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq8-2',
      prompt: { en: 'Skewers with gaps equal to their width?', he: 'שפודים ורווח כרוחבם?' },
      choices: [
        { en: 'Fit (with schach in gaps)', he: 'כשר' },
        { en: 'Always unfit', he: 'תמיד פסול' },
        { en: 'Walls only', he: 'רק לדפנות' },
      ],
      answerIdx: 0,
    },
  ],
  9: [
    {
      id: 'sq9-1',
      prompt: { en: 'Wall built bottom-up needs…', he: 'דופן מלמטה למעלה צריכה…' },
      choices: [
        { en: 'Ten handbreadths', he: 'עשרה טפחים' },
        { en: 'Three handbreadths', he: 'שלושה טפחים' },
        { en: 'Seven handbreadths', he: 'שבעה טפחים' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq9-2',
      prompt: { en: 'Schach 3 tefach from walls?', he: 'סכך רחוק ג׳ טפחים מהדופן?' },
      choices: [
        { en: 'Unfit', he: 'פסול' },
        { en: 'Fit', he: 'כשר' },
        { en: 'Fit if temporary', he: 'כשר אם עראי' },
      ],
      answerIdx: 0,
    },
  ],
  10: [
    {
      id: 'sq10-1',
      prompt: { en: 'Four amot of ceiling before schach?', he: 'ד׳ אמות תקרה לפני הסכך?' },
      choices: [
        { en: 'Unfit', he: 'פסול' },
        { en: 'Fit', he: 'כשר' },
        { en: 'Fit with dispute', he: 'כשר במחלוקת' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq10-2',
      prompt: {
        en: 'Less than 4 amot ceiling — principle applied?',
        he: 'פחות מד׳ אמות — איזה עיקרון?',
      },
      choices: [
        { en: 'Curved wall (fit)', he: 'דופן עקומה' },
        { en: 'Invalid always', he: 'תמיד פסול' },
        { en: 'Requires new walls', he: 'צריך דפנות חדשות' },
      ],
      answerIdx: 0,
    },
  ],
  11: [
    {
      id: 'sq11-1',
      prompt: { en: 'Circular hut sukka — Sages say?', he: 'סוכה כצריף — חכמים?' },
      choices: [
        { en: 'Fit', he: 'מכשירים' },
        { en: 'Unfit', he: 'פוסלים' },
        { en: 'Fit only with three walls', he: 'כשר רק עם ג׳ דפנות' },
      ],
      answerIdx: 0,
    },
    {
      id: 'sq11-2',
      prompt: { en: 'Reed mat made for sleeping?', he: 'מחצלת לשכיבה?' },
      choices: [
        { en: 'May not use for schach', he: 'אין מסככין בה' },
        { en: 'May use for schach', he: 'מסככין בה' },
        { en: 'Walls only', he: 'רק לדפנות' },
      ],
      answerIdx: 0,
    },
  ],
}

const SCENARIO_VISUALS: Record<
  number,
  | {
      type: 'sukkah-boss'
      title: { en: string; he: string }
      extra?: object
    }
  | { type: 'sukkah-dimensions'; title: { en: string; he: string }; extra?: object }
  | { type: 'sukkah-layers'; title: { en: string; he: string } }
  | {
      type: 'sukkah-walls'
      title: { en: string; he: string }
      minWallTefachim: number
      maxGroundGapTefachim: number
    }
  | { type: 'sukkah-scenario'; scenario: string; title: { en: string; he: string } }
> = {
  1: {
    type: 'sukkah-boss',
    title: { en: 'Boss level: build the sukkah!', he: 'שלב הבוס: בונים את הסוכה!' },
    extra: {
      minHeightTefachim: 10,
      maxHeightAmot: 20,
      minWalls: 3,
      dispute: {
        figure: { en: 'R. Yehuda', he: 'רבי יהודה' },
        opinion: { en: 'permits above 20 amot', he: 'מכשיר מעל כ׳ אמה' },
      },
    },
  },
  2: { type: 'sukkah-layers', title: { en: 'Placement rules', he: 'כללי מיקום' } },
  3: {
    type: 'sukkah-scenario',
    scenario: 'sheets',
    title: { en: 'Sheets & beds', he: 'סדינים ומיטות' },
  },
  4: {
    type: 'sukkah-scenario',
    scenario: 'vine-trellis',
    title: { en: 'Schach materials', he: 'חומרי סכך' },
  },
  5: { type: 'sukkah-scenario', scenario: 'bundles', title: { en: 'Bundles', he: 'חבילות' } },
  6: { type: 'sukkah-scenario', scenario: 'boards', title: { en: 'Boards', he: 'נסרים' } },
  7: {
    type: 'sukkah-scenario',
    scenario: 'ceiling-planks',
    title: { en: 'Old plank ceiling', he: 'תקרת נסרים' },
  },
  8: {
    type: 'sukkah-scenario',
    scenario: 'skewers-grain',
    title: { en: 'Skewers & grain', he: 'שפודים וגדיש' },
  },
  9: {
    type: 'sukkah-walls',
    title: { en: 'Building walls', he: 'בניית דפנות' },
    minWallTefachim: 10,
    maxGroundGapTefachim: 3,
  },
  10: {
    type: 'sukkah-scenario',
    scenario: 'four-amot',
    title: { en: 'Four amot rule', he: 'כלל ד׳ אמות' },
  },
  11: {
    type: 'sukkah-scenario',
    scenario: 'reed-mat',
    title: { en: 'Mats & hut shape', he: 'מחצלות וצורה' },
  },
}

function visualAid(n: number) {
  const v = SCENARIO_VISUALS[n]
  if (!v) return undefined
  if (v.type === 'sukkah-boss') {
    const { extra, title } = v
    return {
      kind: 'scene3d' as const,
      spec: { preset: 'sukkah-boss' as const, title, ...extra },
    }
  }
  if (v.type === 'sukkah-dimensions') {
    const { extra, title } = v
    return { kind: 'diagram2d' as const, spec: { type: v.type, title, ...extra } }
  }
  if (v.type === 'sukkah-layers') {
    return { kind: 'diagram2d' as const, spec: { type: v.type, title: v.title } }
  }
  if (v.type === 'sukkah-walls') {
    const { title, minWallTefachim, maxGroundGapTefachim } = v
    return {
      kind: 'diagram2d' as const,
      spec: { type: v.type, title, minWallTefachim, maxGroundGapTefachim },
    }
  }
  return {
    kind: 'diagram2d' as const,
    spec: { type: 'sukkah-scenario' as const, scenario: v.scenario, title: v.title },
  }
}

const chapter = {
  schemaVersion: 1,
  order: 'moed',
  tractate: 'sukkah',
  chapter: 1,
  title: { en: 'Sukkah Chapter 1', he: 'משנה סוכה פרק א׳' },
  mishnayot: MISHNAYOT.map((pairs, idx) => {
    const n = idx + 1
    return {
      schemaVersion: 1,
      id: `mishnah-sukkah-1-${n}`,
      ref: `Mishnah Sukkah 1:${n}`,
      heRef: `משנה סוכה א׳:${HE_GEMATRIA[idx]}`,
      order: 'moed',
      tractate: 'sukkah',
      chapter: 1,
      number: n,
      phrases: pairs.map((p) => ({
        he: p.he,
        translations: { en: p.en },
        ...(p.translit ? { translit: p.translit } : {}),
      })),
      quiz: QUIZ[n] ?? [],
      ...(visualAid(n) ? { visualAid: visualAid(n) } : {}),
      source: {
        heVersion: 'Torat Emet 357',
        enVersion: 'Mishnah Yomit by Dr. Joshua Kulp (adapted)',
        license: 'CC-BY / Public Domain',
        url: `https://www.sefaria.org/Mishnah_Sukkah.1.${n}`,
      },
    }
  }),
}

const parsed = ChapterSchema.parse(chapter)
const out = join(import.meta.dirname, '../src/content/authoring/Mishnah_Sukkah_1.json')
writeFileSync(out, JSON.stringify(parsed, null, 2) + '\n')
console.log(`Wrote ${out} (${parsed.mishnayot.length} mishnayot)`)
