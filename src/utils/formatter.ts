export class Formatter{
  static formatDate(value: string | Date): string {
    const date = new Date(value);

    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  }
}