export const HandlePayloadContentReplace = ({ body, replaceChange, replaceContributors }: ContentReplace): PayloadBody => {
    body
        .replace(/<!-- Release notes generated using configuration in \.github\/release\.yml at .* -->/g, "")
        .replace(/\*\*Full Changelog\*\*: https:\/\/github\.com\/[^\/]+\/[^\/]+\/commits\/[^ ]+/g, "")
        .replace(/### (.*?)\n/g, function (substring) {
            const newString = substring.slice(4).replace(/(\r\n|\n|\r)/gm, "")
            return `**__${newString}__**`
        })
        .replace(/## (.*?)\n/g, function (substring) {
            const newString = substring.slice(3).replace(/(\r\n|\n|\r)/gm, "")
            return `**${newString}**`
        })
        .replace(/\n\s*\n/g, '\n')
        .replace(/\ in https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+/g, '')

    if (replaceChange) {
        body.replace(/What's Changed/g, replaceChange)
    }

    if (replaceContributors) {
        body.replace(/New Contributors/g, replaceContributors)
    }

    return body;
}