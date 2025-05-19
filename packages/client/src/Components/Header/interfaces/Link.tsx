export default interface ILink {
    href: string;
    helperText: string;
    label: string;
    subdomains?: ILink[];
};