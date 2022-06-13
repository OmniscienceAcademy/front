import Link from "next/link";

export interface IFooterLink {
  url: string;
  name: string;
}

export interface FooterColumnProps {
  title: IFooterLink;
  links: IFooterLink[];
}

export default function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <ul>
      <li>
        <h3>
          <Link href={title.url}>{title.name}</Link>
        </h3>
      </li>
      {links.map(({ url, name }) => (
        <li key={url + name}>
          <Link href={url}>{name}</Link>
        </li>
      ))}
    </ul>
  );
}
