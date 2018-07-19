const YAML = require('yamljs');
const { Validator } = require('jsonschema');
// See https://learn.getgrav.org/content/headers
const metadataSchema = require('./frontmatter.schema.json');

module.exports = {
    names: ['valid-metadata-block'],
    description: 'Rule that reports if a file does not have a valid grav metadata block',
    tags: ['test'],
    function: function rule(params, onError) {
        if (!params.frontMatterLines || params.frontMatterLines.length < 3) {
            onError({
                lineNumber: 1,
                detail: 'Missing grav metadata block',
            });
            return;
        }
        if (params.frontMatterLines[0] !== '---') {
            onError({
                lineNumber: 1,
                detail: "Grav metadata block has to start with a '---'",
                context: params.frontMatterLines[0],
            });
            return;
        }
        if (params.frontMatterLines[params.frontMatterLines.length - 1] !== '---') {
            onError({
                lineNumber: 1,
                detail: "Grav metadata block has to end with a '---'",
                context: params.frontMatterLines[params.frontMatterLines.length - 1],
            });
            return;
        }
        const yamlString = params.frontMatterLines.slice(1, -1).join('\n');
        let yamlDocument;
        try {
            yamlDocument = YAML.parse(yamlString);
        } catch (err) {
            onError({
                lineNumber: 1,
                detail: 'Error parsing grav metadata block',
                context: err.toString(),
            });
            return;
        }

        if (!yamlDocument) {
            onError({
                lineNumber: 1,
                detail: 'Grav metadata is not a valid yaml document',
                context: yamlString,
            });
            return;
        }

        const v = new Validator();

        const validation = v.validate(yamlDocument, metadataSchema);

        validation.errors.forEach((validationError) => {
            onError({
                lineNumber: 1,
                detail: validationError.toString(),
                context: yamlString,
            });
        });
    },
};
