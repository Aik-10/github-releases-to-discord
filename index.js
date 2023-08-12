import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch'


const formatPayloadDescription = (body) => {
    return body
        .replace(/### (.*?)\n/g, function (substring) {
            const newString = substring.slice(4).replace(/(\r\n|\n|\r)/gm, "")
            return `**__${newString}__**`
        })
        .replace(/## (.*?)\n/g, function (substring) {
            const newString = substring.slice(3).replace(/(\r\n|\n|\r)/gm, "")
            return `**${newString}**`
        })
        .replace(/\n\s*\n/g, '\n')
}

async function getPayloadContext() {
    const payload = github.context.payload;

    if (payload?.release?.body?.length >= 1500) {
        core.warning(`Payload message is longer than 1500 characters, so it will be parsed.`);
    }

    return {
        body: payload.release.body.length < 1500
            ? payload.release.body
            : payload.release.body.substring(0, 1500) + ` ([...](${payload.release.html_url}))`,
        html_url: payload.release.html_url,
        name: payload.release.name,
    }
}


async function action() {
    const webhook = core.getInput('webhook_url');
    const embedColor = core.getInput('color');
    const displayName = core.getInput('username');
    const avatarUrl = core.getInput('avatar_url');
    const footerTimestamp = core.getInput('footer_timestamp');
    const overrideURL = core.getInput('override_url');

    if (!webhook) {
        return core.setFailed(`Invalid variable "webhook_url". Please set it.`)
    }

    const { body, name, html_url } = await getPayloadContext();
    const description = formatPayloadDescription(body);

    let embedMessageBody = {
        title: name,
        url: overrideURL ? overrideURL : html_url,
        color: embedColor,
        description: description,
        footer: {}
    }

    if (footerTimestamp == 'true' || footerTimestamp === 'yes') embedMessageBody.timestamp = new Date().toISOString();

    fetch(`${webhook}?wait=true`, {
        method: 'post',
        body: JSON.stringify(
            {
                embeds: [embedMessageBody],
                username: displayName ?? undefined,
                avatar_url: avatarUrl ?? undefined,
            }
        ),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then(data => core.info(JSON.stringify(data)))
    .catch(err => core.info(err))
}

action().then(() => { core.info('Discord Action completed successfully') })
    .catch(err => { core.setFailed(err.message) })