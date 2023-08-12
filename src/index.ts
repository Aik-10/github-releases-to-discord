import fetch from 'node-fetch'
import core from "@actions/core";
import github from '@actions/github';
import { GetPayloadContent } from "./Actions/GetPayloadContent";
import { HandlePayloadContentReplace } from "./Actions/HandlePayloadContentReplace";

const action = async () => {
    const webhook = core.getInput('webhook_url');
    const embedColor = core.getInput('color') as Colors;
    const displayName = core.getInput('username');
    const avatarUrl = core.getInput('avatar_url');
    const footerTimestamp = core.getInput('footer_timestamp') as FooterTimestamp;
    const overrideURL = core.getInput('override_url');
    const replaceChange = core.getInput('replace_change');
    const replaceContributors = core.getInput('replace_contributors');

    if (!webhook) {
        throw new InvalidWebhookException();
    }

    if (!github.context.payload) {
        throw new InvalidPayloadException();
    }

    const { body, name, html_url } = await GetPayloadContent(github.context.payload);
    const description = HandlePayloadContentReplace({ body, replaceChange, replaceContributors });

    const MessageEmbed = {
        title: name,
        url: overrideURL ? overrideURL : html_url,
        color: embedColor,
        description: description,
        footer: {},
        timestamp: footerTimestamp ? new Date().toISOString() : undefined 
    }

    fetch(`${webhook}?wait=true`, {
        method: 'post',
        body: JSON.stringify(
            {
                embeds: [MessageEmbed],
                username: displayName ?? undefined,
                avatar_url: avatarUrl ?? undefined,
            }
        ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => core.info(JSON.stringify(data)))
}

action().then(() => { core.info('Discord Action completed successfully') })
    .catch(err => { core.setFailed(err.message) })

