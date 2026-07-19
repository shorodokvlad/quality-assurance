const americanOnly = require('./american-only.js')
const americanToBritishSpelling = require('./american-to-british-spelling.js')
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishToAmericanTitles = require("./british-to-american-titles.js")
const britishOnly = require('./british-only.js')

// Reverse object key/value pairs
const reverseDict = (obj) =>
    Object.assign({}, ...Object.entries(obj).map(([k, v]) => ({ [v]: k })));

// American/British dictionary
const americanBritishDict = {
    ...americanOnly,
    ...americanToBritishSpelling,
};

// British/American dictionary
const reverseAmericanToBritishSpelling = reverseDict(americanToBritishSpelling);

const britishAmericanDict = {
    ...britishOnly,
    ...reverseAmericanToBritishSpelling,
};

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Translator logic
const translate = (str, locale) => {
    const originalStr = str;
    const lowerCasedOriginalStr = originalStr.toLowerCase();
    const translationType = locale;

    const dict =
        translationType === "american-to-british"
            ? americanBritishDict
            : britishAmericanDict;

    const titlesHonorificsDict =
        translationType === "american-to-british"
            ? americanToBritishTitles
            : britishToAmericanTitles;

    const timeRegex =
        translationType === "american-to-british"
            ? /([0-9]|1[012]):[0-5][0-9]/gi
            : /([0-9]|1[012])\.[0-5][0-9]/gi;

    const matchesMap = {};

    // 1. Search for titles/honorifics and add'em to the matchesMap object (using lowercase keys to avoid duplicates)
    Object.entries(titlesHonorificsDict).map(([k, v]) => {
        const re = new RegExp(`(?<![a-zA-Z])${escapeRegExp(k)}(?![a-zA-Z])`, 'gi');
        if (re.test(lowerCasedOriginalStr)) {
            let spl = v.split('')
            spl[0] = spl[0].toUpperCase()
            matchesMap[k.toLowerCase()] = spl.join('');
        }
    });

    // 2. Filter words with spaces from current dictionary
    const wordsWithSpace = Object.fromEntries(
        Object.entries(dict).filter(([k, v]) => k.includes(" "))
    );

    // Search for spaced word matches and add'em to the matchesMap object
    Object.entries(wordsWithSpace).map(([k, v]) => {
        const re = new RegExp(`(?<![a-zA-Z])${escapeRegExp(k)}(?![a-zA-Z])`, 'gi');
        if (re.test(lowerCasedOriginalStr)) {
            matchesMap[k.toLowerCase()] = v;
        }
    });

    // 3. Search for individual word matches and add'em to the matchesMap object
    const words = lowerCasedOriginalStr.match(/(\w+([-'])(\w+)?['-]?(\w+))|\w+/g) || [];
    words.forEach((word) => {
        if (dict[word]) {
            matchesMap[word.toLowerCase()] = dict[word];
        }
    });

    // 4. Search for time matches and add'em to the matchesMap object
    const matchedTimes = lowerCasedOriginalStr.match(timeRegex);

    if (matchedTimes) {
        matchedTimes.map((e) => {
            if (translationType === "american-to-british") {
                return (matchesMap[e.toLowerCase()] = e.replace(":", "."));
            }
            return (matchesMap[e.toLowerCase()] = e.replace(".", ":"));
        });
    }

    // No matches
    if (Object.keys(matchesMap).length === 0) return null;

    // Apply replacements by length descending to match longer phrases first
    const sortedTerms = Object.keys(matchesMap).sort((a, b) => b.length - a.length);

    let translation = originalStr;
    let translationWithHighlight = originalStr;

    sortedTerms.forEach((term) => {
        const replacement = matchesMap[term];
        const escTerm = escapeRegExp(term);
        const re = new RegExp(`(?<![a-zA-Z])${escTerm}(?![a-zA-Z])`, 'gi');

        translation = translation.replace(re, (matched) => {
            // Check if matched is capitalized
            if (matched[0] === matched[0].toUpperCase()) {
                return replacement[0].toUpperCase() + replacement.slice(1);
            }
            return replacement;
        });

        translationWithHighlight = translationWithHighlight.replace(re, (matched) => {
            let repl = replacement;
            if (matched[0] === matched[0].toUpperCase()) {
                repl = replacement[0].toUpperCase() + replacement.slice(1);
            }
            return `<span class="highlight">${repl}</span>`;
        });
    });

    if (translation === originalStr) return null;

    return [translation, translationWithHighlight];
};

module.exports = translate;