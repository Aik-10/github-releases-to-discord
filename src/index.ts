import fetch from 'node-fetch'
import core from "@actions/core";
import github from '@actions/github';
import { GetPayloadContent } from "./Actions/GetPayloadContent";
import { HandlePayloadContentReplace } from "./Actions/HandlePayloadContentReplace";
import { InvalidWebhookException } from './Exceptions/InvalidWebhookException';
import { InvalidPayloadException } from './Exceptions/InvalidPayloadException';

core.debug(`Waiting milliseconds 1 ...`)

const action = async(): Promise<void> => {
    
    core.debug(`Waiting in action 4 ...`)
    
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

    core.setOutput('time', new Date().toTimeString())
}

core.debug(`Waiting milliseconds 2 ...`)
core.debug(new Date().toTimeString())

action().then(() => { core.info('Discord Action completed successfully') })
    .catch(err => { core.setFailed(err.message) })

core.debug(`Waiting milliseconds 3 ...`)

async function run() {
    try {
        core.debug(`Waiting milliseconds 10010 ...`)
        core.debug(new Date().toTimeString())
    } catch (error: any) {
        core.setFailed(error.message)
    }
}