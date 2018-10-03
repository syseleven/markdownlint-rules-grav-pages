const markdownlint = require('markdownlint');
const validInternalLinks = require('../rules/valid-internal-links');

test('validate internal link', () => {
    const src = `${__dirname}/assets/valid-internal-links/test.md`;
    const results = markdownlint.sync({
        customRules: validInternalLinks,
        files: [src],
        config: {
            default: true,
            'no-trailing-punctuation': {
                punctuation: '.,;:!',
            },
        },
    });

    expect(results[src]).toEqual([
        {
            lineNumber: 13,
            ruleNames: ['valid-internal-links'],
            ruleDescription: 'Rule that reports if a file has an internal link to an invalid file',
            errorDetail: 'Relative link \'test.invalid\' does not link to a valid file.',
            errorContext: '[Text](test.invalid)',
            errorRange: null,
        },
        {
            lineNumber: 17,
            ruleNames: ['valid-internal-links'],
            ruleDescription: 'Rule that reports if a file has an internal link to an invalid file',
            errorDetail: 'Relative link \'../valid-images/invalid.md\' does not link to a valid file.',
            errorContext: '[Text](../valid-images/invalid.md)',
            errorRange: null,
        },
        {
            lineNumber: 21,
            ruleNames: ['valid-internal-links'],
            ruleDescription: 'Rule that reports if a file has an internal link to an invalid file',
            errorDetail: 'Relative link \'../valid-images\' does not link to a valid file.',
            errorContext: '[Text](../valid-images)',
            errorRange: null,
        },
        {
            lineNumber: 23,
            ruleNames: ['valid-internal-links'],
            ruleDescription: 'Rule that reports if a file has an internal link to an invalid file',
            errorDetail: 'Relative link \'test.invalid\' does not link to a valid file.',
            errorContext: 'As child: valid [Text](test.md) invalid [Text](test.invalid)',
            errorRange: null,
        },
        {
            errorContext: '[Anchor](#invalid-anchor)',
            errorDetail: "Did not find matching heading for anchor '#invalid-anchor'",
            errorRange: null,
            lineNumber: 26,
            ruleDescription: 'Rule that reports if a file has an internal link to an invalid file',
            ruleNames: [
                'valid-internal-links',
            ],
        },
        {
            errorContext: '[Text](../valid-images/test.md#invalid-external-anchor)',
            errorDetail: "Did not find matching heading for anchor '#invalid-external-anchor'",
            errorRange: null,
            lineNumber: 36,
            ruleDescription: 'Rule that reports if a file has an internal link to an invalid file',
            ruleNames: [
                'valid-internal-links',
            ],
        },
    ]);
});
