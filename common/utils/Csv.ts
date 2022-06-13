import { Article } from "@common/types";

const csvSeparator = ";";

export default class Csv<C> {
  private colsNames: string[];

  private rows: string[][];

  private toRow: (row: C) => string[];

  private readonly separator;

  constructor(
    colsName: string[],
    toRow: (c: C) => string[],
    separator = csvSeparator,
  ) {
    this.colsNames = colsName;
    this.rows = [];
    this.toRow = toRow;
    this.separator = separator;
  }

  public addRow(row: C) {
    this.rows.push(this.toRow(row));
  }

  public addRows(rows: C[]) {
    rows.forEach((row) => this.addRow(row));
  }

  public toString(): string {
    const header = this.colsNames.join(this.separator);
    const rows = this.rows.map((row) => row.join(this.separator));
    return [header, ...rows].join("\n");
  }

  public toBlob(): Blob {
    return new Blob([this.toString()], {
      type: `text/csv;charset=utf-8;sep=${this.separator}\n`,
    });
  }

  public toFile(filename: string): void {
    const blob = this.toBlob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
}

export const articleColsNames = [
  "Citation style: MLA",
  "Citation style: APA",
  "Abstract",
  "Title",
  "Authors",
  "Year",
  "Citations",
  "References",
] as const;

export function articleMLA(article: Article): string {
  const authors = article.authors.map((author) => author[1]).join(", ");
  let str = `${authors}. "${article.title}".`;
  if (article.journalName) {
    str += ` ${article.journalName},`;
  }
  str += ` ${article.year}.`;

  return str;
}

export function articleAPA(article: Article): string {
  const authors = article.authors.map((author) => author[1]).join(", ");
  let str = `${authors}. (${article.year}). "${article.title}".`;
  if (article.journalName) {
    str += ` ${article.journalName}.`;
  }
  if (article.doi) {
    str += ` ${article.doi}.`;
  }
  return str;
}

export function ArticleToRow(article: Article): string[] {
  return [
    articleMLA(article),
    articleAPA(article),
    article.paperAbstract.replace(/;/g, ","),
    article.title,
    article.authors.map((author) => author[1]).join(", "),
    article.year.toString(),
    article.nbInCitations.toString(),
    article.nbOutCitations.toString(),
  ];
}
