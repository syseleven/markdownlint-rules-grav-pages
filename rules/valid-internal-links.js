const fs = require('fs');
const flat = require('../lib/flat');

module.exports = {
    names: ['valid-internal-links'],
    description: 'Rule that reports if a file has an internal link to an invalid file',
    tags: ['test'],
    function: function rule(params, onError) {
        flat(params.tokens).filter(token => token.type === 'link_open').forEach((link) => {
            link.attrs.forEach((attr) => {
                if (attr[0] === 'href') {
                    const href = attr[1];
                    if (href.match(/^#/)) {
                        let anchorFound = false;
                        params.tokens.filter(token => token.type === 'heading_open').forEach((heading) => {
                            const headingAnchor = heading.line.trim().replace(/^[#\s]*/g, '').toLowerCase().replace(/[^a-z0-9_?!.,:]/g, '-');
                            if (`#${headingAnchor}` === href) {
                                anchorFound = true;
                            }
                        });
                        if (!anchorFound) {
                            onError({
                                lineNumber: link.lineNumber,
                                detail: `Did not find matching heading for anchor '${href}'`,
                                context: link.line,
                            });
                        }
                    } else if (!href.match(/^(mailto:|https?:)/)) {
                        let path;
                        if (href.match(/^\//)) {
                            path = `pages${href}`;
                        } else {
                            path = `${params.name.split('/').slice(0, -1).join('/')}/${href}`;
                        }
                        if (!fs.existsSync(path) || !fs.lstatSync(path).isFile()) {
                            onError({
                                lineNumber: link.lineNumber,
                                detail: `Relative link '${href}' does not link to a valid file.`,
                                context: link.line,
                            });
                        }
                    }
                }
            });
        });
    },
};
