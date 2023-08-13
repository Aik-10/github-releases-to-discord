type PayloadBody = string;

type FooterTimestamp = 'true' | 'True' | 'TRUE' | null


type PayloadContent = {
    body: PayloadBody;
    name: string;
    html_url?: string;
}

type ContentReplace = {
    body: PayloadBody,
    replaceChange?: string,
    replaceContributors?: string,
}

type Colors = "0"
    | "1752220"
    | "1146986"
    | "5763719"
    | "2067276"
    | "3447003"
    | "2123412"
    | "10181046"
    | "7419530"
    | "15277667"
    | "11342935"
    | "15844367"
    | "12745742"
    | "15105570"
    | "11027200"
    | "15548997"
    | "10038562"
    | "9807270"
    | "9936031"
    | "8359053"
    | "12370112"
    | "3426654"
    | "2899536"
    | "16776960"